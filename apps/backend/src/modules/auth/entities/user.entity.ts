import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User email (unique)' })
  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Exclude()
  @Column({ length: 255 })
  password: string;

  @Exclude()
  @Column({ name: 'refresh_token', length: 500, nullable: true })
  refreshToken: string | null;

  @Column({ name: 'refresh_token_expires_at', type: 'timestamp', nullable: true })
  refreshTokenExpiresAt: Date | null;

  @ApiProperty({ description: 'User full name' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @ApiProperty({ description: 'Is user account active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Token version for revocation' })
  @Column({ name: 'token_version', type: 'int', default: 0 })
  tokenVersion: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
