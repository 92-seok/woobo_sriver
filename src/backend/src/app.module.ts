// Module
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Base
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weathersr/weather.module';

// Entities
import { SrEquip } from './weathersr/entities/SrEquip';
import { SrData } from './weathersr/entities/SrData';
import { SrStation } from './weathersr/entities/SrStation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      name: 'sriver_dev',
      type: 'mysql',
      host: process.env.DB_HOST_WEATHERSR,
      port: parseInt(process.env.DB_PORT_WEATHERSR || '4097'),
      username: process.env.DB_USERNAME_WEATHERSR,
      password: process.env.DB_PASSWORD_WEATHERSR,
      database: process.env.DB_DATABASE_WEATHERSR,
      entities: [SrEquip, SrData, SrStation],
      synchronize: false,
      logging: true,
    }),
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
