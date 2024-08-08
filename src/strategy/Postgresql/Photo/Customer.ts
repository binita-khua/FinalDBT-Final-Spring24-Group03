import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column({ length: 255 })
  customer_name: string;

  @Column({ length: 255, unique: true })
  customer_email: string;

  @Column({ length: 50 })
  customer_phone: string;

  @Column({ length: 255 })
  customer_address: string;

  @Column("float")
  customer_total_spent: number;

  @Column("date")
  customer_last_purchase_date: Date;
}
