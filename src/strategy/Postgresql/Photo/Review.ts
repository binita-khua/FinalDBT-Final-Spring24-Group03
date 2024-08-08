import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Book } from "./Book";
import { Customer } from "./Customer";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @ManyToOne(() => Book)
  book: Book;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column("int")
  review_rating: number;

  @Column("text")
  review_text: string;

  @Column("date")
  review_date: Date;
}
