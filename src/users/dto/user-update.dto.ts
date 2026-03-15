import { IsEmail, IsEnum, IsOptional, IsString, IsArray, ArrayMinSize, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'test@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'new_username' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'http://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class BulkUpdateRoleDto {
  @ApiProperty({ description: 'Array of user IDs to update', example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ids: string[];

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  @IsEnum(Role)
  role: Role;
}
