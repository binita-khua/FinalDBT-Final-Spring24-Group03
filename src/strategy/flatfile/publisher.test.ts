import PublisherTable from "./PublisherService";
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

describe("PublisherTable", () => {
  beforeEach(() => {
    removeDirectory(getPath("flatfileDb"));
    new FlatfilePersistence(); // Ensure the directory is recreated for each test
  });

  afterEach(() => {
    removeDirectory(getPath("flatfileDb")); // Clean up after each test
  });

  it("should create a publisher and store it", () => {
    const publisherTable = new PublisherTable();
    const publisher = publisherTable.createPublisher("Publisher Name", "Publisher Address", "123-456-7890");

    expect(publisher).toEqual({
      publisher_id: 1,
      publisher_name: "Publisher Name",
      publisher_address: "Publisher Address",
      publisher_phone: "123-456-7890"
    });

    const storedPublishers = publisherTable.getAllPublishers();
    expect(storedPublishers).toEqual([publisher]);
  });

  it("should update an existing publisher", () => {
    const publisherTable = new PublisherTable();
    const publisher = publisherTable.createPublisher("Publisher Name", "Publisher Address", "123-456-7890");

    const updatedPublisher = {
      publisher_name: "Updated Name",
      publisher_address: "Updated Address",
      publisher_phone: "987-654-3210"
    };

    publisherTable.updatePublisher(publisher.publisher_id, updatedPublisher);

    const storedPublishers = publisherTable.getAllPublishers();
    expect(storedPublishers).toEqual([
      {
        publisher_id: 1,
        publisher_name: "Updated Name",
        publisher_address: "Updated Address",
        publisher_phone: "987-654-3210"
      }
    ]);
  });

  it("should delete an existing publisher", () => {
    const publisherTable = new PublisherTable();
    const publisher = publisherTable.createPublisher("Publisher Name", "Publisher Address", "123-456-7890");

    publisherTable.deletePublisher(publisher.publisher_id);

    const storedPublishers = publisherTable.getAllPublishers();
    expect(storedPublishers).toEqual([]);
  });

  it("should throw an error if trying to update a non-existent publisher", () => {
    const publisherTable = new PublisherTable();
    expect(() =>
      publisherTable.updatePublisher(999, { publisher_name: "Non-existent" })
    ).toThrow("Publisher not found");
  });

  it("should throw an error if trying to delete a non-existent publisher", () => {
    const publisherTable = new PublisherTable();
    expect(() => publisherTable.deletePublisher(999)).toThrow("Publisher not found");
  });
});
