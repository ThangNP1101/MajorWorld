export declare class StatsSummaryDto {
    totalShipments: number;
    totalViews: number;
    viewRate: string;
    averageCtr: string;
    shipmentsChange?: string;
    viewsChange?: string;
    viewRateChange?: string;
    ctrChange?: string;
}
export declare class MessageHistoryItemDto {
    id: number;
    title: string;
    sentAt: Date;
    target: string;
    totalSent: number;
    totalViews: number;
    viewRate: string;
}
