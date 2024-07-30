import FlatfilePersistence from "./flatfile";

interface Sale {
  sale_id: number;
  book_id: number;
  sale_quantity: number;
  sale_date: string;
}

export default class SalesTable {
  private persistence: FlatfilePersistence;
  private tableName = "sales";
  private idCounter: number;

  constructor() {
    this.persistence = new FlatfilePersistence();
    this.persistence.create(this.tableName);
    this.idCounter = this.getNextId();
  }

  private getNextId(): number {
    const sales = this.getAllSales();
    if (sales.length === 0) {
      return 1;
    } else {
      return Math.max(...sales.map(sale => sale.sale_id)) + 1;
    }
  }

  createSale(book_id: number, sale_quantity: number, sale_date: string): Sale {
    const newSale: Sale = {
      sale_id: this.idCounter,
      book_id,
      sale_quantity,
      sale_date
    };

    this.persistence.insert<Sale>(newSale, this.tableName);
    this.idCounter += 1;
    return newSale;
  }

  getAllSales(): Sale[] {
    try {
      const sales: Sale[] = JSON.parse(this.persistence.read(this.tableName));
      return sales;
    } catch {
      return [];
    }
  }

  updateSale(sale_id: number, updatedSale: Partial<Sale>): void {
    const sales = this.getAllSales();
    const saleIndex = sales.findIndex(sale => sale.sale_id === sale_id);

    if (saleIndex !== -1) {
      sales[saleIndex] = { ...sales[saleIndex], ...updatedSale };
      this.persistence.update(sales, this.tableName);
    } else {
      throw new Error("Sale not found");
    }
  }

  deleteSale(sale_id: number): void {
    const sales = this.getAllSales();
    const sale = sales.find(sale => sale.sale_id === sale_id);

    if (sale) {
      this.persistence.delete<Sale>(sale, this.tableName);
    } else {
      throw new Error("Sale not found");
    }
  }
}
