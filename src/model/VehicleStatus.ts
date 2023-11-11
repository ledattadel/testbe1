import { Entity, PrimaryGeneratedColumn, Column, OneToMany , ManyToOne, JoinColumn} from 'typeorm';
import { Receipt, Brand , PriceQuote, PQProductDetail, PQServiceDetail, VehicleStatusReceipt} from './index';
import vehicleService from '../service/vehicle.service';


@Entity()
export class VehicleStatus {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: false })
  Name: string;

  // @Column({ nullable: true })
  // ReceiptId: number;

  // @ManyToOne(() => Receipt, (receipt) => receipt.vehicleStatuses)
  // @JoinColumn({ name: 'ReceiptId' })
  // receipt: Receipt;

  @OneToMany(() => VehicleStatusReceipt, (vsr) => vsr.vehicleStatus)
  vehicleStatusReceipts: VehicleStatusReceipt[];


}
