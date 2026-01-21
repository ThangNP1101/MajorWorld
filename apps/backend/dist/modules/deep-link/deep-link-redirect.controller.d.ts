import { Request, Response } from 'express';
import { DeepLinkService } from './deep-link.service';
export declare class DeepLinkRedirectController {
    private readonly deepLinkService;
    constructor(deepLinkService: DeepLinkService);
    redirect(code: string, req: Request, res: Response): Promise<void>;
}
