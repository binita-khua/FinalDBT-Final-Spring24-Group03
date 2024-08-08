import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Purchase } from "./Purchase";
import { Customer } from "./Customer";
import { Book } from "./Book";

export default class PurchaseApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    // Create a new purchase
    this.#express.post("/purchases", this.createPurchase.bind(this));

    // Get all purchases
    this.#express.get("/purchases", this.getAllPurchases.bind(this));

    // Get a single purchase by ID
    this.#express.get("/purchases/:id", this.getPurchaseById.bind(this));

    // Update a purchase
    this.#express.put("/purchases/:id", this.updatePurchase.bind(this));

    // Delete a purchase
    this.#express.delete("/purchases/:id", this.deletePurchase.bind(this));
  }

  private async createPurchase(req: Request, res: Response) {
    const { customer_id, book_id, purchase_date, purchase_quantity, purchase_amount } = req.body;

    try {
      const customer = await this.#dataSource.getRepository(Customer).findOne({ where: { customer_id } });
      const book = await this.#dataSource.getRepository(Book).findOne({ where: { book_id } });

      if (!customer || !book) {
        return res.status(400).json({ error: "Invalid customer or book ID." });
      }

      const purchase = new Purchase();
      purchase.customer = customer;
      purchase.book = book;
      purchase.purchase_date = new Date(purchase_date);
      purchase.purchase_quantity = purchase_quantity;
      purchase.purchase_amount = purchase_amount;

      await this.#dataSource.manager.save(purchase);

      res.status(201).json(purchase);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to create purchase.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to create purchase.", details: "Unknown error" });
      }
    }
  }

  private async getAllPurchases(req: Request, res: Response) {
    try {
      const purchases = await this.#dataSource.getRepository(Purchase).find({
        relations: ["customer", "book"],
      });
      res.status(200).json(purchases);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve purchases.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve purchases.", details: "Unknown error" });
      }
    }
  }

  private async getPurchaseById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const purchase = await this.#dataSource.getRepository(Purchase).findOne({
        where: { purchase_id: parseInt(id, 10) },
        relations: ["customer", "book"],
      });

      if (!purchase) {
        return res.status(404).json({ error: "Purchase not found." });
      }

      res.status(200).json(purchase);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve purchase.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve purchase.", details: "Unknown error" });
      }
    }
  }

  private async updatePurchase(req: Request, res: Response) {
    const { id } = req.params;
    const { customer_id, book_id, purchase_date, purchase_quantity, purchase_amount } = req.body;

    try {
      const purchase = await this.#dataSource.getRepository(Purchase).findOne({
        where: { purchase_id: parseInt(id, 10) },
        relations: ["customer", "book"],
      });

      if (!purchase) {
        return res.status(404).json({ error: "Purchase not found." });
      }

      if (customer_id) {
        const customer = await this.#dataSource.getRepository(Customer).findOne({ where: { customer_id } });
        if (!customer) {
          return res.status(400).json({ error: "Invalid customer ID." });
        }
        purchase.customer = customer;
      }

      if (book_id) {
        const book = await this.#dataSource.getRepository(Book).findOne({ where: { book_id } });
        if (!book) {
          return res.status(400).json({ error: "Invalid book ID." });
        }
        purchase.book = book;
      }

      purchase.purchase_date = purchase_date ? new Date(purchase_date) : purchase.purchase_date;
      purchase.purchase_quantity = purchase_quantity || purchase.purchase_quantity;
      purchase.purchase_amount = purchase_amount || purchase.purchase_amount;

      await this.#dataSource.manager.save(purchase);

      res.status(200).json(purchase);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to update purchase.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to update purchase.", details: "Unknown error" });
      }
    }
  }

  private async deletePurchase(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const purchase = await this.#dataSource.getRepository(Purchase).findOne({
        where: { purchase_id: parseInt(id, 10) },
      });

      if (!purchase) {
        return res.status(404).json({ error: "Purchase not found." });
      }

      await this.#dataSource.manager.remove(purchase);

      res.status(204).end();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to delete purchase.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete purchase.", details: "Unknown error" });
      }
    }
  }
}
