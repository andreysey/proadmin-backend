import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. Register a new user
  async register(data: RegisterDto) {
    // Check if the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password (10 is the salt rounds/complexity)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Prepare create data
    const roleValue = (['ADMIN', 'USER', 'MODERATOR'].includes(data.role?.toUpperCase() || '')
      ? data.role!.toUpperCase()
      : 'USER') as Role;

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
        role: roleValue,
      },
    });

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password, refreshToken: _, ...result } = user;
    return {
      ...result,
      ...tokens,
    };
  }

  // 2. Validate user and generate token
  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password, refreshToken: _, ...result } = user;
    return {
      ...result,
      ...tokens,
    };
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username },
        { expiresIn: '1h' },
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
        { expiresIn: '7d' },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      const userId = decoded.sub;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!rtMatches) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.getTokens(user.id, user.username);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (e) {
      throw new UnauthorizedException('Access Denied');
    }
  }
}
