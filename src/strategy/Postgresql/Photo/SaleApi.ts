import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Sale } from "./Sale";
import { Book } from "./Book";

export default class SaleApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    // Create a new sale
    this.#express.post("/sales", this.createSale.bind(this));

    // Get all sales
    this.#express.get("/sales", this.getAllSales.bind(this));

    // Get a single sale by ID
    this.#express.get("/sales/:id", this.getSaleById.bind(this));

    // Update a sale
    this.#express.put("/sales/:id", this.updateSale.bind(this));

    // Delete a sale
    this.#express.delete("/sales/:id", this.deleteSale.bind(this));
  }

  private async createSale(req: Request, res: Response) {
    const { book_id, sale_quantity, sale_date } = req.body;

    try {
      const book = await this.#dataSource.getRepository(Book).findOne({ where: { book_id } });

      if (!book) {
        return res.status(400).json({ error: "Invalid book ID." });
      }

      const sale = new Sale();
      sale.book = book;
      sale.sale_quantity = sale_quantity;
      sale.sale_date = new Date(sale_date);

      await this.#dataSource.manager.save(sale);

      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to create sale.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to create sale.", details: "Unknown error" });
      }
    }
  }

  private async getAllSales(req: Request, res: Response) {
    try {
      const sales = await this.#dataSource.getRepository(Sale).find({
        relations: ["book"],
      });
      res.status(200).json(sales);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve sales.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve sales.", details: "Unknown error" });
      }
    }
  }

  private async getSaleById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const sale = await this.#dataSource.getRepository(Sale).findOne({
        where: { sale_id: parseInt(id, 10) },
        relations: ["book"],
      });

      if (!sale) {
        return res.status(404).json({ error: "Sale not found." });
      }

      res.status(200).json(sale);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve sale.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve sale.", details: "Unknown error" });
      }
    }
  }

  private async updateSale(req: Request, res: Response) {
    const { id } = req.params;
    const { book_id, sale_quantity, sale_date } = req.body;

    try {
      const sale = await this.#dataSource.getRepository(Sale).findOne({
        where: { sale_id: parseInt(id, 10) },
        relations: ["book"],
      });

      if (!sale) {
        return res.status(404).json({ error: "Sale not found." });
      }

      if (book_id) {
        const book = await this.#dataSource.getRepository(Book).findOne({ where: { book_id } });
        if (!book) {
          return res.status(400).json({ error: "Invalid book ID." });
        }
        sale.book = book;
      }

      sale.sale_quantity = sale_quantity || sale.sale_quantity;
      sale.sale_date = sale_date ? new Date(sale_date) : sale.sale_date;

      await this.#dataSource.manager.save(sale);

      res.status(200).json(sale);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to update sale.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to update sale.", details: "Unknown error" });
      }
    }
  }

  private async deleteSale(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const sale = await this.#dataSource.getRepository(Sale).findOne({
        where: { sale_id: parseInt(id, 10) },
      });

      if (!sale) {
        return res.status(404).json({ error: "Sale not found." });
      }

      await this.#dataSource.manager.remove(sale);

      res.status(204).end();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to delete sale.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete sale.", details: "Unknown error" });
      }
    }
  }
}
