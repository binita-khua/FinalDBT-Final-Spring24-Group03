import AuthorsTable from "./AuthorService";
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

describe("AuthorsTable", () => {
  beforeEach(() => {
    removeDirectory(getPath("flatfileDb"));
    new FlatfilePersistence(); // Ensure the directory is recreated for each test
  });

  afterEach(() => {
    removeDirectory(getPath("flatfileDb"));
  });

  it("should create an author and store it", () => {
    const authorsTable = new AuthorsTable();
    const author = authorsTable.createAuthor("Author Name", "Author Bio");

    expect(author).toEqual({
      author_id: 1,
      author_name: "Author Name",
      author_bio: "Author Bio"
    });

    const storedAuthors = authorsTable.getAllAuthors();
    expect(storedAuthors).toEqual([author]);
  });

  it("should update an existing author", () => {
    const authorsTable = new AuthorsTable();
    const author = authorsTable.createAuthor("Author Name", "Author Bio");

    const updatedAuthor = {
      author_name: "Updated Name",
      author_bio: "Updated Bio"
    };

    authorsTable.updateAuthor(author.author_id, updatedAuthor);

    const storedAuthors = authorsTable.getAllAuthors();
    expect(storedAuthors).toEqual([
      {
        author_id: 1,
        author_name: "Updated Name",
        author_bio: "Updated Bio"
      }
    ]);
  });

  it("should delete an existing author", () => {
    const authorsTable = new AuthorsTable();
    const author = authorsTable.createAuthor("Author Name", "Author Bio");

    authorsTable.deleteAuthor(author.author_id);

    const storedAuthors = authorsTable.getAllAuthors();
    expect(storedAuthors).toEqual([]);
  });

  it("should throw an error if trying to update a non-existent author", () => {
    const authorsTable = new AuthorsTable();
    expect(() =>
      authorsTable.updateAuthor(999, { author_name: "Non-existent" })
    ).toThrow("Author not found");
  });

  it("should throw an error if trying to delete a non-existent author", () => {
    const authorsTable = new AuthorsTable();
    expect(() => authorsTable.deleteAuthor(999)).toThrow("Author not found");
  });
});
