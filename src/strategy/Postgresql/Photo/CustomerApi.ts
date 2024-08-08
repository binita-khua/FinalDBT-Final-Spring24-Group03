import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Customer } from "./Customer";

export default class CustomerApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    // Create a new customer
    this.#express.post("/customers", this.createCustomer.bind(this));

    // Get all customers
    this.#express.get("/customers", this.getAllCustomers.bind(this));

    // Get a single customer by ID
    this.#express.get("/customers/:id", this.getCustomerById.bind(this));

    // Update a customer
    this.#express.put("/customers/:id", this.updateCustomer.bind(this));

    // Delete a customer
    this.#express.delete("/customers/:id", this.deleteCustomer.bind(this));
  }

  private async createCustomer(req: Request, res: Response) {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_total_spent,
      customer_last_purchase_date,
    } = req.body;

    const customer = new Customer();
    customer.customer_name = customer_name;
    customer.customer_email = customer_email;
    customer.customer_phone = customer_phone;
    customer.customer_address = customer_address;
    customer.customer_total_spent = customer_total_spent;
    customer.customer_last_purchase_date = new Date(customer_last_purchase_date);

    try {
      await this.#dataSource.manager.save(customer);
      res.status(201).json(customer);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to create customer.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to create customer.", details: "Unknown error" });
      }
    }
  }

  private async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await this.#dataSource.getRepository(Customer).find();
      res.status(200).json(customers);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve customers.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve customers.", details: "Unknown error" });
      }
    }
  }

  private async getCustomerById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const customer = await this.#dataSource.getRepository(Customer).findOne({
        where: { customer_id: parseInt(id, 10) },
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found." });
      }

      res.status(200).json(customer);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to retrieve customer.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to retrieve customer.", details: "Unknown error" });
      }
    }
  }

  private async updateCustomer(req: Request, res: Response) {
    const { id } = req.params;
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_total_spent,
      customer_last_purchase_date,
    } = req.body;

    try {
      const customer = await this.#dataSource.getRepository(Customer).findOne({
        where: { customer_id: parseInt(id, 10) },
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found." });
      }

      customer.customer_name = customer_name || customer.customer_name;
      customer.customer_email = customer_email || customer.customer_email;
      customer.customer_phone = customer_phone || customer.customer_phone;
      customer.customer_address = customer_address || customer.customer_address;
      customer.customer_total_spent = customer_total_spent || customer.customer_total_spent;
      customer.customer_last_purchase_date = customer_last_purchase_date
        ? new Date(customer_last_purchase_date)
        : customer.customer_last_purchase_date;

      await this.#dataSource.manager.save(customer);

      res.status(200).json(customer);
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to update customer.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to update customer.", details: "Unknown error" });
      }
    }
  }

  private async deleteCustomer(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const customer = await this.#dataSource.getRepository(Customer).findOne({
        where: { customer_id: parseInt(id, 10) },
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found." });
      }

      await this.#dataSource.manager.remove(customer);

      res.status(204).end();
    } catch (error) {
      // Handle the error explicitly
      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to delete customer.", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete customer.", details: "Unknown error" });
      }
    }
  }
}
