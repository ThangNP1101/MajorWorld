import { ApiProperty } from '@nestjs/swagger';

export class StatsSummaryDto {
  @ApiProperty({ description: 'Total push messages sent' })
  totalShipments: number;

  @ApiProperty({ description: 'Total views across all messages' })
  totalViews: number;

  @ApiProperty({ description: 'View rate percentage' })
  viewRate: string;

  @ApiProperty({ description: 'Average click-through rate' })
  averageCtr: string;

  @ApiProperty({ description: 'Change vs last period for shipments' })
  shipmentsChange?: string;

  @ApiProperty({ description: 'Change vs last period for views' })
  viewsChange?: string;

  @ApiProperty({ description: 'Change vs last period for view rate' })
  viewRateChange?: string;

  @ApiProperty({ description: 'Change vs last period for CTR' })
  ctrChange?: string;
}

export class MessageHistoryItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  sentAt: Date;

  @ApiProperty()
  target: string;

  @ApiProperty()
  totalSent: number;

  @ApiProperty()
  totalViews: number;

  @ApiProperty()
  viewRate: string;
}
