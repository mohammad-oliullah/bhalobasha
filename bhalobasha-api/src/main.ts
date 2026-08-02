import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import basicAuth from "express-basic-auth";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>("PORT", 4040);

  const frontendUrl = configService.get<string>(
    "FRONTEND_URL",
    "http://localhost:3000",
  );

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Required for Swagger UI
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS
  app.enableCors({
    origin: [frontendUrl, "http://localhost:3000", "http://localhost:4040"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.setGlobalPrefix("api", {
    exclude: ["api/docs"], // keep swagger at /api/docs not /api/v1/api/docs
  });

  // API Versioning (optional)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Protect Swagger with Basic Auth
  app.use(
    "/api/docs",
    basicAuth({
      challenge: true,
      users: {
        [configService.get<string>("SWAGGER_USER", "admin")]:
          configService.get<string>("SWAGGER_PASSWORD", "admin123"),
      },
    }),
  );

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Bhalobasha API")
    .setDescription("ভালোবাসা — Property Rental Platform API for Bangladesh")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("api/docs", app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);

  console.log(`🚀 Server running at: http://localhost:${port}`);
}

bootstrap();
