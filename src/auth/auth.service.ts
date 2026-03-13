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
    const userData: any = {
      email: data.email,
      password: hashedPassword,
      username: data.username,
    };

    // Safely assign role if valid enum value
    if (data.role && (data.role === 'ADMIN' || data.role === 'USER')) {
      userData.role = data.role as Role;
    }

    // Save the user
    const user = await this.prisma.user.create({
      data: userData,
    });

    // Generate JWT immediately so user is logged in
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password: _, ...result } = user;

    return {
      user: result,
      access_token: token,
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

    // Compare provided password with the hash in the DB
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    return {
      access_token: this.jwtService.sign({ userId: user.id, email: user.email, role: user.role }),
    };
  }
}
