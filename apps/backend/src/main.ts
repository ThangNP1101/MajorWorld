import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ResponseTransformInterceptor } from "./common/interceptors/response-transform.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000", // Admin panel
        "http://localhost:3001", // Backend
        "http://localhost:5173", // Development server
        "capacitor://localhost", // Mobile app
        "http://localhost", // Mobile app
      ];
      
      // Allow Cloudflare tunnel domains
      const isCloudflareOrigin = origin?.includes('.trycloudflare.com');
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin) || isCloudflareOrigin) {
        callback(null, true);
      } else {
        // Allow all origins for development (remove in production)
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

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
  
  // Global response transformation (success responses)
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  
  // Global exception filter (error responses)
  app.useGlobalFilters(new HttpExceptionFilter());

  // API prefix
  app.setGlobalPrefix("api");

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("MajorWorld API")
    .setDescription("Hybrid App Backend API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  wrapSwaggerResponses(document);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api`);
}

bootstrap();

function wrapSwaggerResponses(document: any) {
  if (!document?.paths) {
    return;
  }

  const isWrappedSchema = (schema: any) => {
    const properties = schema?.properties;
    return (
      properties &&
      properties.success &&
      properties.message &&
      properties.data
    );
  };

  const buildSuccessSchema = (dataSchema: any) => ({
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

  const wrapExample = (example: any, isSuccess: boolean) => {
    if (
      example &&
      typeof example === "object" &&
      "success" in example &&
      "message" in example &&
      "data" in example
    ) {
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

  Object.values(document.paths).forEach((pathItem: any) => {
    Object.values(pathItem).forEach((operation: any) => {
      const responses = operation?.responses;
      if (!responses) {
        return;
      }

      Object.entries(responses).forEach(([statusCode, response]: any) => {
        const content = response?.content?.["application/json"];
        if (!content?.schema) {
          return;
        }

        const isSuccess =
          typeof statusCode === "string" && statusCode.startsWith("2");
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
