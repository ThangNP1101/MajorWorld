import { Request } from 'express';
import { DeepLinkService } from './deep-link.service';
import { CreateDeepLinkDto } from './dto/create-deep-link.dto';
import { ListDeepLinksQueryDto } from './dto/list-deep-links.dto';
import { DeepLinkResponseDto } from './dto/deep-link-response.dto';
import { DeepLinkListResponseDto } from './dto/deep-link-list-response.dto';
export declare class DeepLinkController {
    private readonly deepLinkService;
    constructor(deepLinkService: DeepLinkService);
    create(dto: CreateDeepLinkDto, req: Request): Promise<DeepLinkResponseDto>;
    findAll(query: ListDeepLinksQueryDto, req: Request): Promise<DeepLinkListResponseDto>;
    findOne(id: string, req: Request): Promise<DeepLinkResponseDto>;
    remove(id: string): Promise<void>;
}
