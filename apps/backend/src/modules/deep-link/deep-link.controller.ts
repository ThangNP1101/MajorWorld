import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeepLinkService } from './deep-link.service';
import { CreateDeepLinkDto } from './dto/create-deep-link.dto';
import { ListDeepLinksQueryDto } from './dto/list-deep-links.dto';
import { DeepLinkResponseDto } from './dto/deep-link-response.dto';
import { DeepLinkListResponseDto } from './dto/deep-link-list-response.dto';

@ApiTags('Admin - Deep Links')
@ApiBearerAuth()
@Controller('admin/deep-links')
export class DeepLinkController {
  constructor(private readonly deepLinkService: DeepLinkService) {}

  @Post()
  @ApiOperation({ summary: 'Create a deep link' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Deep link created successfully',
    type: DeepLinkResponseDto,
  })
  async create(
    @Body() dto: CreateDeepLinkDto,
    @Req() req: Request,
  ): Promise<DeepLinkResponseDto> {
    const requestHost = `${req.protocol}://${req.get('host')}`;
    return this.deepLinkService.create(dto, requestHost);
  }

  @Get()
  @ApiOperation({ summary: 'List deep links' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of deep links',
    type: DeepLinkListResponseDto,
  })
  async findAll(
    @Query() query: ListDeepLinksQueryDto,
    @Req() req: Request,
  ): Promise<DeepLinkListResponseDto> {
    const requestHost = `${req.protocol}://${req.get('host')}`;
    return this.deepLinkService.findAll(query, requestHost);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deep link by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deep link retrieved successfully',
    type: DeepLinkResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deep link not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<DeepLinkResponseDto> {
    const requestHost = `${req.protocol}://${req.get('host')}`;
    return this.deepLinkService.findOne(id, requestHost);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deep link' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deep link deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deep link not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deepLinkService.remove(id);
  }
}
