import { Entity, PrimaryGeneratedColumn, Column, OneToMany , ManyToOne, JoinColumn} from 'typeorm';
import { Receipt, Brand , PriceQuote, PQProductDetail, PQServiceDetail, VehicleStatusReceipt} from './index';
import vehicleService from '../service/vehicle.service';


@Entity()
export class VehicleStatus {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: false })
  Name: string;


  @OneToMany(() => VehicleStatusReceipt, (vsr) => vsr.vehicleStatus)
  vehicleStatusReceipts: VehicleStatusReceipt[];


}
