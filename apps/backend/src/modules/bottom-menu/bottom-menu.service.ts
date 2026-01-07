import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { BottomMenu } from "./entities/bottom-menu.entity";
import { CreateBottomMenuDto } from "./dto/create-bottom-menu.dto";
import { UpdateBottomMenuDto } from "./dto/update-bottom-menu.dto";
import { BulkUpdateBottomMenuDto } from "./dto/bulk-update-bottom-menu.dto";
import { UploadService } from "../upload/upload.service";

@Injectable()
export class BottomMenuService {
  constructor(
    @InjectRepository(BottomMenu)
    private bottomMenuRepository: Repository<BottomMenu>,
    private uploadService: UploadService
  ) {}

  async findAll(): Promise<BottomMenu[]> {
    return this.bottomMenuRepository.find({
      order: { sortOrder: "ASC" },
    });
  }

  async findActive(): Promise<BottomMenu[]> {
    return this.bottomMenuRepository.find({
      where: { isActive: true },
      order: { sortOrder: "ASC" },
    });
  }

  async findOne(id: number): Promise<BottomMenu> {
    const menu = await this.bottomMenuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async create(createDto: CreateBottomMenuDto): Promise<BottomMenu> {
    const menu = this.bottomMenuRepository.create({
      ...createDto,
      isActive: createDto.isActive ?? true,
    });
    return this.bottomMenuRepository.save(menu);
  }

  async update(
    id: number,
    updateDto: UpdateBottomMenuDto
  ): Promise<BottomMenu> {
    const menu = await this.findOne(id);
    Object.assign(menu, updateDto);
    return this.bottomMenuRepository.save(menu);
  }

  async remove(id: number): Promise<void> {
    const menu = await this.findOne(id);

    // Delete icon files from S3 before removing menu
    if (menu.iconActive) {
      await this.uploadService.deleteFile(menu.iconActive);
    }
    if (menu.iconInactive) {
      await this.uploadService.deleteFile(menu.iconInactive);
    }

    await this.bottomMenuRepository.remove(menu);
  }

  async bulkUpdate(
    bulkUpdateDto: BulkUpdateBottomMenuDto
  ): Promise<BottomMenu[]> {
    const { menus } = bulkUpdateDto;

    // Get existing menu IDs from the request
    const existingIds = menus.filter((m) => m.id).map((m) => m.id!);

    // Fetch existing menus only if there are IDs
    let existingMenus: BottomMenu[] = [];
    if (existingIds.length > 0) {
      existingMenus = await this.bottomMenuRepository.find({
        where: { id: In(existingIds) },
      });
    }

    // Delete menus that are not in the new list
    const allExistingMenus = await this.bottomMenuRepository.find({
      select: ["id", "iconActive", "iconInactive"],
    });
    const idsToDelete = allExistingMenus
      .map((m) => m.id)
      .filter((id) => !existingIds.includes(id));

    // Delete icon files from S3 for menus being deleted
    if (idsToDelete.length > 0) {
      const menusToDelete = await this.bottomMenuRepository.find({
        where: { id: In(idsToDelete) },
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

    // Update or create menus
    const savedMenus: BottomMenu[] = [];

    for (const menuDto of menus) {
      if (menuDto.id) {
        // Try to update existing menu
        const existingMenu = existingMenus.find((m) => m.id === menuDto.id);
        if (existingMenu) {
          // Delete old icons from S3 if they're being removed
          if (
            existingMenu.iconActive &&
            (menuDto.iconActive === null || menuDto.iconActive === undefined)
          ) {
            await this.uploadService.deleteFile(existingMenu.iconActive);
          }
          if (
            existingMenu.iconInactive &&
            (menuDto.iconInactive === null ||
              menuDto.iconInactive === undefined)
          ) {
            await this.uploadService.deleteFile(existingMenu.iconInactive);
          }

          // Update existing menu
          Object.assign(existingMenu, {
            menuName: menuDto.menuName,
            connectionUrl: menuDto.connectionUrl,
            iconActive: menuDto.iconActive ?? null,
            iconInactive: menuDto.iconInactive ?? null,
            sortOrder: menuDto.sortOrder,
            isActive: menuDto.isActive ?? true,
          });
          savedMenus.push(await this.bottomMenuRepository.save(existingMenu));
        } else {
          // ID exists but not found in database (temporary ID from frontend)
          // Create as new menu (ignore the temporary ID)
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
      } else {
        // Create new menu (no ID provided)
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

    return savedMenus.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async uploadActiveIcon(
    id: number,
    file: Express.Multer.File
  ): Promise<BottomMenu> {
    if (!file) {
      throw new Error("No file provided");
    }

    const menu = await this.findOne(id);

    // Delete old icon if exists
    if (menu.iconActive) {
      await this.uploadService.deleteFile(menu.iconActive);
    }

    // Upload new icon
    const iconUrl = await this.uploadService.uploadFile(
      file,
      "bottom-menu/icons"
    );
    menu.iconActive = iconUrl;

    return this.bottomMenuRepository.save(menu);
  }

  async uploadInactiveIcon(
    id: number,
    file: Express.Multer.File
  ): Promise<BottomMenu> {
    if (!file) {
      throw new Error("No file provided");
    }

    const menu = await this.findOne(id);

    // Delete old icon if exists
    if (menu.iconInactive) {
      await this.uploadService.deleteFile(menu.iconInactive);
    }

    // Upload new icon
    const iconUrl = await this.uploadService.uploadFile(
      file,
      "bottom-menu/icons"
    );
    menu.iconInactive = iconUrl;

    return this.bottomMenuRepository.save(menu);
  }
}
