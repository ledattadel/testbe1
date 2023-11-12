import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , JoinColumn,OneToMany} from 'typeorm';
import { PriceQuote , VehicleStatusReceipt} from './index';
import { Service, VehicleStatus } from './index';

@Entity()
export class PQServiceDetail {
  @PrimaryGeneratedColumn()
  PQSDID: number;

  @Column()
  Price: number;

  @Column()
  ServiceID: number;

  @ManyToOne(() => Service, (service) => service.priceQuoteServiceDetails)
  @JoinColumn({ name: 'ServiceID' })
  service: Service;

  @Column({ nullable: true })
  VehicleStatusReceiptID: number;

  @ManyToOne(() => VehicleStatusReceipt, (VehicleStatusReceipt) => VehicleStatusReceipt.pqServiceDetails)
  @JoinColumn({ name: 'VehicleStatusReceiptID' })
  VehicleStatusReceipt: VehicleStatusReceipt;
}
