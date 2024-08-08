import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Customer } from "./Customer";
import { Book } from "./Book";

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  purchase_id: number;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Book)
  book: Book;

  @Column("date")
  purchase_date: Date;

  @Column("int")
  purchase_quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  purchase_amount: number;
}
