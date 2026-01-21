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
exports.DeepLinkRedirectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const deep_link_service_1 = require("./deep-link.service");
let DeepLinkRedirectController = class DeepLinkRedirectController {
    constructor(deepLinkService) {
        this.deepLinkService = deepLinkService;
    }
    async redirect(code, req, res) {
        const deepLink = await this.deepLinkService.findByShortCode(code);
        const resolution = this.deepLinkService.resolveRedirect(deepLink, req.headers['user-agent']);
        if (resolution.type === 'direct') {
            res.redirect(302, resolution.url);
            return;
        }
        res.status(200).send(resolution.htmlContent);
    }
};
exports.DeepLinkRedirectController = DeepLinkRedirectController;
__decorate([
    (0, common_1.Get)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve deep link by short code' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirects to store, app link, or web URL',
    }),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeepLinkRedirectController.prototype, "redirect", null);
exports.DeepLinkRedirectController = DeepLinkRedirectController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiTags)('Deep Links'),
    (0, common_1.Controller)('dl'),
    __metadata("design:paramtypes", [deep_link_service_1.DeepLinkService])
], DeepLinkRedirectController);
//# sourceMappingURL=deep-link-redirect.controller.js.map