import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Review } from "./Review";
import { Book } from "./Book";
import { Customer } from "./Customer";

export default class ReviewApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    // Create a new review
    this.#express.post("/reviews", this.createReview.bind(this));

    // Get all reviews
    this.#express.get("/reviews", this.getAllReviews.bind(this));

    // Get a single review by ID
    this.#express.get("/reviews/:id", this.getReviewById.bind(this));

    // Update a review
    this.#express.put("/reviews/:id", this.updateReview.bind(this));

    // Delete a review
    this.#express.delete("/reviews/:id", this.deleteReview.bind(this));
  }

  private async createReview(req: Request, res: Response) {
    const { book_id, customer_id, review_rating, review_text, review_date } = req.body;

    try {
      const book = await this.#dataSource.getRepository(Book).findOne({ where: { book_id } });
      const customer = await this.#dataSource.getRepository(Customer).findOne({ where: { customer_id } });

      if (!book || !customer) {
        return res.status(400).json({ error: "Invalid book or customer ID." });
      }

      const review = new Review();
      review.book = book;
      review.customer = customer;
      review.review_rating = review_rating;
      review.review_text = review_text;
      review.review_date = new Date(review_date);

      await this.#dataSource.manager.save(review);

      res.status(201).json(review);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to create review.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to create review.", details: "Unknown error" });
      }
    }
  }

  private async getAllReviews(req: Request, res: Response) {
    try {
      const reviews = await this.#dataSource.getRepository(Review).find({
        relations: ["book", "customer"],
      });
      res.status(200).json(reviews);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve reviews.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve reviews.", details: "Unknown error" });
      }
    }
  }

  private async getReviewById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const review = await this.#dataSource.getRepository(Review).findOne({
        where: { review_id: parseInt(id, 10) },
        relations: ["book", "customer"],
      });

      if (!review) {
        return res.status(404).json({ error: "Review not found." });
      }

      res.status(200).json(review);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve review.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve review.", details: "Unknown error" });
      }
    }
  }

  private async updateReview(req: Request, res: Response) {
    const { id } = req.params;
    const { book_id, customer_id, review_rating, review_text, review_date } = req.body;

    try {
      const review = await this.#dataSource.getRepository(Review).findOne({
        where: { review_id: parseInt(id, 10) },
        relations: ["book", "customer"],
      });

      if (!review) {
        return res.status(404).json({ error: "Review not found." });
      }

      if (book_id) {
        const book = await this.#dataSource.getRepository(Book).findOne({ where: { book_id } });
        if (!book) {
          return res.status(400).json({ error: "Invalid book ID." });
        }
        review.book = book;
      }

      if (customer_id) {
        const customer = await this.#dataSource.getRepository(Customer).findOne({ where: { customer_id } });
        if (!customer) {
          return res.status(400).json({ error: "Invalid customer ID." });
        }
        review.customer = customer;
      }

      review.review_rating = review_rating || review.review_rating;
      review.review_text = review_text || review.review_text;
      review.review_date = review_date ? new Date(review_date) : review.review_date;

      await this.#dataSource.manager.save(review);

      res.status(200).json(review);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to update review.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to update review.", details: "Unknown error" });
      }
    }
  }

  private async deleteReview(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const review = await this.#dataSource.getRepository(Review).findOne({
        where: { review_id: parseInt(id, 10) },
      });

      if (!review) {
        return res.status(404).json({ error: "Review not found." });
      }

      await this.#dataSource.manager.remove(review);

      res.status(204).end();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to delete review.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete review.", details: "Unknown error" });
      }
    }
  }
}
