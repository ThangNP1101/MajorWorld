import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateAdminDto {
  @ApiProperty({ example: 'newadmin@majorworld.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'New Admin' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ enum: UserRole, required: false, default: UserRole.ADMIN })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.ADMIN;
}
