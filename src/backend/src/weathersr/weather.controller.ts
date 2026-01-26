import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('/devices')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // GET /api/devices - 전체 장비 목록
  @Get()
  async findAll() {
    return this.weatherService.findAll();
  }

  // GET /api/device/:id/data - 장비 계측 데이터
  @Get('/:id/data')
  async getDeviceData(@Param('id') id: string) {
    return this.weatherService.findLatestData(id);
  }

  // GET /api/devices/:id - 단일 장비 상세
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.weatherService.findOne(id);
  }

  @Get(':id/station')
  async getStationData(@Param('id') id: string) {
    return this.weatherService.findStationData(id);
  }
}
