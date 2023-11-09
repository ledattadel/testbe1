import { Entity, PrimaryGeneratedColumn, Column, OneToMany , ManyToOne, JoinColumn} from 'typeorm';
import { Receipt, Brand , PriceQuote, PQProductDetail, PQServiceDetail} from './index';
import vehicleService from '../service/vehicle.service';


@Entity()
export class VehicleStatus {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: false })
  Name: string;

  @Column({ nullable: true })
  TimeCreate: String;
  
  @Column({ nullable: true })
  Condition: string;

  
  @Column({ nullable: true })
  IsDone: boolean;

  @Column({ nullable: false, default: false })
  isTranferToPriceQuote: boolean;

  @Column({ nullable: true })
  ReceiptId: number;

  @ManyToOne(() => Receipt, (receipt) => receipt.vehicleStatuses)
  @JoinColumn({ name: 'ReceiptId' })
  receipt: Receipt;

  @OneToMany(() => PQProductDetail, (pqProductDetail) => pqProductDetail.vehicleStatus)
  pqProductDetails: PQProductDetail[];


  @OneToMany(() => PQServiceDetail, (pqServiceDetail) => pqServiceDetail.vehicleStatus)
  pqServiceDetails: PQServiceDetail[];
}
