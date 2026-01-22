import { PartialType } from '@nestjs/mapped-types';
import { DeviceResponseDto } from './device-response.dto';

export class UpdateWeatherDto extends PartialType(DeviceResponseDto) {}
