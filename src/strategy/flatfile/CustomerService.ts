import FlatfilePersistence from "./flatfile";

interface Customer {
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  customer_total_spent: number;
  customer_last_purchase_date?: string; // Assuming date as string in ISO format
}

export default class CustomersTable {
  private persistence: FlatfilePersistence;
  private tableName = "customers";
  private idCounter: number;

  constructor() {
    this.persistence = new FlatfilePersistence();
    this.persistence.create(this.tableName);
    this.idCounter = this.getNextId();
  }

  private getNextId(): number {
    const customers = this.getAllCustomers();
    if (customers.length === 0) {
      return 1;
    } else {
      return Math.max(...customers.map(customer => customer.customer_id)) + 1;
    }
  }

  createCustomer(customer_name: string, customer_email: string, customer_total_spent: number, customer_phone?: string, customer_address?: string, customer_last_purchase_date?: string): Customer {
    const newCustomer: Customer = {
      customer_id: this.idCounter,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_total_spent,
      customer_last_purchase_date
    };

    this.persistence.insert<Customer>(newCustomer, this.tableName);
    this.idCounter += 1;
    return newCustomer;
  }

  getAllCustomers(): Customer[] {
    try {
      const customers: Customer[] = JSON.parse(this.persistence.read(this.tableName));
      return customers;
    } catch {
      return [];
    }
  }

  updateCustomer(customer_id: number, updatedCustomer: Partial<Customer>): void {
    const customers = this.getAllCustomers();
    const customerIndex = customers.findIndex(customer => customer.customer_id === customer_id);

    if (customerIndex !== -1) {
      customers[customerIndex] = { ...customers[customerIndex], ...updatedCustomer };
      this.persistence.update(customers, this.tableName);
    } else {
      throw new Error("Customer not found");
    }
  }

  deleteCustomer(customer_id: number): void {
    const customers = this.getAllCustomers();
    const customer = customers.find(customer => customer.customer_id === customer_id);

    if (customer) {
      this.persistence.delete<Customer>(customer, this.tableName);
    } else {
      throw new Error("Customer not found");
    }
  }
}
