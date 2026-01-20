"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomMenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bottom_menu_entity_1 = require("./entities/bottom-menu.entity");
const upload_service_1 = require("../upload/upload.service");
const config_version_service_1 = require("../config-version/config-version.service");
const config_version_entity_1 = require("../config-version/entities/config-version.entity");
let BottomMenuService = class BottomMenuService {
    constructor(bottomMenuRepository, uploadService, configVersionService) {
        this.bottomMenuRepository = bottomMenuRepository;
        this.uploadService = uploadService;
        this.configVersionService = configVersionService;
    }
    async findAll() {
        return this.bottomMenuRepository.find({
            order: { sortOrder: "ASC" },
        });
    }
    async findActive() {
        return this.bottomMenuRepository.find({
            where: { isActive: true },
            order: { sortOrder: "ASC" },
        });
    }
    async findOne(id) {
        const menu = await this.bottomMenuRepository.findOne({ where: { id } });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu with ID ${id} not found`);
        }
        return menu;
    }
    async create(createDto) {
        const menu = this.bottomMenuRepository.create({
            ...createDto,
            isActive: createDto.isActive ?? true,
        });
        const saved = await this.bottomMenuRepository.save(menu);
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.BOTTOM_MENU);
        return saved;
    }
    async update(id, updateDto) {
        const menu = await this.findOne(id);
        Object.assign(menu, updateDto);
        const saved = await this.bottomMenuRepository.save(menu);
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.BOTTOM_MENU);
        return saved;
    }
    async remove(id) {
        const menu = await this.findOne(id);
        if (menu.iconActive) {
            await this.uploadService.deleteFile(menu.iconActive);
        }
        if (menu.iconInactive) {
            await this.uploadService.deleteFile(menu.iconInactive);
        }
        await this.bottomMenuRepository.remove(menu);
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.BOTTOM_MENU);
    }
    async bulkUpdate(bulkUpdateDto) {
        const { menus } = bulkUpdateDto;
        const existingIds = menus.filter((m) => m.id).map((m) => m.id);
        let existingMenus = [];
        if (existingIds.length > 0) {
            existingMenus = await this.bottomMenuRepository.find({
                where: { id: (0, typeorm_2.In)(existingIds) },
            });
        }
        const allExistingMenus = await this.bottomMenuRepository.find({
            select: ["id", "iconActive", "iconInactive"],
        });
        const idsToDelete = allExistingMenus
            .map((m) => m.id)
            .filter((id) => !existingIds.includes(id));
        if (idsToDelete.length > 0) {
            const menusToDelete = await this.bottomMenuRepository.find({
                where: { id: (0, typeorm_2.In)(idsToDelete) },
            });
            for (const menu of menusToDelete) {
                if (menu.iconActive) {
                    await this.uploadService.deleteFile(menu.iconActive);
                }
                if (menu.iconInactive) {
                    await this.uploadService.deleteFile(menu.iconInactive);
                }
            }
            await this.bottomMenuRepository.delete(idsToDelete);
        }
        const savedMenus = [];
        for (const menuDto of menus) {
            if (menuDto.id) {
                const existingMenu = existingMenus.find((m) => m.id === menuDto.id);
                if (existingMenu) {
                    if (existingMenu.iconActive &&
                        (menuDto.iconActive === null || menuDto.iconActive === undefined)) {
                        await this.uploadService.deleteFile(existingMenu.iconActive);
                    }
                    if (existingMenu.iconInactive &&
                        (menuDto.iconInactive === null ||
                            menuDto.iconInactive === undefined)) {
                        await this.uploadService.deleteFile(existingMenu.iconInactive);
                    }
                    Object.assign(existingMenu, {
                        menuName: menuDto.menuName,
                        connectionUrl: menuDto.connectionUrl,
                        iconActive: menuDto.iconActive ?? null,
                        iconInactive: menuDto.iconInactive ?? null,
                        sortOrder: menuDto.sortOrder,
                        isActive: menuDto.isActive ?? true,
                    });
                    savedMenus.push(await this.bottomMenuRepository.save(existingMenu));
                }
                else {
                    const newMenu = this.bottomMenuRepository.create({
                        menuName: menuDto.menuName,
                        connectionUrl: menuDto.connectionUrl,
                        iconActive: menuDto.iconActive ?? null,
                        iconInactive: menuDto.iconInactive ?? null,
                        sortOrder: menuDto.sortOrder,
                        isActive: menuDto.isActive ?? true,
                    });
                    savedMenus.push(await this.bottomMenuRepository.save(newMenu));
                }
            }
            else {
                const newMenu = this.bottomMenuRepository.create({
                    menuName: menuDto.menuName,
                    connectionUrl: menuDto.connectionUrl,
                    iconActive: menuDto.iconActive ?? null,
                    iconInactive: menuDto.iconInactive ?? null,
                    sortOrder: menuDto.sortOrder,
                    isActive: menuDto.isActive ?? true,
                });
                savedMenus.push(await this.bottomMenuRepository.save(newMenu));
            }
        }
        const result = savedMenus.sort((a, b) => a.sortOrder - b.sortOrder);
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.BOTTOM_MENU);
        return result;
    }
    async uploadActiveIcon(id, file) {
        if (!file) {
            throw new Error("No file provided");
        }
        const menu = await this.findOne(id);
        if (menu.iconActive) {
            await this.uploadService.deleteFile(menu.iconActive);
        }
        const iconUrl = await this.uploadService.uploadFile(file, "bottom-menu/icons");
        menu.iconActive = iconUrl;
        const saved = await this.bottomMenuRepository.save(menu);
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.BOTTOM_MENU);
        return saved;
    }
    async uploadInactiveIcon(id, file) {
        if (!file) {
            throw new Error("No file provided");
        }
        const menu = await this.findOne(id);
        if (menu.iconInactive) {
            await this.uploadService.deleteFile(menu.iconInactive);
        }
        const iconUrl = await this.uploadService.uploadFile(file, "bottom-menu/icons");
        menu.iconInactive = iconUrl;
        const saved = await this.bottomMenuRepository.save(menu);
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.BOTTOM_MENU);
        return saved;
    }
};
exports.BottomMenuService = BottomMenuService;
exports.BottomMenuService = BottomMenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bottom_menu_entity_1.BottomMenu)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService,
        config_version_service_1.ConfigVersionService])
], BottomMenuService);
//# sourceMappingURL=bottom-menu.service.js.map