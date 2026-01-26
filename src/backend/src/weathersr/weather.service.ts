import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SrEquip } from './entities/SrEquip';
import { SrData } from './entities/SrData';
import { SrStation } from './entities/SrStation';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(SrEquip, 'sriver_dev')
    private readonly srEquipRepo: Repository<SrEquip>,
    @InjectRepository(SrData, 'sriver_dev')
    private readonly srDataRepo: Repository<SrData>,
    @InjectRepository(SrStation, 'sriver_dev')
    private readonly srStationRepo: Repository<SrStation>,
  ) {}

  // --------------- SrEquip ---------------

  // 전체 장비 목록 조회
  async findAll() {
    const equipList = await this.srEquipRepo.find();
    return equipList.map((equip) => this.toDeviceDto(equip));
  }

  // 단일 장비 조회
  async findOne(id: string) {
    const equip = await this.srEquipRepo.findOne({
      where: { observatoryCode: id },
    });
    return equip ? this.toDeviceDto(equip) : null;
  }

  // Entity → Frontend DTO 변환
  private toDeviceDto(equip: SrEquip) {
    // 수위 % 계산
    const dataVal = equip.data ? equip.data : 0;
    const dataMin = equip.dataMin ? equip.dataMin : 0;
    const dataMax = equip.dataMax ? equip.dataMax : 100;

    equip.dataMin = equip.dataMin ?? 0;
    equip.dataMax = equip.dataMax ?? 100;
    equip.data = equip.data ?? equip.dataMin;

    const water_data = equip.data ? equip.data - equip.dataMin : equip.dataMin;

    let water: number | null = null;
    if (dataMax > dataMin) {
      water = Math.round(((dataVal - dataMin) / (dataMax - dataMin)) * 100);
      water = Math.min(100, Math.max(0, water)); // 0~100 범위 제한
    }

    // 온라인 상태 판단 (errorChk: 0 = 에러, 1~5 = 정상)
    const online =
      equip.errorChk !== null && equip.errorChk >= 1 && equip.errorChk <= 5;
    const netError = equip.errorChk === 0;

    // 함체 높이 값 구하기
    const height = dataMax > dataMin ? (dataMax - dataMin).toFixed(2) : null;

    // 임계 값 계산하기
    const thresholdL1_data = equip.thresholdL1
      ? ((dataMax - dataMin) * (equip.thresholdL1 / 100)).toFixed(2)
      : null;
    const thresholdL2_data = equip.thresholdL2
      ? ((dataMax - dataMin) * (equip.thresholdL2 / 100)).toFixed(2)
      : null;
    const thresholdL3_data = equip.thresholdL3
      ? ((dataMax - dataMin) * (equip.thresholdL3 / 100)).toFixed(2)
      : null;

    return {
      id: equip.observatoryCode,
      name: equip.observatoryName,
      addr: equip.dtlAdres || '',
      lat: equip.lat,
      lon: equip.lon,
      water: online ? water : null,
      water_data,
      online,
      netError,
      img: equip.rtspImg || null,
      rtspUrl: equip.rtspUrl || null,
      lastDate: equip.lastDate || null,
      installDate: equip.installDate || null,
      height,
      thresholdL1: equip.thresholdL1 ?? 70,
      thresholdL2: equip.thresholdL2 ?? 80,
      thresholdL3: equip.thresholdL3 ?? 90,
      thresholdL1_data: Number(thresholdL1_data),
      thresholdL2_data: Number(thresholdL2_data),
      thresholdL3_data: Number(thresholdL3_data),
    };
  }

  // --------------- SrData ---------------

  // 상세보기 장비 계측 데이터 조회
  async findLatestData(id: string) {
    const data = await this.srDataRepo.findOne({
      where: { observatoryCode: id },
      order: { DataTime: 'DESC' }, // 최신데이터
    });
    return data ? this.toDataDto(data) : null;
  }

  // SrData -> Frontend DTO 전환
  private toDataDto(data: SrData) {
    // DataTime을 로컬 시간 문자열로 변환

    return {
      DataTime: data.DataTime,
      LOGGER_GL: data.LOGGER_GL,
      LOGGER_EL: data.LOGGER_EL,
      LOGGER_FL: data.LOGGER_FL,
      waterLevel: data.waterLevel,
      averageVelocity: data.averageVelocity,
      totalDischarge: data.totalDischarge,
      apiStatusCode: data.apiStatusCode,
      waterLevelStatusCode: data.waterLevelStatusCode,
      velocityStatusCode: data.velocityStatusCode,
      dischargeStatusCode: data.dischargeStatusCode,
      upsStatusCode: data.upsStatusCode,
    };
  }

  // --------------- SrStation ---------------
  // 장비 스테이션 정보 조회
  async findStationData(id: string) {
    const station = await this.srStationRepo.findOne({
      where: { observatoryCode: id },
    });
    return station ? this.toStationDto(station) : null;
  }

  // SrStation -> Frontend DTO 전환
  private toStationDto(station: SrStation) {
    return {
      SW_VERSION: station.SW_VERSION,
      FW_VERSION: station.FW_VERSION,
      LastDate: station.LastDate,
      INSTALL_DATE: station.INSTALL_DATE,
    };
  }
}
