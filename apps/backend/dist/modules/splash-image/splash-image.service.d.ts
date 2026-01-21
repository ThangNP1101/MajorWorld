import { Repository } from 'typeorm';
import { SplashImage } from './entities/splash-image.entity';
import { UploadService } from '../upload/upload.service';
import { ConfigVersionService } from '../config-version/config-version.service';
export declare class SplashImageService {
    private readonly splashImageRepository;
    private readonly uploadService;
    private readonly configVersionService;
    private readonly logger;
    constructor(splashImageRepository: Repository<SplashImage>, uploadService: UploadService, configVersionService: ConfigVersionService);
    findAll(): Promise<SplashImage[]>;
    findByAspectRatio(aspectRatio: string): Promise<SplashImage>;
    uploadImage(aspectRatio: string, file: Express.Multer.File): Promise<SplashImage>;
    deleteImage(aspectRatio: string): Promise<void>;
    private getDefaultMeta;
    private ensureDefaults;
}
