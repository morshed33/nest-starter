import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeConfig } from './common/validators/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.use(helmet());
  app.enableCors({
    origin: appConfig.corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Nest Passport Local Google Prisma Auth')
    .setDescription('NPLGPA API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/docs', app, documentFactory);

  process.on('SIGINT', () => {
    void app.close();
  });

  process.on('SIGTERM', () => {
    void app.close();
  });

  // Global validation pipe with production-ready settings
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(appConfig.port);

  if (appConfig.nodeEnv !== 'production') {
    console.log(`Listening on http://localhost:${appConfig.port}`);
  }
}

bootstrap().catch(console.error);
