import { Entity, PrimaryGeneratedColumn, Column, OneToMany , ManyToOne, JoinColumn} from 'typeorm';
import { Receipt, Brand , PriceQuote, PQProductDetail, PQServiceDetail, VehicleStatus} from './index';
import vehicleService from '../service/vehicle.service';

@Entity()
export class VehicleStatusReceipt {
  @PrimaryGeneratedColumn()
  ID: number;

  
  @Column({ nullable: true })
  TimeCreate: String;
  
  @Column({ nullable: true })
  Condition: string;

  
  @Column({ nullable: true })
  IsDone: boolean;

  @Column({ nullable: false, default: false })
  isTranferToPriceQuote: boolean;

  @Column({ nullable: true })
  VehicleStatusID: number;

  @ManyToOne(() => VehicleStatus, (vehicleStatus) => vehicleStatus.vehicleStatusReceipts)
  @JoinColumn({ name: 'VehicleStatusID' })
  vehicleStatus: VehicleStatus;

  @Column({ nullable: true })
  ReceiptID: number;

  @ManyToOne(() => Receipt, (receipt) => receipt.vehicleStatusReceipts)
  @JoinColumn({ name: 'ReceiptID' })
  receipt: Receipt;


  
  @OneToMany(() => PQProductDetail, (pqProductDetail) => pqProductDetail.vehicleStatusReceipt)
  pqProductDetails: PQProductDetail[];


  @OneToMany(() => PQServiceDetail, (pqServiceDetail) => pqServiceDetail.VehicleStatusReceipt)
  pqServiceDetails: PQServiceDetail[];
}
