import { ConnectivityType } from '../entities/deep-link.entity';
export declare class DeepLinkResponseDto {
    id: string;
    originalUrl: string;
    connectivityType: ConnectivityType;
    shortCode: string;
    shortUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
