import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SplashImageService } from './splash-image.service';
import { SplashImage } from './entities/splash-image.entity';
import { SplashImageResponseDto } from './dto/splash-image-response.dto';

@ApiTags('Admin - Splash Images')
@ApiBearerAuth()
@Controller('admin/splash-images')
export class SplashImageController {
  constructor(private readonly splashImageService: SplashImageService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all splash images',
    description:
      'Retrieve all splash images for different device aspect ratios, ordered by predefined sequence',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Splash images retrieved successfully',
    type: SplashImageResponseDto,
    isArray: true,
  })
  async findAll(): Promise<SplashImage[]> {
    return this.splashImageService.findAll();
  }

  @Get(':aspectRatio')
  @ApiOperation({
    summary: 'Get splash image by aspect ratio',
    description: 'Retrieve a single splash image for a specific aspect ratio',
  })
  @ApiParam({
    name: 'aspectRatio',
    description: 'Aspect ratio identifier (9:16, 9:19.5, 9:20, 9:18, 9:21, 9:19)',
    example: '9:16',
    enum: ['9:16', '9:19.5', '9:20', '9:18', '9:21', '9:19'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Splash image retrieved successfully',
    type: SplashImageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Splash image not found',
  })
  async findByAspectRatio(
    @Param('aspectRatio') aspectRatio: string,
  ): Promise<SplashImage> {
    return this.splashImageService.findByAspectRatio(aspectRatio);
  }

  @Post(':aspectRatio/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload splash image',
    description:
      'Upload or update a splash image for a specific aspect ratio. Accepts JPEG, PNG, or WebP images (max 5MB)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'aspectRatio',
    description: 'Aspect ratio identifier (9:16, 9:19.5, 9:20, 9:18, 9:21, 9:19)',
    example: '9:16',
    enum: ['9:16', '9:19.5', '9:20', '9:18', '9:21', '9:19'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, or WebP, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Splash image uploaded successfully',
    type: SplashImageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file or aspect ratio',
  })
  async uploadImage(
    @Param('aspectRatio') aspectRatio: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SplashImage> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.splashImageService.uploadImage(aspectRatio, file);
  }

  @Delete(':aspectRatio')
  @ApiOperation({
    summary: 'Delete splash image',
    description:
      'Remove the splash image for a specific aspect ratio. The database record remains with null image URL',
  })
  @ApiParam({
    name: 'aspectRatio',
    description: 'Aspect ratio identifier (9:16, 9:19.5, 9:20, 9:18, 9:21, 9:19)',
    example: '9:16',
    enum: ['9:16', '9:19.5', '9:20', '9:18', '9:21', '9:19'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Splash image deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Splash image not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No image uploaded for this aspect ratio',
  })
  async deleteImage(@Param('aspectRatio') aspectRatio: string): Promise<void> {
    return this.splashImageService.deleteImage(aspectRatio);
  }
}
