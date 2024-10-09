import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  dotenv.config();
  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        name: 'Token',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        description: "Enter Token",
        type: 'http',
        in: 'Header',
      },
      'authorization',
    )
    .setTitle('Area API')
    .addTag('Authentication', 'Use these route for an access_token to unlock access to other routes')
    .addTag('Authorization', 'Authorize our App to access_token your service accounts')
    .addTag('User', 'Use these route to get information from an access_token')
    .addTag('Areas', 'Use these route to handle areas')
    .setDescription('The Area API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 8090);
}
bootstrap();
