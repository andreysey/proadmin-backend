import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  async getStats() {
    const [totalUsers, adminCount, lastMonthUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Calculate growth (relative to current total - simplified)
    const monthlyGrowth = totalUsers > 0 ? (lastMonthUsers / totalUsers) * 100 : 0;

    return {
      totalUsers,
      activeNow: Math.floor(Math.random() * 10) + 1, // Realistic mock for now
      totalRevenue: totalUsers * 42, // Dummy logic: $42 per user
      monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1)),
    };
  }

  async getActivity() {
    // Fetch user registrations for the last 7 days
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const activityData = await Promise.all(
      last7Days.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const count = await this.prisma.user.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        });

        return {
          timestamp: date.toISOString(),
          value: count,
        };
      }),
    );

    return [
      {
        type: 'new_users',
        data: activityData,
      },
      {
        type: 'revenue',
        data: this.generateMockSeries(200, 500),
      },
    ];
  }

  async getRecent() {
    const logs = await this.activityLog.getRecent(4);

    return logs.map((log) => ({
      id: log.id,
      type: log.type,
      title: log.title,
      description: log.description,
      timestamp: log.createdAt.toISOString(),
    }));
  }

  async getRevenue() {
    return [
      { month: 'Jan', revenue: 4000, orders: 120 },
      { month: 'Feb', revenue: 3000, orders: 90 },
      { month: 'Mar', revenue: 5000, orders: 150 },
      { month: 'Apr', revenue: 4500, orders: 130 },
    ];
  }

  private generateMockSeries(min: number, max: number) {
    return Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      value: Math.floor(Math.random() * (max - min + 1) + min),
    })).reverse();
  }
}
