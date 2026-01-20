import { AppFeaturesService } from './app-features.service';
import { UpdateAppFeaturesDto } from './dto/update-app-features.dto';
import { AppFeatures } from './entities/app-features.entity';
export declare class AppFeaturesController {
    private readonly appFeaturesService;
    constructor(appFeaturesService: AppFeaturesService);
    getFeatures(): Promise<AppFeatures>;
    updateFeatures(updateDto: UpdateAppFeaturesDto): Promise<AppFeatures>;
    uploadPopupImage(file: Express.Multer.File): Promise<AppFeatures>;
    deletePopupImage(): Promise<AppFeatures>;
}
