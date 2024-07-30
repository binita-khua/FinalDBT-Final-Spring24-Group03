import BooksTable from "./BookService";
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

describe("BooksTable", () => {
  beforeEach(() => {
    removeDirectory(getPath("flatfileDb"));
    new FlatfilePersistence(); // Ensure the directory is recreated for each test
  });

  afterEach(() => {
    removeDirectory(getPath("flatfileDb"));
  });

  it("should create a book and store it", () => {
    const booksTable = new BooksTable();
    const book = booksTable.createBook("Book Title", 1, 1, "physical", 19.99, "2023-01-01", "Genre");

    expect(book).toEqual({
      book_id: 1,
      book_title: "Book Title",
      author_id: 1,
      publisher_id: 1,
      book_genre: "Genre",
      book_format: "physical",
      book_price: 19.99,
      book_publish_date: "2023-01-01"
    });

    const storedBooks = booksTable.getAllBooks();
    expect(storedBooks).toEqual([book]);
  });

  it("should update an existing book", () => {
    const booksTable = new BooksTable();
    const book = booksTable.createBook("Book Title", 1, 1, "physical", 19.99, "2023-01-01", "Genre");

    const updatedBook = {
      book_title: "Updated Title",
      book_price: 29.99,
      book_genre: "Updated Genre"
    };

    booksTable.updateBook(book.book_id, updatedBook);

    const storedBooks = booksTable.getAllBooks();
    expect(storedBooks).toEqual([
      {
        book_id: 1,
        book_title: "Updated Title",
        author_id: 1,
        publisher_id: 1,
        book_genre: "Updated Genre",
        book_format: "physical",
        book_price: 29.99,
        book_publish_date: "2023-01-01"
      }
    ]);
  });

  it("should delete an existing book", () => {
    const booksTable = new BooksTable();
    const book = booksTable.createBook("Book Title", 1, 1, "physical", 19.99, "2023-01-01", "Genre");

    booksTable.deleteBook(book.book_id);

    const storedBooks = booksTable.getAllBooks();
    expect(storedBooks).toEqual([]);
  });

  it("should throw an error if trying to update a non-existent book", () => {
    const booksTable = new BooksTable();
    expect(() =>
      booksTable.updateBook(999, { book_title: "Non-existent" })
    ).toThrow("Book not found");
  });

  it("should throw an error if trying to delete a non-existent book", () => {
    const booksTable = new BooksTable();
    expect(() => booksTable.deleteBook(999)).toThrow("Book not found");
  });
});
