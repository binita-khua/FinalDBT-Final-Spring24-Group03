import FlatfilePersistence from "./flatfile";

interface Purchase {
  purchase_id: number;
  customer_id: number;
  book_id: number;
  purchase_date: string; // Assuming date as string in ISO format
  purchase_quantity: number;
  purchase_amount: number;
}

export default class PurchasesTable {
  private persistence: FlatfilePersistence;
  private tableName = "purchases";
  private idCounter: number;

  constructor() {
    this.persistence = new FlatfilePersistence();
    this.persistence.create(this.tableName);
    this.idCounter = this.getNextId();
  }

  private getNextId(): number {
    const purchases = this.getAllPurchases();
    if (purchases.length === 0) {
      return 1;
    } else {
      return Math.max(...purchases.map(purchase => purchase.purchase_id)) + 1;
    }
  }

  createPurchase(customer_id: number, book_id: number, purchase_date: string, purchase_quantity: number, purchase_amount: number): Purchase {
    const newPurchase: Purchase = {
      purchase_id: this.idCounter,
      customer_id,
      book_id,
      purchase_date,
      purchase_quantity,
      purchase_amount
    };

    this.persistence.insert<Purchase>(newPurchase, this.tableName);
    this.idCounter += 1;
    return newPurchase;
  }

  getAllPurchases(): Purchase[] {
    try {
      const purchases: Purchase[] = JSON.parse(this.persistence.read(this.tableName));
      return purchases;
    } catch {
      return [];
    }
  }

  updatePurchase(purchase_id: number, updatedPurchase: Partial<Purchase>): void {
    const purchases = this.getAllPurchases();
    const purchaseIndex = purchases.findIndex(purchase => purchase.purchase_id === purchase_id);

    if (purchaseIndex !== -1) {
      purchases[purchaseIndex] = { ...purchases[purchaseIndex], ...updatedPurchase };
      this.persistence.update(purchases, this.tableName);
    } else {
      throw new Error("Purchase not found");
    }
  }

  deletePurchase(purchase_id: number): void {
    const purchases = this.getAllPurchases();
    const purchase = purchases.find(purchase => purchase.purchase_id === purchase_id);

    if (purchase) {
      this.persistence.delete<Purchase>(purchase, this.tableName);
    } else {
      throw new Error("Purchase not found");
    }
  }
}
