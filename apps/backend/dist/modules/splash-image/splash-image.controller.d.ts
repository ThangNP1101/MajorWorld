import { SplashImageService } from './splash-image.service';
import { SplashImage } from './entities/splash-image.entity';
export declare class SplashImageController {
    private readonly splashImageService;
    constructor(splashImageService: SplashImageService);
    findAll(): Promise<SplashImage[]>;
    findByAspectRatio(aspectRatio: string): Promise<SplashImage>;
    uploadImage(aspectRatio: string, file: Express.Multer.File): Promise<SplashImage>;
    deleteImage(aspectRatio: string): Promise<void>;
}
