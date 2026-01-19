import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeviceTokenService } from './device-token.service';
import { DeviceToken } from './entities/device-token.entity';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';

@ApiTags('Admin - Device Tokens')
@ApiBearerAuth()
@Controller('admin/device-tokens')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @Get()
  @ApiOperation({ summary: 'Get all device tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of device tokens',
    type: [DeviceToken],
  })
  async findAll(): Promise<DeviceToken[]> {
    return this.deviceTokenService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a device token by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Device token found',
    type: DeviceToken,
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Device token not found' 
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DeviceToken> {
    return this.deviceTokenService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a device token' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Device token created successfully',
    type: DeviceToken,
  })
  async create(@Body() createDto: CreateDeviceTokenDto): Promise<DeviceToken> {
    return this.deviceTokenService.create(createDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a device token' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Device token deleted successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Device token not found' 
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deviceTokenService.remove(id);
  }
}
