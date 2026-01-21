"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const schedule_1 = require("@nestjs/schedule");
const core_1 = require("@nestjs/core");
const database_config_1 = require("./database/database.config");
const app_config_module_1 = require("./modules/app-config/app-config.module");
const bottom_menu_module_1 = require("./modules/bottom-menu/bottom-menu.module");
const splash_image_module_1 = require("./modules/splash-image/splash-image.module");
const app_features_module_1 = require("./modules/app-features/app-features.module");
const push_message_module_1 = require("./modules/push-message/push-message.module");
const device_token_module_1 = require("./modules/device-token/device-token.module");
const test_device_token_module_1 = require("./modules/test-device-token/test-device-token.module");
const push_statistics_module_1 = require("./modules/push-statistics/push-statistics.module");
const upload_module_1 = require("./modules/upload/upload.module");
const mobile_api_module_1 = require("./modules/mobile-api/mobile-api.module");
const cache_module_1 = require("./common/cache/cache.module");
const auth_module_1 = require("./modules/auth/auth.module");
const jwt_auth_guard_1 = require("./modules/auth/guards/jwt-auth.guard");
const config_version_module_1 = require("./modules/config-version/config-version.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: database_config_1.DatabaseConfig,
            }),
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            cache_module_1.CacheModule,
            config_version_module_1.ConfigVersionModule,
            app_config_module_1.AppConfigModule,
            bottom_menu_module_1.BottomMenuModule,
            splash_image_module_1.SplashImageModule,
            app_features_module_1.AppFeaturesModule,
            push_message_module_1.PushMessageModule,
            device_token_module_1.DeviceTokenModule,
            test_device_token_module_1.TestDeviceTokenModule,
            push_statistics_module_1.PushStatisticsModule,
            upload_module_1.UploadModule,
            mobile_api_module_1.MobileApiModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map