import {
  LogLevel,
  VERSION_NEUTRAL,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/module/app.module';

declare const module: any;

async function bootstrap() {
  const logLevel = ((process.env.LOGGER_LEVEL as string) || 'error').split(
    ',',
  ) as LogLevel[];
  const app = await NestFactory.create(AppModule, {
    logger: logLevel,
    bufferLogs: true,
  });
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Together Core API example')
    .setDescription('The Together Core API description')
    .setVersion('1.0')
    .addTag('Together Core API')
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  if (process.env.NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  await app.listen(port);
  console.log('listening on port', port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap().then(() => console.log('bootstrap'));
