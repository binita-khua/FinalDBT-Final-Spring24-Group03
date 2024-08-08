import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Author } from "./Author";
import { Publisher } from "./Publisher";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  book_id: number;

  @Column({ length: 255 })
  book_title: string;

  @ManyToOne(() => Author)
  author: Author;

  @ManyToOne(() => Publisher)
  publisher: Publisher;

  @Column({ length: 255 })
  book_genre: string;

  @Column({
    type: "enum",
    enum: ["physical", "ebook", "audiobook"],
    default: "physical"
  })
  book_format: string;

  @Column("float")
  book_price: number;

  @Column("date")
  book_publish_date: Date;

  @Column("float")
  book_avg_rating: number;
}
