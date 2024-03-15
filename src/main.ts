import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //디폴트 값 허용
      transformOptions: {
        enableImplicitConversion: true,
        //임의로 타입변경 허용
        //예시: 파람스에 받은 string값을 eto에 해당하는 number로 변환
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
