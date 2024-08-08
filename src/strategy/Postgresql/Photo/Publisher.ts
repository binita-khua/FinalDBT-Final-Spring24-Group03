import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Publisher {
  @PrimaryGeneratedColumn()
  publisher_id: number;

  @Column({ length: 255 })
  publisher_name: string;

  @Column({ length: 255 })
  publisher_address: string;

  @Column({ length: 50 })
  publisher_phone: string;
}
