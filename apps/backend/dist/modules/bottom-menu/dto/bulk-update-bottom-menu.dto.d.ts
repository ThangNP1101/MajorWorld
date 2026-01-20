export declare class MenuItemDto {
    id?: number;
    menuName: string;
    connectionUrl: string;
    iconActive?: string;
    iconInactive?: string;
    sortOrder: number;
    isActive?: boolean;
}
export declare class BulkUpdateBottomMenuDto {
    menus: MenuItemDto[];
}
