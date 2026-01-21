import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SplashImage } from './entities/splash-image.entity';
import { UploadService } from '../upload/upload.service';
import { ConfigVersionService } from '../config-version/config-version.service';
import { ModuleName } from '../config-version/entities/config-version.entity';
import {
  DEFAULT_SPLASH_IMAGES,
  UPLOAD_CONSTRAINTS,
} from './splash-image.constants';

@Injectable()
export class SplashImageService {
  private readonly logger = new Logger(SplashImageService.name);

  constructor(
    @InjectRepository(SplashImage)
    private readonly splashImageRepository: Repository<SplashImage>,
    private readonly uploadService: UploadService,
    private readonly configVersionService: ConfigVersionService,
  ) {}

  /**
   * Get all splash images, ordered by predefined aspect ratio sequence
   */
  async findAll(): Promise<SplashImage[]> {
    try {
      await this.ensureDefaults();
      const images = await this.splashImageRepository.find();

      // Create ordering map based on default images
      const orderMap = new Map<string, number>(
        DEFAULT_SPLASH_IMAGES.map((item, index) => [item.aspectRatio, index]),
      );

      // Sort by predefined order, then by ID
      return images.sort((a, b) => {
        const orderA = orderMap.get(a.aspectRatio) ?? Number.MAX_SAFE_INTEGER;
        const orderB = orderMap.get(b.aspectRatio) ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.id - b.id;
      });
    } catch (error) {
      this.logger.error('Failed to fetch splash images', error.stack);
      throw error;
    }
  }

  /**
   * Get a single splash image by aspect ratio
   */
  async findByAspectRatio(aspectRatio: string): Promise<SplashImage> {
    try {
      await this.ensureDefaults();
      const splash = await this.splashImageRepository.findOne({
        where: { aspectRatio },
      });

      if (!splash) {
        throw new NotFoundException(
          `Splash image with aspect ratio ${aspectRatio} not found`,
        );
      }

      return splash;
    } catch (error) {
      this.logger.error(
        `Failed to fetch splash image for ${aspectRatio}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Upload or update splash image for a specific aspect ratio
   */
  async uploadImage(
    aspectRatio: string,
    file: Express.Multer.File,
  ): Promise<SplashImage> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    if (!UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
      );
    }

    // Validate file size
    if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size too large. Maximum allowed size is ${UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
    }

    try {
      await this.ensureDefaults();

      // Find existing splash image entry
      let splash = await this.splashImageRepository.findOne({
        where: { aspectRatio },
      });

      // Delete old image if exists
      if (splash?.imageUrl) {
        try {
          await this.uploadService.deleteFile(splash.imageUrl);
          this.logger.log(
            `Deleted old splash image for aspect ratio ${aspectRatio}`,
          );
        } catch (error) {
          this.logger.warn(
            `Failed to delete old splash image: ${error.message}`,
          );
        }
      }

      // Upload new image
      const imageUrl = await this.uploadService.uploadFile(
        file,
        UPLOAD_CONSTRAINTS.STORAGE_FOLDER,
      );
      this.logger.log(
        `Uploaded new splash image for aspect ratio ${aspectRatio}`,
      );

      // Create or update splash image record
      if (!splash) {
        const defaults = this.getDefaultMeta(aspectRatio);
        if (!defaults) {
          throw new BadRequestException(
            `Invalid aspect ratio: ${aspectRatio}. Supported ratios: ${DEFAULT_SPLASH_IMAGES.map((i) => i.aspectRatio).join(', ')}`,
          );
        }
        splash = this.splashImageRepository.create({
          aspectRatio,
          imageUrl,
          ...defaults,
        });
      } else {
        splash.imageUrl = imageUrl;
        const defaults = this.getDefaultMeta(aspectRatio);
        if (defaults) {
          splash.deviceType = splash.deviceType ?? defaults.deviceType;
          splash.dimensions = splash.dimensions ?? defaults.dimensions;
        }
      }

      const saved = await this.splashImageRepository.save(splash);

      // Increment version for mobile app config sync
      await this.configVersionService.incrementVersion(
        ModuleName.SPLASH_IMAGE,
      );

      return saved;
    } catch (error) {
      this.logger.error(
        `Failed to upload splash image for ${aspectRatio}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Delete splash image for a specific aspect ratio
   * Note: This only removes the image URL, not the database record
   */
  async deleteImage(aspectRatio: string): Promise<void> {
    try {
      await this.ensureDefaults();

      const splash = await this.splashImageRepository.findOne({
        where: { aspectRatio },
      });

      if (!splash) {
        throw new NotFoundException(
          `Splash image with aspect ratio ${aspectRatio} not found`,
        );
      }

      if (!splash.imageUrl) {
        throw new BadRequestException(
          `No image uploaded for aspect ratio ${aspectRatio}`,
        );
      }

      // Delete image from storage
      try {
        await this.uploadService.deleteFile(splash.imageUrl);
        this.logger.log(
          `Deleted splash image for aspect ratio ${aspectRatio}`,
        );
      } catch (error) {
        this.logger.warn(`Failed to delete file from storage: ${error.message}`);
      }

      // Update database record
      splash.imageUrl = null;
      await this.splashImageRepository.save(splash);

      // Increment version for mobile app config sync
      await this.configVersionService.incrementVersion(
        ModuleName.SPLASH_IMAGE,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete splash image for ${aspectRatio}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get default metadata for a given aspect ratio
   */
  private getDefaultMeta(aspectRatio: string): {
    deviceType: string;
    dimensions: string;
  } | null {
    const match = DEFAULT_SPLASH_IMAGES.find(
      (item) => item.aspectRatio === aspectRatio,
    );
    return match
      ? { deviceType: match.deviceType, dimensions: match.dimensions }
      : null;
  }

  /**
   * Ensure all default aspect ratio entries exist in database
   */
  private async ensureDefaults(): Promise<void> {
    const aspectRatios = DEFAULT_SPLASH_IMAGES.map((item) => item.aspectRatio);
    const existing = await this.splashImageRepository.find({
      where: { aspectRatio: In(aspectRatios) },
      select: ['id', 'aspectRatio'],
    });

    const existingSet = new Set(existing.map((item) => item.aspectRatio));
    const missing = DEFAULT_SPLASH_IMAGES.filter(
      (item) => !existingSet.has(item.aspectRatio),
    );

    if (missing.length === 0) {
      return;
    }

    const entities = missing.map((item) =>
      this.splashImageRepository.create({
        aspectRatio: item.aspectRatio,
        deviceType: item.deviceType,
        dimensions: item.dimensions,
      }),
    );

    await this.splashImageRepository.save(entities);
    this.logger.log(
      `Created ${missing.length} default splash image entries: ${missing.map((i) => i.aspectRatio).join(', ')}`,
    );
  }
}
