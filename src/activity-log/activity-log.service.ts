import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async log(type: string, title: string, description: string, userId?: string) {
    try {
      return await this.prisma.activityLog.create({
        data: {
          type,
          title,
          description,
          userId,
        },
      });
    } catch (error) {
      console.error('Failed to create activity log:', error);
    }
  }

  async getRecent(limit = 10) {
    return this.prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(skip = 0, take = 10) {
    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityLog.count(),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        timestamp: item.createdAt.toISOString(),
      })),
      total,
    };
  }
}
