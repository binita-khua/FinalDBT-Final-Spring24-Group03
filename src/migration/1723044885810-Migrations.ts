import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration implements MigrationInterface {
    name = 'InitialMigration'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "author" (
            "author_id" SERIAL NOT NULL, 
            "author_name" character varying(255) NOT NULL, 
            "author_bio" text, 
            CONSTRAINT "PK_c36fb987d8132c9bdb15916e619" PRIMARY KEY ("author_id")
        )`);

        await queryRunner.query(`CREATE TABLE "sale" (
            "sale_id" SERIAL NOT NULL, 
            "book_id" integer, 
            "sale_quantity" integer NOT NULL, 
            "sale_date" DATE NOT NULL, 
            CONSTRAINT "PK_d98024a5b87c2d1e99283de4c1e" PRIMARY KEY ("sale_id")
        )`);

        await queryRunner.query(`CREATE TABLE "book" (
            "book_id" SERIAL NOT NULL, 
            "book_title" character varying(255) NOT NULL, 
            "author_id" integer, 
            "publisher_id" integer, 
            "book_genre" character varying(255) NOT NULL, 
            "book_format" character varying NOT NULL, 
            "book_price" double precision NOT NULL, 
            "book_publish_date" DATE NOT NULL, 
            "book_avg_rating" double precision NOT NULL, 
            CONSTRAINT "PK_4c2f42b5b972c3b0e0e2f865dbc" PRIMARY KEY ("book_id")
        )`);

        await queryRunner.query(`CREATE TABLE "customer" (
            "customer_id" SERIAL NOT NULL, 
            "customer_name" character varying(255) NOT NULL, 
            "customer_email" character varying(255) NOT NULL UNIQUE, 
            "customer_phone" character varying(50) NOT NULL, 
            "customer_address" character varying(255) NOT NULL, 
            "customer_total_spent" double precision NOT NULL, 
            "customer_last_purchase_date" DATE NOT NULL, 
            CONSTRAINT "PK_a630a79fe2e9cc4e8cb89e9d4e7" PRIMARY KEY ("customer_id")
        )`);

        await queryRunner.query(`CREATE TABLE "publisher" (
            "publisher_id" SERIAL NOT NULL, 
            "publisher_name" character varying(255) NOT NULL, 
            "publisher_address" character varying(255) NOT NULL, 
            "publisher_phone" character varying(50) NOT NULL, 
            CONSTRAINT "PK_4e96b10da594456eea8a437b6c9" PRIMARY KEY ("publisher_id")
        )`);

        await queryRunner.query(`CREATE TABLE "purchase" (
            "purchase_id" SERIAL NOT NULL, 
            "customer_id" integer, 
            "book_id" integer, 
            "purchase_date" DATE NOT NULL, 
            "purchase_quantity" integer NOT NULL, 
            "purchase_amount" decimal(10,2) NOT NULL, 
            CONSTRAINT "PK_4fb0a7c87e3c2f05d2e6d91b192" PRIMARY KEY ("purchase_id")
        )`);

        await queryRunner.query(`CREATE TABLE "review" (
            "review_id" SERIAL NOT NULL, 
            "book_id" integer, 
            "customer_id" integer, 
            "review_rating" integer NOT NULL, 
            "review_text" text NOT NULL, 
            "review_date" DATE NOT NULL, 
            CONSTRAINT "PK_9282a1a82015b77810e0e6ed7b2" PRIMARY KEY ("review_id")
        )`);

        // Create foreign key constraints
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_book_sale" FOREIGN KEY ("book_id") REFERENCES "book"("book_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_author_book" FOREIGN KEY ("author_id") REFERENCES "author"("author_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_publisher_book" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("publisher_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_customer_purchase" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_book_purchase" FOREIGN KEY ("book_id") REFERENCES "book"("book_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_book_review" FOREIGN KEY ("book_id") REFERENCES "book"("book_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_customer_review" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_customer_review"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_book_review"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_book_purchase"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_customer_purchase"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_publisher_book"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_author_book"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_book_sale"`);

        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
        await queryRunner.query(`DROP TABLE "publisher"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "sale"`);
        await queryRunner.query(`DROP TABLE "author"`);
    }
}
