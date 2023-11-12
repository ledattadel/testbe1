import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn , OneToMany} from 'typeorm';
import { PriceQuote ,VehicleStatusReceipt } from './index';

@Entity()
export class RepairOrder {
  @PrimaryGeneratedColumn()
  RepairOrderID: number;

  @Column()
  IsDone: boolean;

  @Column({ default: false, nullable: false })
  isRepairOrderGenerated: boolean;
  
  @Column({ nullable: true})
  TimeCreate: string;
  
  @Column()
  QuoteID: number;

  @OneToOne(() => PriceQuote, (pq) => pq.repairOrder)
  @JoinColumn({ name: 'QuoteID' })
  priceQuote: PriceQuote;

  @OneToMany(() => VehicleStatusReceipt, (vsr) => vsr.repairOrder)
  VehicleStatusReceipts: VehicleStatusReceipt[];

}

