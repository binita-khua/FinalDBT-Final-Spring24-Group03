import FlatfilePersistence from "./flatfile";

interface Book {
  book_id: number;
  book_title: string;
  author_id: number;
  publisher_id: number;
  book_genre?: string;
  book_format: 'physical' | 'ebook' | 'audiobook';
  book_price: number;
  book_publish_date: string; // Assuming date as string in ISO format
}

export default class BooksTable {
  private persistence: FlatfilePersistence;
  private tableName = "books";
  private idCounter: number;

  constructor() {
    this.persistence = new FlatfilePersistence();
    this.persistence.create(this.tableName);
    this.idCounter = this.getNextId();
  }

  private getNextId(): number {
    const books = this.getAllBooks();
    if (books.length === 0) {
      return 1;
    } else {
      return Math.max(...books.map(book => book.book_id)) + 1;
    }
  }

  createBook(book_title: string, author_id: number, publisher_id: number, book_format: 'physical' | 'ebook' | 'audiobook', book_price: number, book_publish_date: string, book_genre?: string): Book {
    const newBook: Book = {
      book_id: this.idCounter,
      book_title,
      author_id,
      publisher_id,
      book_genre,
      book_format,
      book_price,
      book_publish_date
    };

    this.persistence.insert<Book>(newBook, this.tableName);
    this.idCounter += 1;
    return newBook;
  }

  getAllBooks(): Book[] {
    try {
      const books: Book[] = JSON.parse(this.persistence.read(this.tableName));
      return books;
    } catch {
      return [];
    }
  }

  updateBook(book_id: number, updatedBook: Partial<Book>): void {
    const books = this.getAllBooks();
    const bookIndex = books.findIndex(book => book.book_id === book_id);

    if (bookIndex !== -1) {
      books[bookIndex] = { ...books[bookIndex], ...updatedBook };
      this.persistence.update(books, this.tableName);
    } else {
      throw new Error("Book not found");
    }
  }

  deleteBook(book_id: number): void {
    const books = this.getAllBooks();
    const book = books.find(book => book.book_id === book_id);

    if (book) {
      this.persistence.delete<Book>(book, this.tableName);
    } else {
      throw new Error("Book not found");
    }
  }
}
