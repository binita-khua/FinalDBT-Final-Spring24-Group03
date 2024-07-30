import FlatfilePersistence from "./flatfile";

interface Author {
  author_id: number;
  author_name: string;
  author_bio: string;
}

export default class AuthorsTable {
  private persistence: FlatfilePersistence;
  private tableName = "authors";
  private idCounter: number;

  constructor() {
    this.persistence = new FlatfilePersistence();
    this.persistence.create(this.tableName);
    this.idCounter = this.getNextId();
  }

  private getNextId(): number {
    const authors = this.getAllAuthors();
    if (authors.length === 0) {
      return 1;
    } else {
      return Math.max(...authors.map(author => author.author_id)) + 1;
    }
  }

  createAuthor(author_name: string, author_bio: string): Author {
    const newAuthor: Author = {
      author_id: this.idCounter,
      author_name,
      author_bio
    };

    this.persistence.insert<Author>(newAuthor, this.tableName);
    this.idCounter += 1;
    return newAuthor;
  }

  getAllAuthors(): Author[] {
    try {
      const authors: Author[] = JSON.parse(this.persistence.read(this.tableName));
      return authors;
    } catch {
      return [];
    }
  }

  updateAuthor(author_id: number, updatedAuthor: Partial<Author>): void {
    const authors = this.getAllAuthors();
    const authorIndex = authors.findIndex(author => author.author_id === author_id);

    if (authorIndex !== -1) {
      authors[authorIndex] = { ...authors[authorIndex], ...updatedAuthor };
      this.persistence.update(authors, this.tableName);
    } else {
      throw new Error("Author not found");
    }
  }

  deleteAuthor(author_id: number): void {
    const authors = this.getAllAuthors();
    const author = authors.find(author => author.author_id === author_id);

    if (author) {
      this.persistence.delete<Author>(author, this.tableName);
    } else {
      throw new Error("Author not found");
    }
  }
}
