import { Repository } from "typeorm";
import { BottomMenu } from "./entities/bottom-menu.entity";
import { CreateBottomMenuDto } from "./dto/create-bottom-menu.dto";
import { UpdateBottomMenuDto } from "./dto/update-bottom-menu.dto";
import { BulkUpdateBottomMenuDto } from "./dto/bulk-update-bottom-menu.dto";
import { UploadService } from "../upload/upload.service";
import { ConfigVersionService } from "../config-version/config-version.service";
export declare class BottomMenuService {
    private bottomMenuRepository;
    private uploadService;
    private readonly configVersionService;
    constructor(bottomMenuRepository: Repository<BottomMenu>, uploadService: UploadService, configVersionService: ConfigVersionService);
    findAll(): Promise<BottomMenu[]>;
    findActive(): Promise<BottomMenu[]>;
    findOne(id: number): Promise<BottomMenu>;
    create(createDto: CreateBottomMenuDto): Promise<BottomMenu>;
    update(id: number, updateDto: UpdateBottomMenuDto): Promise<BottomMenu>;
    remove(id: number): Promise<void>;
    bulkUpdate(bulkUpdateDto: BulkUpdateBottomMenuDto): Promise<BottomMenu[]>;
    uploadActiveIcon(id: number, file: Express.Multer.File): Promise<BottomMenu>;
    uploadInactiveIcon(id: number, file: Express.Multer.File): Promise<BottomMenu>;
}
