import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Book } from "./Book";
import { Author } from "./Author";
import { Publisher } from "./Publisher";

export default class BooksApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    // Create a new book
    this.#express.post("/books", this.createBook.bind(this));

    // Get all books
    this.#express.get("/books", this.getAllBooks.bind(this));

    // Get a single book by ID
    this.#express.get("/books/:id", this.getBookById.bind(this));

    // Update a book
    this.#express.put("/books/:id", this.updateBook.bind(this));

    // Delete a book
    this.#express.delete("/books/:id", this.deleteBook.bind(this));
  }

  private async createBook(req: Request, res: Response) {
    const {
      book_title,
      author_id,
      publisher_id,
      book_genre,
      book_format,
      book_price,
      book_publish_date,
      book_avg_rating,
    } = req.body;

    try {
      const author = await this.#dataSource.getRepository(Author).findOne({ where: { author_id } });
      const publisher = await this.#dataSource.getRepository(Publisher).findOne({ where: { publisher_id } });

      if (!author || !publisher) {
        return res.status(400).json({ error: "Invalid author or publisher ID." });
      }

      const book = new Book();
      book.book_title = book_title;
      book.author = author;
      book.publisher = publisher;
      book.book_genre = book_genre;
      book.book_format = book_format;
      book.book_price = book_price;
      book.book_publish_date = new Date(book_publish_date);
      book.book_avg_rating = book_avg_rating;

      await this.#dataSource.manager.save(book);

      res.status(201).json(book);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to create book.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to create book.", details: "Unknown error" });
      }
    }
  }

  private async getAllBooks(req: Request, res: Response) {
    try {
      const books = await this.#dataSource.getRepository(Book).find({
        relations: ["author", "publisher"],
      });
      res.status(200).json(books);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve books.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve books.", details: "Unknown error" });
      }
    }
  }

  private async getBookById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const book = await this.#dataSource.getRepository(Book).findOne({
        where: { book_id: parseInt(id, 10) },
        relations: ["author", "publisher"],
      });

      if (!book) {
        return res.status(404).json({ error: "Book not found." });
      }

      res.status(200).json(book);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve book.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve book.", details: "Unknown error" });
      }
    }
  }

  private async updateBook(req: Request, res: Response) {
    const { id } = req.params;
    const {
      book_title,
      author_id,
      publisher_id,
      book_genre,
      book_format,
      book_price,
      book_publish_date,
      book_avg_rating,
    } = req.body;

    try {
      const book = await this.#dataSource.getRepository(Book).findOne({
        where: { book_id: parseInt(id, 10) },
        relations: ["author", "publisher"],
      });

      if (!book) {
        return res.status(404).json({ error: "Book not found." });
      }

      if (author_id) {
        const author = await this.#dataSource.getRepository(Author).findOne({ where: { author_id } });
        if (!author) {
          return res.status(400).json({ error: "Invalid author ID." });
        }
        book.author = author;
      }

      if (publisher_id) {
        const publisher = await this.#dataSource.getRepository(Publisher).findOne({ where: { publisher_id } });
        if (!publisher) {
          return res.status(400).json({ error: "Invalid publisher ID." });
        }
        book.publisher = publisher;
      }

      book.book_title = book_title || book.book_title;
      book.book_genre = book_genre || book.book_genre;
      book.book_format = book_format || book.book_format;
      book.book_price = book_price || book.book_price;
      book.book_publish_date = book_publish_date ? new Date(book_publish_date) : book.book_publish_date;
      book.book_avg_rating = book_avg_rating || book.book_avg_rating;

      await this.#dataSource.manager.save(book);

      res.status(200).json(book);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to update book.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to update book.", details: "Unknown error" });
      }
    }
  }

  private async deleteBook(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const book = await this.#dataSource.getRepository(Book).findOne({
        where: { book_id: parseInt(id, 10) },
      });

      if (!book) {
        return res.status(404).json({ error: "Book not found." });
      }

      await this.#dataSource.manager.remove(book);

      res.status(204).end();
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to delete book.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete book.", details: "Unknown error" });
      }
    }
  }
}
