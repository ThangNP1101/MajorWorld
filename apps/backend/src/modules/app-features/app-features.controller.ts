import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AppFeaturesService } from './app-features.service';
import { UpdateAppFeaturesDto } from './dto/update-app-features.dto';
import { AppFeatures } from './entities/app-features.entity';

@ApiTags('Admin - App Features')
@ApiBearerAuth()
@Controller('admin/app-features')
export class AppFeaturesController {
  constructor(private readonly appFeaturesService: AppFeaturesService) {}

  @Get()
  @ApiOperation({ summary: 'Get app features configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration retrieved successfully',
    type: AppFeatures,
  })
  async getFeatures(): Promise<AppFeatures> {
    return this.appFeaturesService.getFeatures();
  }

  @Put()
  @ApiOperation({ summary: 'Update app features configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration updated successfully',
    type: AppFeatures,
  })
  async updateFeatures(
    @Body() updateDto: UpdateAppFeaturesDto,
  ): Promise<AppFeatures> {
    return this.appFeaturesService.updateFeatures(updateDto);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload popup marketing image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpg, png, gif, webp)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: AppFeatures,
  })
  async uploadPopupImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AppFeatures> {
    return this.appFeaturesService.uploadPopupImage(file);
  }

  @Delete('popup-image')
  @ApiOperation({ summary: 'Delete popup marketing image' })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    type: AppFeatures,
  })
  async deletePopupImage(): Promise<AppFeatures> {
    return this.appFeaturesService.deletePopupImage();
  }
}
