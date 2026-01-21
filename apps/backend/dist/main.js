"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const response_transform_interceptor_1 = require("./common/interceptors/response-transform.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:5173",
                "capacitor://localhost",
                "http://localhost",
            ];
            const isCloudflareOrigin = origin?.includes('.trycloudflare.com');
            if (!origin || allowedOrigins.includes(origin) || isCloudflareOrigin) {
                callback(null, true);
            }
            else {
                callback(null, true);
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Accept",
            "X-Requested-With",
            "Origin",
        ],
        exposedHeaders: ["Authorization"],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new response_transform_interceptor_1.ResponseTransformInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix("api");
    const config = new swagger_1.DocumentBuilder()
        .setTitle("MajorWorld API")
        .setDescription("Hybrid App Backend API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    wrapSwaggerResponses(document);
    swagger_1.SwaggerModule.setup("api", app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on: http://localhost:${port}`);
    console.log(`📚 API Docs: http://localhost:${port}/api`);
}
bootstrap();
function wrapSwaggerResponses(document) {
    if (!document?.paths) {
        return;
    }
    const isWrappedSchema = (schema) => {
        const properties = schema?.properties;
        return (properties &&
            properties.success &&
            properties.message &&
            properties.data);
    };
    const buildSuccessSchema = (dataSchema) => ({
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Request Success" },
            data: dataSchema || { type: "object" },
        },
        required: ["success", "message", "data"],
    });
    const buildErrorSchema = () => ({
        type: "object",
        properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Request Failed" },
            data: { type: "null", example: null },
            error: { type: "string" },
        },
        required: ["success", "message", "data"],
    });
    const wrapExample = (example, isSuccess) => {
        if (example &&
            typeof example === "object" &&
            "success" in example &&
            "message" in example &&
            "data" in example) {
            return example;
        }
        return isSuccess
            ? { success: true, message: "Request Success", data: example }
            : {
                success: false,
                message: "Request Failed",
                data: null,
                error: example,
            };
    };
    Object.values(document.paths).forEach((pathItem) => {
        Object.values(pathItem).forEach((operation) => {
            const responses = operation?.responses;
            if (!responses) {
                return;
            }
            Object.entries(responses).forEach(([statusCode, response]) => {
                const content = response?.content?.["application/json"];
                if (!content?.schema) {
                    return;
                }
                const isSuccess = typeof statusCode === "string" && statusCode.startsWith("2");
                const originalSchema = content.schema;
                if (!isWrappedSchema(originalSchema)) {
                    content.schema = isSuccess
                        ? buildSuccessSchema(originalSchema)
                        : buildErrorSchema();
                }
                if (content.example) {
                    content.example = wrapExample(content.example, isSuccess);
                }
            });
        });
    });
}
//# sourceMappingURL=main.js.map