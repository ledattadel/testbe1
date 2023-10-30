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
  Vehicle
} from './model';




export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'mysql-152552-0.cloudclusters.net',
  port: 14163,
  username: 'admin',
  password: 'qBbTinYR',
  database: 'garage',
  synchronize: true,
  logging: false,
  entities: [
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
