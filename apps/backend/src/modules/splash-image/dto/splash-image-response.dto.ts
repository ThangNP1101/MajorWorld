import { ApiProperty } from '@nestjs/swagger';

export class SplashImageResponseDto {
  @ApiProperty({ description: 'Splash image ID' })
  id: number;

  @ApiProperty({
    description: 'Aspect ratio',
    example: '9:16',
  })
  aspectRatio: string;

  @ApiProperty({
    description: 'Device type description',
    example: 'Regular smartphones',
  })
  deviceType: string;

  @ApiProperty({
    description: 'Image dimensions',
    example: '1080 x 1920px',
  })
  dimensions: string;

  @ApiProperty({
    description: 'Image URL',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}
