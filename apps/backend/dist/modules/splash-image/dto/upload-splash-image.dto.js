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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadSplashImageDto = exports.AspectRatio = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AspectRatio;
(function (AspectRatio) {
    AspectRatio["RATIO_9_16"] = "9:16";
    AspectRatio["RATIO_9_19_5"] = "9:19.5";
    AspectRatio["RATIO_9_20"] = "9:20";
    AspectRatio["RATIO_9_18"] = "9:18";
    AspectRatio["RATIO_9_21"] = "9:21";
    AspectRatio["RATIO_9_19"] = "9:19";
})(AspectRatio || (exports.AspectRatio = AspectRatio = {}));
class UploadSplashImageDto {
}
exports.UploadSplashImageDto = UploadSplashImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Aspect ratio for the splash image',
        enum: AspectRatio,
        example: AspectRatio.RATIO_9_16,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(AspectRatio),
    __metadata("design:type", String)
], UploadSplashImageDto.prototype, "aspectRatio", void 0);
//# sourceMappingURL=upload-splash-image.dto.js.map