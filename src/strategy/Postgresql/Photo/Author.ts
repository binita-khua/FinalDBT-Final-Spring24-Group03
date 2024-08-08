import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  author_id!: number;  // Use '!' to assert that it's initialized elsewhere

  @Column({ length: 255 })
  author_name!: string;  // Use '!' to bypass strict initialization

  @Column("text", { nullable: true })
  author_bio?: string;  // Use '?' to indicate it can be undefined
}
