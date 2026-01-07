import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      "http://localhost:3000", // Admin panel
      "http://localhost:3001", // Backend
      "capacitor://localhost", // Mobile app
      "http://localhost", // Mobile app
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

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
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api`);
}

bootstrap();
