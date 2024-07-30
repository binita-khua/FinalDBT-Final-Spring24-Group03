import PurchasesTable from "./PurchaseService";
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

describe("PurchasesTable", () => {
  beforeEach(() => {
    removeDirectory(getPath("flatfileDb"));
    new FlatfilePersistence(); // Ensure the directory is recreated for each test
  });

  afterEach(() => {
    removeDirectory(getPath("flatfileDb"));
  });

  it("should create a purchase and store it", () => {
    const purchasesTable = new PurchasesTable();
    const purchase = purchasesTable.createPurchase(1, 1, "2023-01-01", 2, 39.98);

    expect(purchase).toEqual({
      purchase_id: 1,
      customer_id: 1,
      book_id: 1,
      purchase_date: "2023-01-01",
      purchase_quantity: 2,
      purchase_amount: 39.98
    });

    const storedPurchases = purchasesTable.getAllPurchases();
    expect(storedPurchases).toEqual([purchase]);
  });

  it("should update an existing purchase", () => {
    const purchasesTable = new PurchasesTable();
    const purchase = purchasesTable.createPurchase(1, 1, "2023-01-01", 2, 39.98);

    const updatedPurchase = {
      purchase_quantity: 3,
      purchase_amount: 59.97
    };

    purchasesTable.updatePurchase(purchase.purchase_id, updatedPurchase);

    const storedPurchases = purchasesTable.getAllPurchases();
    expect(storedPurchases).toEqual([
      {
        purchase_id: 1,
        customer_id: 1,
        book_id: 1,
        purchase_date: "2023-01-01",
        purchase_quantity: 3,
        purchase_amount: 59.97
      }
    ]);
  });

  it("should delete an existing purchase", () => {
    const purchasesTable = new PurchasesTable();
    const purchase = purchasesTable.createPurchase(1, 1, "2023-01-01", 2, 39.98);

    purchasesTable.deletePurchase(purchase.purchase_id);

    const storedPurchases = purchasesTable.getAllPurchases();
    expect(storedPurchases).toEqual([]);
  });

  it("should throw an error if trying to update a non-existent purchase", () => {
    const purchasesTable = new PurchasesTable();
    expect(() =>
      purchasesTable.updatePurchase(999, { purchase_quantity: 3 })
    ).toThrow("Purchase not found");
  });

  it("should throw an error if trying to delete a non-existent purchase", () => {
    const purchasesTable = new PurchasesTable();
    expect(() => purchasesTable.deletePurchase(999)).toThrow("Purchase not found");
  });
});
