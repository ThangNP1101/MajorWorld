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
import { TestDeviceTokenService } from './test-device-token.service';
import { TestDeviceToken } from './entities/test-device-token.entity';
import { CreateTestDeviceTokenDto } from './dto/create-test-device-token.dto';

@ApiTags('Admin - Test Device Tokens')
@ApiBearerAuth()
@Controller('admin/test-device-tokens')
export class TestDeviceTokenController {
  constructor(private readonly testDeviceTokenService: TestDeviceTokenService) {}

  @Get()
  @ApiOperation({ summary: 'Get all test device tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of test device tokens',
    type: [TestDeviceToken],
  })
  async findAll(): Promise<TestDeviceToken[]> {
    return this.testDeviceTokenService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a test device token by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test device token found',
    type: TestDeviceToken,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Test device token not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TestDeviceToken> {
    return this.testDeviceTokenService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a test device token' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Test device token created successfully',
    type: TestDeviceToken,
  })
  async create(@Body() createDto: CreateTestDeviceTokenDto): Promise<TestDeviceToken> {
    return this.testDeviceTokenService.create(createDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a test device token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test device token deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Test device token not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.testDeviceTokenService.remove(id);
  }
}
