import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async getStats() {
    return {
      totalUsers: 1250,
      activeNow: 42,
      totalRevenue: 54320,
      monthlyGrowth: 12.5,
    };
  }

  async getActivity() {
    return [
      {
        type: 'new_users',
        data: this.generateMockData(20, 100),
      },
      {
        type: 'revenue',
        data: this.generateMockData(500, 2000),
      },
    ];
  }

  async getRecent() {
    return [
      {
        id: '1',
        type: 'user_signup',
        title: 'New user registered',
        description: 'John Doe joined ProAdmin',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'payment_success',
        title: 'Payment received',
        description: '$120.00 from Jane Smith',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  }

  async getRevenue() {
    return [
      { month: 'Jan', revenue: 4000, orders: 120 },
      { month: 'Feb', revenue: 3000, orders: 90 },
      { month: 'Mar', revenue: 5000, orders: 150 },
      { month: 'Apr', revenue: 4500, orders: 130 },
    ];
  }

  private generateMockData(min: number, max: number) {
    return Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      value: Math.floor(Math.random() * (max - min + 1) + min),
    }));
  }
}
