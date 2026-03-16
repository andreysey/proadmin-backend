import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard overall statistics' })
  @ApiQuery({ name: 'dateRange', required: false, enum: ['24h', '7d', '30d'] })
  getStats(@Query('dateRange') dateRange?: string) {
    return this.analyticsService.getStats(dateRange);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get user activity/growth data for charts' })
  @ApiQuery({ name: 'dateRange', required: false, enum: ['24h', '7d', '30d'] })
  getActivity(@Query('dateRange') dateRange?: string) {
    return this.analyticsService.getActivity(dateRange);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent system events' })
  @ApiQuery({ name: 'dateRange', required: false, enum: ['24h', '7d', '30d'] })
  getRecent(@Query('dateRange') dateRange?: string) {
    return this.analyticsService.getRecent(dateRange);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue data for bar charts' })
  @ApiQuery({ name: 'dateRange', required: false, enum: ['24h', '7d', '30d'] })
  getRevenue(@Query('dateRange') dateRange?: string) {
    return this.analyticsService.getRevenue(dateRange);
  }
}
