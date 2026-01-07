import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { BottomMenuService } from "./bottom-menu.service";
import { BottomMenu } from "./entities/bottom-menu.entity";
import { CreateBottomMenuDto } from "./dto/create-bottom-menu.dto";
import { UpdateBottomMenuDto } from "./dto/update-bottom-menu.dto";
import { BulkUpdateBottomMenuDto } from "./dto/bulk-update-bottom-menu.dto";

@ApiTags("Admin - Bottom Menu")
@Controller("admin/bottom-menu")
export class BottomMenuController {
  constructor(private readonly bottomMenuService: BottomMenuService) {}

  @Get()
  @ApiOperation({ summary: "Get all bottom menus" })
  @ApiResponse({
    status: 200,
    description: "List of all menus",
    type: [BottomMenu],
  })
  async findAll(): Promise<BottomMenu[]> {
    return this.bottomMenuService.findAll();
  }

  @Get("active")
  @ApiOperation({ summary: "Get active bottom menus only" })
  @ApiResponse({
    status: 200,
    description: "List of active menus",
    type: [BottomMenu],
  })
  async findActive(): Promise<BottomMenu[]> {
    return this.bottomMenuService.findActive();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a menu by ID" })
  @ApiResponse({
    status: 200,
    description: "Menu found",
    type: BottomMenu,
  })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<BottomMenu> {
    return this.bottomMenuService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new menu" })
  @ApiResponse({
    status: 201,
    description: "Menu created successfully",
    type: BottomMenu,
  })
  async create(@Body() createDto: CreateBottomMenuDto): Promise<BottomMenu> {
    return this.bottomMenuService.create(createDto);
  }

  @Put("bulk")
  @ApiOperation({ summary: "Bulk update all menus (replace all)" })
  @ApiResponse({
    status: 200,
    description: "Menus updated successfully",
    type: [BottomMenu],
  })
  async bulkUpdate(
    @Body() bulkUpdateDto: BulkUpdateBottomMenuDto
  ): Promise<BottomMenu[]> {
    try {
      return await this.bottomMenuService.bulkUpdate(bulkUpdateDto);
    } catch (error) {
      console.error("Bulk update error:", error);
      throw error;
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a menu" })
  @ApiResponse({
    status: 200,
    description: "Menu updated successfully",
    type: BottomMenu,
  })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateBottomMenuDto
  ): Promise<BottomMenu> {
    return this.bottomMenuService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a menu" })
  @ApiResponse({ status: 200, description: "Menu deleted successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.bottomMenuService.remove(id);
  }

  @Post(":id/upload/active-icon")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload active icon for a menu item" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Active icon uploaded successfully",
    type: BottomMenu,
  })
  async uploadActiveIcon(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<BottomMenu> {
    return this.bottomMenuService.uploadActiveIcon(id, file);
  }

  @Post(":id/upload/inactive-icon")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload inactive icon for a menu item" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Inactive icon uploaded successfully",
    type: BottomMenu,
  })
  async uploadInactiveIcon(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<BottomMenu> {
    return this.bottomMenuService.uploadInactiveIcon(id, file);
  }
}
