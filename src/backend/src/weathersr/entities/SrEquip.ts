import { Column, Entity } from 'typeorm';

@Entity('sr_equip', { schema: 'sriver_dev' })
export class SrEquip {
  @Column('varchar', { primary: true, name: 'observatoryCode', length: 13 })
  observatoryCode: string;

  @Column('varchar', { name: 'observatoryName', length: 50 })
  observatoryName: string;

  @Column('varchar', { name: 'IP', nullable: true, length: 20 })
  ip: string | null;

  @Column('varchar', { name: 'PORT', nullable: true, length: 5 })
  port: string | null;

  @Column('tinyint', { name: 'ErrorChk', nullable: true })
  errorChk: number | null;

  @Column('varchar', { name: 'LastDate', nullable: true, length: 20 })
  LastDate: string | null;

  @Column('varchar', { name: 'LastStatus', nullable: true, length: 20 })
  lastStatus: string | null;

  @Column('varchar', { name: 'DTL_ADRES', nullable: true, length: 255 })
  dtlAdres: string | null;

  @Column('float', { name: 'LAT', nullable: true, precision: 12 })
  lat: number | null;

  @Column('float', { name: 'LON', nullable: true, precision: 12 })
  lon: number | null;

  @Column('decimal', { name: 'DATA', nullable: true, precision: 7, scale: 3 })
  data: number | null;

  @Column('decimal', {
    name: 'DATA_MIN',
    nullable: true,
    precision: 7,
    scale: 3,
  })
  dataMin: number | null;

  @Column('decimal', {
    name: 'DATA_MAX',
    nullable: true,
    precision: 7,
    scale: 3,
  })
  dataMax: number | null;

  @Column('decimal', {
    name: 'THRESHOLD_L1',
    nullable: true,
    precision: 7,
    scale: 3,
  })
  thresholdL1: number | null;

  @Column('decimal', {
    name: 'THRESHOLD_L2',
    nullable: true,
    precision: 7,
    scale: 3,
  })
  thresholdL2: number | null;

  @Column('decimal', {
    name: 'THRESHOLD_L3',
    nullable: true,
    precision: 7,
    scale: 3,
  })
  thresholdL3: number | null;

  @Column('varchar', { name: 'RTSP_URL', nullable: true, length: 1024 })
  rtspUrl: string | null;

  @Column('mediumtext', { name: 'RTSP_IMG', nullable: true })
  rtspImg: string | null;

  @Column('varchar', { name: 'INSTALL_DATE', nullable: true, length: 20 })
  installDate: string | null;
}
