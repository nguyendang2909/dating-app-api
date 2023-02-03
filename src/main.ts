import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app.module';
import { CustomReturnFieldsInterceptor } from './middlewares/custom-return-fields.interceptor';
import { HttpExceptionFilter } from './middlewares/https-exception.filter';

const logger = new Logger('Main');

const API_PORT = process.env.API_PORT || 4000;

const NODE_ENV = process.env.NODE_ENV;

async function bootstrap() {
  const app =
    NODE_ENV === 'development'
      ? await NestFactory.create(AppModule, {
          httpsOptions: {
            key: fs.readFileSync('./.cert/key.pem'),
            cert: fs.readFileSync('./.cert/cert.pem'),
          },
        })
      : await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(helmet());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new CustomReturnFieldsInterceptor());

  if (process.env.NODE_ENV === 'development') {
    createSwagger(app);
  }

  const redisIoAdapter = new RedisIoAdapter(app);

  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(API_PORT);

  logger.log(`Application running on port ${API_PORT}`);
}

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('XXXXX')
    .setDescription('Hệ thống XXXXX')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
