import FlatfilePersistence from "./flatfile";

interface Publisher {
  publisher_id: number;
  publisher_name: string;
  publisher_address?: string;
  publisher_phone?: string;
}

export default class PublisherTable {
  private persistence: FlatfilePersistence;
  private tableName = "publishers";
  private idCounter: number;

  constructor() {
    this.persistence = new FlatfilePersistence();
    this.persistence.create(this.tableName);
    this.idCounter = this.getNextId();
  }

  private getNextId(): number {
    const publishers = this.getAllPublishers();
    if (publishers.length === 0) {
      return 1;
    } else {
      return Math.max(...publishers.map(publisher => publisher.publisher_id)) + 1;
    }
  }

  createPublisher(publisher_name: string, publisher_address?: string, publisher_phone?: string): Publisher {
    const newPublisher: Publisher = {
      publisher_id: this.idCounter,
      publisher_name,
      publisher_address,
      publisher_phone
    };

    this.persistence.insert<Publisher>(newPublisher, this.tableName);
    this.idCounter += 1;
    return newPublisher;
  }

  getAllPublishers(): Publisher[] {
    try {
      const publishers: Publisher[] = JSON.parse(this.persistence.read(this.tableName));
      return publishers;
    } catch {
      return [];
    }
  }

  updatePublisher(publisher_id: number, updatedPublisher: Partial<Publisher>): void {
    const publishers = this.getAllPublishers();
    const publisherIndex = publishers.findIndex(publisher => publisher.publisher_id === publisher_id);

    if (publisherIndex !== -1) {
      publishers[publisherIndex] = { ...publishers[publisherIndex], ...updatedPublisher };
      this.persistence.update(publishers, this.tableName);
    } else {
      throw new Error("Publisher not found");
    }
  }

  deletePublisher(publisher_id: number): void {
    const publishers = this.getAllPublishers();
    const publisher = publishers.find(publisher => publisher.publisher_id === publisher_id);

    if (publisher) {
      this.persistence.delete<Publisher>(publisher, this.tableName);
    } else {
      throw new Error("Publisher not found");
    }
  }
}
