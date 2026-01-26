import { Column, Entity } from 'typeorm';

@Entity('sr_data', { schema: 'sriver_dev' })
export class SrData {
  @Column('varchar', {
    primary: true,
    name: 'observatoryCode',
    comment: '소하천 코드',
    length: 13,
  })
  observatoryCode: string;

  @Column('datetime', { primary: true, name: 'DataTime' })
  DataTime: Date;

  @Column('float', {
    name: 'LOGGER_GL',
    nullable: true,
    comment: '로거 GL',
    precision: 12,
  })
  LOGGER_GL: number | null;

  @Column('float', {
    name: 'LOGGER_EL',
    nullable: true,
    comment: '로거 EL',
    precision: 12,
  })
  LOGGER_EL: number | null;

  @Column('float', {
    name: 'LOGGER_FL',
    nullable: true,
    comment: '로거 FL',
    precision: 12,
  })
  LOGGER_FL: number | null;

  @Column('float', {
    name: 'waterLevel',
    nullable: true,
    comment: '수위 (EL-M)',
    precision: 12,
  })
  waterLevel: number | null;

  @Column('float', {
    name: 'averageVelocity',
    nullable: true,
    comment: '평균 유속 (m/s)',
    precision: 12,
  })
  averageVelocity: number | null;

  @Column('float', {
    name: 'totalDischarge',
    nullable: true,
    comment: '총 유량 (m3/s)',
    precision: 12,
  })
  totalDischarge: number | null;

  @Column('varchar', {
    name: 'apiStatusCode',
    nullable: true,
    comment: 'API 연계 상태',
    length: 10,
  })
  apiStatusCode: string | null;

  @Column('varchar', {
    name: 'waterLevelStatusCode',
    nullable: true,
    comment: '수위 계측기 상태 코드',
    length: 2,
  })
  waterLevelStatusCode: string | null;

  @Column('varchar', {
    name: 'velocityStatusCode',
    nullable: true,
    comment: '유속 계측기 상태 코드',
    length: 2,
  })
  velocityStatusCode: string | null;

  @Column('varchar', {
    name: 'dischargeStatusCode',
    nullable: true,
    comment: '유량 연산장치 상태 코드',
    length: 2,
  })
  dischargeStatusCode: string | null;

  @Column('varchar', {
    name: 'upsStatusCode',
    nullable: true,
    comment: 'UPS 장치 상태 코드',
    length: 2,
  })
  upsStatusCode: string | null;
}
