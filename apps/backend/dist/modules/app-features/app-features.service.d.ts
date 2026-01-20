import { Repository } from 'typeorm';
import { AppFeatures } from './entities/app-features.entity';
import { UpdateAppFeaturesDto } from './dto/update-app-features.dto';
import { UploadService } from '../upload/upload.service';
import { ConfigVersionService } from '../config-version/config-version.service';
export declare class AppFeaturesService {
    private appFeaturesRepository;
    private uploadService;
    private readonly configVersionService;
    constructor(appFeaturesRepository: Repository<AppFeatures>, uploadService: UploadService, configVersionService: ConfigVersionService);
    getFeatures(): Promise<AppFeatures>;
    updateFeatures(updateDto: UpdateAppFeaturesDto): Promise<AppFeatures>;
    uploadPopupImage(file: Express.Multer.File): Promise<AppFeatures>;
    deletePopupImage(): Promise<AppFeatures>;
}
