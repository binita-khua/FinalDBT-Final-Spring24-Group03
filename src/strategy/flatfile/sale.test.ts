import SalesTable from "./SaleService";
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

describe("SalesTable", () => {
  beforeEach(() => {
    removeDirectory(getPath("flatfileDb"));
    new FlatfilePersistence(); // Ensure the directory is recreated for each test
  });

  afterEach(() => {
    removeDirectory(getPath("flatfileDb"));
  });

  it("should create a sale and store it", () => {
    const salesTable = new SalesTable();
    const sale = salesTable.createSale(1, 10, "2023-01-01");

    expect(sale).toEqual({
      sale_id: 1,
      book_id: 1,
      sale_quantity: 10,
      sale_date: "2023-01-01"
    });

    const storedSales = salesTable.getAllSales();
    expect(storedSales).toEqual([sale]);
  });

  it("should update an existing sale", () => {
    const salesTable = new SalesTable();
    const sale = salesTable.createSale(1, 10, "2023-01-01");

    const updatedSale = {
      sale_quantity: 15
    };

    salesTable.updateSale(sale.sale_id, updatedSale);

    const storedSales = salesTable.getAllSales();
    expect(storedSales).toEqual([
      {
        sale_id: 1,
        book_id: 1,
        sale_quantity: 15,
        sale_date: "2023-01-01"
      }
    ]);
  });

  it("should delete an existing sale", () => {
    const salesTable = new SalesTable();
    const sale = salesTable.createSale(1, 10, "2023-01-01");

    salesTable.deleteSale(sale.sale_id);

    const storedSales = salesTable.getAllSales();
    expect(storedSales).toEqual([]);
  });

  it("should throw an error if trying to update a non-existent sale", () => {
    const salesTable = new SalesTable();
    expect(() =>
      salesTable.updateSale(999, { sale_quantity: 15 })
    ).toThrow("Sale not found");
  });

  it("should throw an error if trying to delete a non-existent sale", () => {
    const salesTable = new SalesTable();
    expect(() => salesTable.deleteSale(999)).toThrow("Sale not found");
  });
});
