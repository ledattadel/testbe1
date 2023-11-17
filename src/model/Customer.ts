import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Receipt } from './index';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  CustomerID: number;

  @Column()
  name: string;

  @Column()
  TimeCreate: String;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;
  
  @Column({ nullable: false })
  isActive: boolean | null;

  @OneToMany(() => Receipt, (receipt) => receipt.customer)
  receipts: Receipt[];

  comparePassword = (password: string) => {
		return bcrypt.compareSync(password, this.password)
	}

	createPassword = (password: string) => {
		return (this.password = bcrypt.hashSync(password, 10))
	}

}
