export class DeviceResponseDto {
  id: string;
  name: string;
  addr: string;
  lat: number | null;
  lon: number | null;
  water: number | null;
  data: number | null;
  online: boolean;
  netError: boolean;
  img: string | null;
  rtspUrl: string | null;
  lastDate: string | null;
  thresholdL1: number | null;
  thresholdL2: number | null;
  thresholdL3: number | null;
}
