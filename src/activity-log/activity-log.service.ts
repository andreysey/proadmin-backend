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
}
