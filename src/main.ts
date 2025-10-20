import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({stopAtFirstError: true,}));
  app.setGlobalPrefix('api/appt'); 
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // exact origins
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false,          // set true only if you use cookies
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 4002, '0.0.0.0');
}
bootstrap();
