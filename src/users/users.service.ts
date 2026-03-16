import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, BulkUpdateRoleDto } from './dto/user-update.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const ALLOWED_SORT_FIELDS = ['displayId', 'username', 'email', 'role', 'createdAt'];
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const finalSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      const isNumeric = !isNaN(Number(search));
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        ...(isNumeric ? [{ displayId: Number(search) }] : []),
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        orderBy: { [finalSortBy]: sortOrder },
        select: {
          id: true,
          displayId: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        displayId: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const currentUser = await this.prisma.user.findUnique({ where: { id } });

    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        displayId: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (data.role && currentUser && currentUser.role !== data.role) {
      await this.activityLog.log(
        'user_updated',
        'User role updated',
        `Role for @${user.username} was changed from ${currentUser.role} to ${data.role}`,
        user.id,
      );
    } else {
      await this.activityLog.log(
        'user_updated',
        'User profile updated',
        `Profile for @${user.username} was updated`,
        user.id,
      );
    }

    return user;
  }

  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    const { ids, role } = bulkUpdateRoleDto;

    const results = await this.prisma.$transaction(
      ids.map((id) =>
        this.prisma.user.update({
          where: { id },
          data: { role },
          select: { id: true, username: true, role: true },
        })
      )
    );

    // Log each role update
    for (const user of results) {
      await this.activityLog.log(
        'user_updated',
        'User role updated',
        `Role for @${user.username} changed to ${user.role} (Bulk Update)`,
        user.id,
      );
    }

    return results;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    await this.activityLog.log(
      'user_delete',
      'User deleted',
      `Account for @${user.username} (#${user.displayId}) was removed`,
      user.id,
    );

    return user;
  }

  async exportAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        displayId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
