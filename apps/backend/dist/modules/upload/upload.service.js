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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AWS = require("aws-sdk");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    constructor(configService) {
        this.configService = configService;
        this.s3 = new AWS.S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            region: this.configService.get('AWS_REGION') || 'ap-northeast-2',
        });
        this.bucketName = this.configService.get('AWS_S3_BUCKET') || 'majorworld-assets';
    }
    async uploadFile(file, folder = 'uploads') {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        const params = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        try {
            const result = await this.s3.upload(params).promise();
            return result.Location;
        }
        catch (error) {
            throw new Error(`Failed to upload file to S3: ${error.message}`);
        }
    }
    async deleteFile(fileUrl) {
        try {
            const url = new URL(fileUrl);
            const key = url.pathname.substring(1);
            const params = {
                Bucket: this.bucketName,
                Key: key,
            };
            await this.s3.deleteObject(params).promise();
        }
        catch (error) {
            console.error(`Failed to delete file from S3: ${error.message}`);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map