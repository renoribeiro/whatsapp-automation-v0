import { NestFactory } from "@nestjs/core"
import { ValidationPipe, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import helmet from "helmet"
import * as compression from "compression"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const logger = new Logger("Bootstrap")

  // Security
  app.use(helmet())
  app.use(compression())

  // CORS
  app.enableCors({
    origin: configService.get("CORS_ORIGIN"),
    credentials: true,
  })

  // Global prefix
  const apiPrefix = configService.get("API_PREFIX", "api/v1")
  app.setGlobalPrefix(apiPrefix)

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("WhatsApp Platform API")
    .setDescription("API para Plataforma de Gestão e Automação de WhatsApp")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document)

  // Global validation pipe
  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  })
  app.useGlobalPipes(validationPipe)

  const port = configService.get("PORT", 3000)
  await app.listen(port)

  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`)
  logger.log(`📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`)
}

bootstrap()
