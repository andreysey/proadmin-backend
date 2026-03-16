import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  private getStartDate(range?: string): Date {
    const now = new Date();
    switch (range) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  async getStats(dateRange?: string) {
    const startDate = this.getStartDate(dateRange);

    const [totalUsers, adminCount, recentUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ]);

    // Calculate growth (relative to current total)
    const growth = totalUsers > 0 ? (recentUsers / totalUsers) * 100 : 0;

    return {
      totalUsers,
      activeNow: Math.floor(Math.random() * 10) + 1,
      totalRevenue: totalUsers * 42,
      monthlyGrowth: parseFloat(growth.toFixed(1)), // Renamed from monthlyGrowth to just be growth based on range? 
      // Actually frontend expects monthlyGrowth, let's keep the key but use the filtered data
    };
  }

  async getActivity(dateRange: string = '7d') {
    const now = new Date();
    const startDate = this.getStartDate(dateRange);
    
    // Determine interval (number of days to show)
    const days = dateRange === '24h' ? 1 : dateRange === '30d' ? 30 : 7;
    
    const activityData = await Promise.all(
      Array.from({ length: days }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        d.setHours(0, 0, 0, 0);
        return d;
      })
        .reverse()
        .map(async (date) => {
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
        data: this.generateMockSeries(days),
      },
    ];
  }

  async getRecent(dateRange?: string) {
    const startDate = this.getStartDate(dateRange);
    
    // We filter logs but still limit to a reasonable number for the "Recent" view
    const logs = await this.prisma.activityLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    });

    return logs.map((log) => ({
      id: log.id,
      type: log.type,
      title: log.title,
      description: log.description,
      timestamp: log.createdAt.toISOString(),
    }));
  }

  async getRevenue(dateRange?: string) {
    // For now keeping demo data, but we could filter it if we had real revenue records
    return [
      { month: 'Jan', revenue: 4000, orders: 120 },
      { month: 'Feb', revenue: 3000, orders: 90 },
      { month: 'Mar', revenue: 5000, orders: 150 },
      { month: 'Apr', revenue: 4500, orders: 130 },
    ];
  }

  private generateMockSeries(days: number) {
    return Array.from({ length: days }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      value: Math.floor(Math.random() * (500 - 200 + 1) + 200),
    })).reverse();
  }
}
