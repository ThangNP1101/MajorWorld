import { BottomMenuService } from "./bottom-menu.service";
import { BottomMenu } from "./entities/bottom-menu.entity";
import { CreateBottomMenuDto } from "./dto/create-bottom-menu.dto";
import { UpdateBottomMenuDto } from "./dto/update-bottom-menu.dto";
import { BulkUpdateBottomMenuDto } from "./dto/bulk-update-bottom-menu.dto";
export declare class BottomMenuController {
    private readonly bottomMenuService;
    constructor(bottomMenuService: BottomMenuService);
    findAll(): Promise<BottomMenu[]>;
    findActive(): Promise<BottomMenu[]>;
    findOne(id: number): Promise<BottomMenu>;
    create(createDto: CreateBottomMenuDto): Promise<BottomMenu>;
    bulkUpdate(bulkUpdateDto: BulkUpdateBottomMenuDto): Promise<BottomMenu[]>;
    update(id: number, updateDto: UpdateBottomMenuDto): Promise<BottomMenu>;
    remove(id: number): Promise<void>;
    uploadActiveIcon(id: number, file: Express.Multer.File): Promise<BottomMenu>;
    uploadInactiveIcon(id: number, file: Express.Multer.File): Promise<BottomMenu>;
}
