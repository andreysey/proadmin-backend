import { Controller, Get, UseGuards, Req, Param, Patch, Body, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@Req() req: any) {
    return this.usersService.findOne(req.user.userId);
  }

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'List all users (ADMIN only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (ADMIN only)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update user (ADMIN only)' })
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (ADMIN only)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
