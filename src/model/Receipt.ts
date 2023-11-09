import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Staff } from './index';
import { Customer } from './index';
import { Vehicle } from './index';
import { PriceQuote } from './PriceQuote';
import { Invoice } from './Invoice';
import { VehicleStatus } from './VehicleStatus';

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn()
  ReceiptID: number;

  @Column()
  TimeCreate: string;


  @Column({ nullable: true })
  TimeUpdate: string;

  @Column()
  Note: string;

  @Column()
  StaffID: number;


  @Column({ nullable: true })
  Editor: number | null;


  @Column()
  CustomerID: number;

  @Column()
  VehicleID: number;

      
  @Column({ nullable: false })
  isActive: boolean | null;

  @ManyToOne(() => Staff, (staff) => staff.receipts)
  @JoinColumn({ name: 'StaffID' })
  staff: Staff;

  @ManyToOne(() => Staff, (staff) => staff.editedReceipts)
  @JoinColumn({ name: 'Editor' })
  editor: Staff | null;
  

  @ManyToOne(() => Customer, (customer) => customer.receipts)
  @JoinColumn({ name: 'CustomerID' })
  customer: Customer;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.receipts)
  @JoinColumn({ name: 'VehicleID' })
  vehicle: Vehicle;

  @OneToMany(() => VehicleStatus, (vehicle) => vehicle.receipt)
  vehicleStatuses: VehicleStatus[];

  @OneToMany(() => PriceQuote, (pq) => pq.receipt)
  priceQuotes: PriceQuote[];

  @OneToMany(() => Invoice, (invoice : any) => invoice.receipt)
  invoices: Invoice[];
}
