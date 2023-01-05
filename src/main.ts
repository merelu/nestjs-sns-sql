import { AllExceptionFilter } from '@infrastructure/common/filter/exception.filter';
import { LoggingInterceptor } from '@infrastructure/common/interceptors/logger.interceptor';
import { ResponseInterceptor } from '@infrastructure/common/interceptors/response.interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from '@infrastructure/services/logger/logger.service';
import { createValidationException } from '@infrastructure/utils/create-validation-exception';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());

  app.use(helmet());
  // filters
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => createValidationException(errors),
    }),
  );

  //version
  app.enableVersioning({
    type: VersioningType.MEDIA_TYPE,
    key: 'v=',
  });

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor(new LoggerService()));

  app.set('trust proxy', 1);

  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Peaksum Weeples')
      .setDescription('Peaksum works API 문서입니다.(SQL)')
      .setVersion('1.0')
      .setExternalDoc('스웨거 JSON', '/doc-json')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('doc', app, document, {
      useGlobalPrefix: true,
      customCssUrl: '/static/swagger-material.css',
      customSiteTitle: 'Peaksum Weeples swagger',
      customfavIcon: '/static/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
      },
    });
  }

  await app.listen(8100);
}
bootstrap();
