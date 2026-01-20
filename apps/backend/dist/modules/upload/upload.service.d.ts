import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private s3;
    private bucketName;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
}
