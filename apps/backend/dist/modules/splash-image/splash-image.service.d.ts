import { Repository } from "typeorm";
import { SplashImage } from "./entities/splash-image.entity";
import { UploadService } from "../upload/upload.service";
import { ConfigVersionService } from "../config-version/config-version.service";
export declare class SplashImageService {
    private splashImageRepository;
    private uploadService;
    private readonly configVersionService;
    constructor(splashImageRepository: Repository<SplashImage>, uploadService: UploadService, configVersionService: ConfigVersionService);
    findAll(): Promise<SplashImage[]>;
    uploadImage(aspectRatio: string, file: Express.Multer.File): Promise<SplashImage>;
    deleteImage(aspectRatio: string): Promise<void>;
}
