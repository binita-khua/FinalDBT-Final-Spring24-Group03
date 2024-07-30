import CustomersTable from "./CustomerService";
import FlatfilePersistence from "./flatfile";
import fs from "fs";
import path from "path";

const getPath = (...dir: string[]) => path.join(__dirname, ...dir);

const removeDirectory = (dirPath: string, retries = 5): void => {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (err) {
      const error = err as { code: string };
      if ((error.code === 'EBUSY' || error.code === 'ENOTEMPTY') && retries > 0) {
        setTimeout(() => removeDirectory(dirPath, retries - 1), 100);
      } else {
        throw err;
      }
    }
  }
};

describe("CustomersTable", () => {
  beforeEach(() => {
    removeDirectory(getPath("flatfileDb"));
    new FlatfilePersistence(); // Ensure the directory is recreated for each test
  });

  afterEach(() => {
    removeDirectory(getPath("flatfileDb")); // Clean up after each test
  });

  it("should create a customer and store it", () => {
    const customersTable = new CustomersTable();
    const customer = customersTable.createCustomer("Customer Name", "customer@example.com", 100.50, "123-456-7890", "Customer Address", "2023-01-01");

    expect(customer).toEqual({
      customer_id: 1,
      customer_name: "Customer Name",
      customer_email: "customer@example.com",
      customer_phone: "123-456-7890",
      customer_address: "Customer Address",
      customer_total_spent: 100.50,
      customer_last_purchase_date: "2023-01-01"
    });

    const storedCustomers = customersTable.getAllCustomers();
    expect(storedCustomers).toEqual([customer]);
  });

  it("should update an existing customer", () => {
    const customersTable = new CustomersTable();
    const customer = customersTable.createCustomer("Customer Name", "customer@example.com", 100.50, "123-456-7890", "Customer Address", "2023-01-01");

    const updatedCustomer = {
      customer_name: "Updated Name",
      customer_total_spent: 200.75,
      customer_address: "Updated Address"
    };

    customersTable.updateCustomer(customer.customer_id, updatedCustomer);

    const storedCustomers = customersTable.getAllCustomers();
    expect(storedCustomers).toEqual([
      {
        customer_id: 1,
        customer_name: "Updated Name",
        customer_email: "customer@example.com",
        customer_phone: "123-456-7890",
        customer_address: "Updated Address",
        customer_total_spent: 200.75,
        customer_last_purchase_date: "2023-01-01"
      }
    ]);
  });

  it("should delete an existing customer", () => {
    const customersTable = new CustomersTable();
    const customer = customersTable.createCustomer("Customer Name", "customer@example.com", 100.50, "123-456-7890", "Customer Address", "2023-01-01");

    customersTable.deleteCustomer(customer.customer_id);

    const storedCustomers = customersTable.getAllCustomers();
    expect(storedCustomers).toEqual([]);
  });

  it("should throw an error if trying to update a non-existent customer", () => {
    const customersTable = new CustomersTable();
    expect(() =>
      customersTable.updateCustomer(999, { customer_name: "Non-existent" })
    ).toThrow("Customer not found");
  });

  it("should throw an error if trying to delete a non-existent customer", () => {
    const customersTable = new CustomersTable();
    expect(() => customersTable.deleteCustomer(999)).toThrow("Customer not found");
  });
});
