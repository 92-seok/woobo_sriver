import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 환경변수 디버깅
  console.log('== 🔍 환경변수 확인 ==');
  console.log('NODE_ENV: ', process.env.NODE_ENV);
  console.log('SERVICE_PORT: ', process.env.SERVICE_PORT);

  // console.log('========== DB ==========');
  // console.log('DB_HOST: ', process.env.DB_HOST);
  // console.log('DB_PORT: ', process.env.DB_PORT);
  // console.log('DB_USERNAME: ', process.env.DB_USERNAME);
  // console.log('DB_PASSWORD: ', process.env.DB_PASSWORD);
  // console.log('DB_DATABASE: ', process.env.DB_DATABASE);

  console.log('========== DB_WEATHERSR ==========');
  console.log('DB_HOST_WEATHERSR: ', process.env.DB_HOST_WEATHERSR);
  console.log('DB_PORT_WEATHERSR: ', process.env.DB_PORT_WEATHERSR);
  console.log('DB_USERNAME_WEATHERSR: ', process.env.DB_USERNAME_WEATHERSR);
  console.log('DB_PASSWORD_WEATHERSR: ', process.env.DB_PASSWORD_WEATHERSR);
  console.log('DB_DATABASE_WEATHERSR: ', process.env.DB_DATABASE_WEATHERSR);

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: ['http://localhost', 'http://localhost:8000'],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
  console.log(
    `🚀 애플리케이션이 http://localhost:${process.env.SERVICE_PORT}(${await app.getUrl()}) 에서 실행 중입니다`,
  );
}
bootstrap();
