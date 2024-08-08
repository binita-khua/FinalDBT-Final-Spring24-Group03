import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  sale_id: number;

  @ManyToOne(() => Book)
  book: Book;

  @Column("int")
  sale_quantity: number;

  @Column("date")
  sale_date: Date;
}
