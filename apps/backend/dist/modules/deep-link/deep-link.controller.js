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
exports.DeepLinkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const deep_link_service_1 = require("./deep-link.service");
const create_deep_link_dto_1 = require("./dto/create-deep-link.dto");
const list_deep_links_dto_1 = require("./dto/list-deep-links.dto");
const deep_link_response_dto_1 = require("./dto/deep-link-response.dto");
const deep_link_list_response_dto_1 = require("./dto/deep-link-list-response.dto");
let DeepLinkController = class DeepLinkController {
    constructor(deepLinkService) {
        this.deepLinkService = deepLinkService;
    }
    async create(dto, req) {
        const requestHost = `${req.protocol}://${req.get('host')}`;
        return this.deepLinkService.create(dto, requestHost);
    }
    async findAll(query, req) {
        const requestHost = `${req.protocol}://${req.get('host')}`;
        return this.deepLinkService.findAll(query, requestHost);
    }
    async findOne(id, req) {
        const requestHost = `${req.protocol}://${req.get('host')}`;
        return this.deepLinkService.findOne(id, requestHost);
    }
    async remove(id) {
        return this.deepLinkService.remove(id);
    }
};
exports.DeepLinkController = DeepLinkController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a deep link' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Deep link created successfully',
        type: deep_link_response_dto_1.DeepLinkResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deep_link_dto_1.CreateDeepLinkDto, Object]),
    __metadata("design:returntype", Promise)
], DeepLinkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List deep links' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of deep links',
        type: deep_link_list_response_dto_1.DeepLinkListResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_deep_links_dto_1.ListDeepLinksQueryDto, Object]),
    __metadata("design:returntype", Promise)
], DeepLinkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deep link by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Deep link retrieved successfully',
        type: deep_link_response_dto_1.DeepLinkResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Deep link not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeepLinkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete deep link' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Deep link deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Deep link not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeepLinkController.prototype, "remove", null);
exports.DeepLinkController = DeepLinkController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Deep Links'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/deep-links'),
    __metadata("design:paramtypes", [deep_link_service_1.DeepLinkService])
], DeepLinkController);
//# sourceMappingURL=deep-link.controller.js.map