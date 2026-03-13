import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard overall statistics' })
  getStats() {
    return this.analyticsService.getStats();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get user activity/growth data for charts' })
  getActivity() {
    return this.analyticsService.getActivity();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent system events' })
  getRecent() {
    return this.analyticsService.getRecent();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue data for bar charts' })
  getRevenue() {
    return this.analyticsService.getRevenue();
  }
}
