import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PushMessageService } from './push-message.service';
import { PushMessage } from './entities/push-message.entity';
import { CreatePushMessageDto } from './dto/create-push-message.dto';
import { UpdatePushMessageDto } from './dto/update-push-message.dto';
import { SendTestPushDto } from './dto/send-test-push.dto';
import { DeviceStatsDto } from './dto/device-stats.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Admin - Push Messages')
@Controller('admin/push-messages')
export class PushMessageController {
  constructor(
    private readonly pushMessageService: PushMessageService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all push messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all push messages',
    type: [PushMessage],
  })
  async findAll(): Promise<PushMessage[]> {
    return this.pushMessageService.findAll();
  }

  @Get('scheduled')
  @ApiOperation({ summary: 'Get scheduled push messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of scheduled push messages',
    type: [PushMessage],
  })
  async findScheduled(): Promise<PushMessage[]> {
    return this.pushMessageService.findScheduled();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get device statistics by platform' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Device statistics',
    type: DeviceStatsDto,
  })
  async getDeviceStats(): Promise<DeviceStatsDto> {
    return this.pushMessageService.getDeviceStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a push message by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Push message found',
    type: PushMessage,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Push message not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PushMessage> {
    return this.pushMessageService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new push message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Push message created successfully',
    type: PushMessage,
  })
  async create(@Body() createDto: CreatePushMessageDto): Promise<PushMessage> {
    return this.pushMessageService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a push message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Push message updated successfully',
    type: PushMessage,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Push message not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePushMessageDto,
  ): Promise<PushMessage> {
    return this.pushMessageService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a push message' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Push message deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Push message not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pushMessageService.remove(id);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send a push message immediately' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Push message sent successfully',
    type: PushMessage,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Push message not found' })
  async send(@Param('id', ParseIntPipe) id: number): Promise<PushMessage> {
    return this.pushMessageService.send(id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Send a test push to selected devices' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test push sent successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Push message not found' })
  async sendTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() sendTestDto: SendTestPushDto,
  ): Promise<void> {
    return this.pushMessageService.sendTest(id, sendTestDto.deviceTokenIds);
  }

  @Post(':id/upload/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload image for push notification' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image uploaded successfully',
    type: PushMessage,
  })
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PushMessage> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const message = await this.pushMessageService.findOne(id);

    // Delete old image if exists
    if (message.imageUrl) {
      await this.uploadService.deleteFile(message.imageUrl);
    }

    // Upload new image
    const imageUrl = await this.uploadService.uploadFile(file, 'push-messages/images');
    message.imageUrl = imageUrl;

    return this.pushMessageService.update(id, { imageUrl });
  }
}

