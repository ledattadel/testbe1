import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  Receipt,
  Brand,
  PriceQuote,
  PQProductDetail,
  PQServiceDetail,
  VehicleStatus,
  RepairOrder,
  Staff,
} from "./index";
import vehicleService from "../service/vehicle.service";

@Entity()
export class VehicleStatusReceipt {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: true })
  TimeCreate: String;

  @Column({ nullable: true })
  Condition: string;

  @Column({ nullable: true })
  IsAcceptedRepair: boolean;

  @Column({ nullable: true })
  IsRepairDone: boolean;

  @Column({ nullable: false, default: false })
  isTranferToPriceQuote: boolean;

  @Column({ nullable: false, default: false })
  isTranferToRepairOrder: boolean;

  @Column({ nullable: true })
  VehicleStatusID: number;

  @ManyToOne(
    () => VehicleStatus,
    (vehicleStatus) => vehicleStatus.vehicleStatusReceipts
  )
  @JoinColumn({ name: "VehicleStatusID" })
  vehicleStatus: VehicleStatus;


  

  @Column({ nullable: true })
  ReceiptID: number;

  @ManyToOne(() => Receipt, (receipt) => receipt.vehicleStatusReceipts)
  @JoinColumn({ name: "ReceiptID" })
  receipt: Receipt;


  @Column({ nullable: true })
  QuoteID: number;

  @ManyToOne(() => PriceQuote, (pq) => pq.vehicleStatusReceipts)
  @JoinColumn({ name: "QuoteID" })
  PriceQuote: PriceQuote;


  @OneToMany(
    () => PQProductDetail,
    (pqProductDetail) => pqProductDetail.vehicleStatusReceipt
  )
  pqProductDetails: PQProductDetail[];

  @OneToMany(
    () => PQServiceDetail,
    (pqServiceDetail) => pqServiceDetail.VehicleStatusReceipt
  )
  pqServiceDetails: PQServiceDetail[];

  @Column({ nullable: true })
  RepairOrderID: number;

  @ManyToOne(() => RepairOrder, (ro: any) => ro.VehicleStatusReceipts)
  @JoinColumn({ name: "RepairOrderID" })
  repairOrder: RepairOrder;

  @Column({ nullable: true })
  TechnicianID: number;

  @ManyToOne(() => Staff, (staff) => staff.VehicleStatusTechnician)
  @JoinColumn({ name: "TechnicianID" })
  staff: Staff;
}
