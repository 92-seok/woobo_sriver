// Module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Base
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

// Entities
import { SrEquip } from './entities/SrEquip';
import { SrData } from './entities/SrData';
import { SrStation } from './entities/SrStation';

@Module({
  imports: [
    TypeOrmModule.forFeature([SrEquip, SrData, SrStation], 'sriver_dev'),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
