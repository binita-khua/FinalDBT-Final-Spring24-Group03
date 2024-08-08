import { DataSource } from "typeorm";
import { Author } from "./Photo/Author";
import { Sale } from "./Photo/Sale";
import { Book } from "./Photo/Book";
import { Customer } from "./Photo/Customer";
import { Publisher } from "./Photo/Publisher";
import { Purchase } from "./Photo/Purchase";
import { Review } from "./Photo/Review";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'spring dbt',
  synchronize: false,
  logging: false,
  entities: [Sale, Book, Customer, Author, Publisher, Purchase, Review],
  migrationsTableName: "Migrations",
});
