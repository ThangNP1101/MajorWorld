import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SplashImage } from "./entities/splash-image.entity";
import { UploadService } from "../upload/upload.service";
import { ConfigVersionService } from "../config-version/config-version.service";
import { ModuleName } from "../config-version/entities/config-version.entity";

@Injectable()
export class SplashImageService {
  constructor(
    @InjectRepository(SplashImage)
    private splashImageRepository: Repository<SplashImage>,
    private uploadService: UploadService,
    private readonly configVersionService: ConfigVersionService
  ) {}

  async findAll(): Promise<SplashImage[]> {
    return this.splashImageRepository.find();
  }

  async uploadImage(
    aspectRatio: string,
    file: Express.Multer.File
  ): Promise<SplashImage> {
    if (!file) {
      throw new NotFoundException("No file provided");
    }

    let splash = await this.splashImageRepository.findOne({
      where: { aspectRatio },
    });

    if (splash?.imageUrl) {
      await this.uploadService.deleteFile(splash.imageUrl);
    }

    const imageUrl = await this.uploadService.uploadFile(
      file,
      "splash-images"
    );

    if (!splash) {
      splash = this.splashImageRepository.create({ aspectRatio, imageUrl });
    } else {
      splash.imageUrl = imageUrl;
    }

    const saved = await this.splashImageRepository.save(splash);
    await this.configVersionService.incrementVersion(ModuleName.SPLASH_IMAGE);
    return saved;
  }

  async deleteImage(aspectRatio: string): Promise<void> {
    const splash = await this.splashImageRepository.findOne({
      where: { aspectRatio },
    });

    if (!splash) {
      throw new NotFoundException("Splash image not found");
    }

    if (splash.imageUrl) {
      await this.uploadService.deleteFile(splash.imageUrl);
      splash.imageUrl = null;
      await this.splashImageRepository.save(splash);
      await this.configVersionService.incrementVersion(ModuleName.SPLASH_IMAGE);
    }
  }
}
