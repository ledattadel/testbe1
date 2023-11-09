import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  Role,
  Staff,
  Customer,
  Invoice,
  Brand,
  PQProductDetail,
  PQServiceDetail,
  PriceQuote,
  Product,
  ProductDetail,
  PurchaseOrder,
  PurchaseOrderDetail,
  Receipt,
  RepairOrder,
  RepairOrderDetail,
  Service,
  Supplier,
  Vehicle,
  VehicleStatusReceipt,
  VehicleStatus
} from './model';




export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'mysql-153768-0.cloudclusters.net',
  port: 17419,
  username: 'admin',
  password: 'aRO43aRQ',
  database: 'garage',
  synchronize: true,
  logging: false,
  entities: [
    VehicleStatusReceipt,
  VehicleStatus,
  Role,
  Staff,
  Customer,
  Invoice,
  Brand,
  PQProductDetail,
  PQServiceDetail,
  PriceQuote,
  Product,
  ProductDetail,
  PurchaseOrder,
  PurchaseOrderDetail,
  Receipt,
  RepairOrder,
  RepairOrderDetail,
  Service,
  Supplier,
  Vehicle
  ],
  migrations: [],
  subscribers: [],
});
