import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Publisher } from "./Publisher";

export default class PublisherApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    // Create a new publisher
    this.#express.post("/publishers", this.createPublisher.bind(this));

    // Get all publishers
    this.#express.get("/publishers", this.getAllPublishers.bind(this));

    // Get a single publisher by ID
    this.#express.get("/publishers/:id", this.getPublisherById.bind(this));

    // Update a publisher
    this.#express.put("/publishers/:id", this.updatePublisher.bind(this));

    // Delete a publisher
    this.#express.delete("/publishers/:id", this.deletePublisher.bind(this));
  }

  private async createPublisher(req: Request, res: Response) {
    const {
      publisher_name,
      publisher_address,
      publisher_phone,
    } = req.body;

    const publisher = new Publisher();
    publisher.publisher_name = publisher_name;
    publisher.publisher_address = publisher_address;
    publisher.publisher_phone = publisher_phone;

    try {
      await this.#dataSource.manager.save(publisher);
      res.status(201).json(publisher);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to create publisher.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to create publisher.", details: "Unknown error" });
      }
    }
  }

  private async getAllPublishers(req: Request, res: Response) {
    try {
      const publishers = await this.#dataSource.getRepository(Publisher).find();
      res.status(200).json(publishers);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve publishers.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve publishers.", details: "Unknown error" });
      }
    }
  }

  private async getPublisherById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const publisher = await this.#dataSource.getRepository(Publisher).findOne({
        where: { publisher_id: parseInt(id, 10) },
      });

      if (!publisher) {
        return res.status(404).json({ error: "Publisher not found." });
      }

      res.status(200).json(publisher);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve publisher.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve publisher.", details: "Unknown error" });
      }
    }
  }

  private async updatePublisher(req: Request, res: Response) {
    const { id } = req.params;
    const {
      publisher_name,
      publisher_address,
      publisher_phone,
    } = req.body;

    try {
      const publisher = await this.#dataSource.getRepository(Publisher).findOne({
        where: { publisher_id: parseInt(id, 10) },
      });

      if (!publisher) {
        return res.status(404).json({ error: "Publisher not found." });
      }

      publisher.publisher_name = publisher_name || publisher.publisher_name;
      publisher.publisher_address = publisher_address || publisher.publisher_address;
      publisher.publisher_phone = publisher_phone || publisher.publisher_phone;

      await this.#dataSource.manager.save(publisher);

      res.status(200).json(publisher);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to update publisher.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to update publisher.", details: "Unknown error" });
      }
    }
  }

  private async deletePublisher(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const publisher = await this.#dataSource.getRepository(Publisher).findOne({
        where: { publisher_id: parseInt(id, 10) },
      });

      if (!publisher) {
        return res.status(404).json({ error: "Publisher not found." });
      }

      await this.#dataSource.manager.remove(publisher);

      res.status(204).end();
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to delete publisher.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete publisher.", details: "Unknown error" });
      }
    }
  }
}
