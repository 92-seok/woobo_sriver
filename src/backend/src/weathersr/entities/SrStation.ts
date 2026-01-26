import { Column, Entity } from 'typeorm';

@Entity('sr_station', { schema: 'sriver_dev' })
export class SrStation {
  @Column('varchar', { primary: true, name: 'observatoryCode', length: 13 })
  observatoryCode: string;

  @Column('varchar', { name: 'observatoryName', nullable: true, length: 50 })
  observatoryName: string | null;

  @Column('varchar', { name: 'BDONG_CD', nullable: true, length: 10 })
  BDONG_CD: string | null;

  @Column('varchar', {
    name: 'DTL_ADRES',
    nullable: true,
    comment: '주소',
    length: 255,
  })
  DTL_ADRES: string | null;

  @Column('float', {
    name: 'LAT',
    nullable: true,
    comment: '위도',
    precision: 12,
  })
  lat: number | null;

  @Column('float', {
    name: 'LON',
    nullable: true,
    comment: '경도',
    precision: 12,
  })
  lon: number | null;

  @Column('varchar', {
    name: 'LastDate',
    nullable: true,
    comment: '마지막 통신시간',
    length: 20,
  })
  LastDate: string | null;

  @Column('varchar', { name: 'SW_VERSION', nullable: true, length: 10 })
  SW_VERSION: string | null;

  @Column('varchar', { name: 'FW_VERSION', nullable: true, length: 10 })
  FW_VERSION: string | null;

  @Column('varchar', {
    name: 'INSTALL_DATE',
    nullable: true,
    comment: '설치일',
    length: 20,
  })
  INSTALL_DATE: string | null;
}
