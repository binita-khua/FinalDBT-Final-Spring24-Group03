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

describe("flatfile", () => {
  beforeEach(() => {
    removeDirectory(getPath("flatfileDb"));
    new FlatfilePersistence(); // Ensure the directory is recreated for each test
  });

  afterEach(() => {
    removeDirectory(getPath("flatfileDb"));
  });

  describe("constructor", () => {
    it("will create a 'flatfileDb' directory in the current folder if one is not present", () => {
      if (fs.existsSync(getPath("flatfileDb"))) {
        removeDirectory(getPath("flatfileDb"));
      }
      expect(fs.existsSync(getPath("flatfileDb"))).toBeFalsy();
      new FlatfilePersistence();
      expect(fs.existsSync(getPath("flatfileDb"))).toBeTruthy();
    });
  });

  describe("create method", () => {
    it("will create a new file if one does not exist", () => {
      const flatfilePersistence = new FlatfilePersistence();
      expect(fs.existsSync(getPath("flatfileDb", "fooExample.json"))).toBeFalsy();

      flatfilePersistence.create("fooExample");

      expect(fs.existsSync(getPath("flatfileDb", "fooExample.json"))).toBeTruthy();
    });

    it("will not create a new file if one exists already", () => {
      const flatfilePersistence = new FlatfilePersistence();
      flatfilePersistence.create("fooExample");
      expect(fs.existsSync(getPath("flatfileDb", "fooExample.json"))).toBeTruthy();

      flatfilePersistence.create("fooExample");

      expect(fs.readFileSync(getPath("flatfileDb", "fooExample.json"), "utf-8")).toBe("[]");
    });
  });

  describe("insert method", () => {
    it("will insert object into the designated file", () => {
      const flatfilePersistence = new FlatfilePersistence();
      flatfilePersistence.create("fooExample");
      expect(fs.existsSync(getPath("flatfileDb", "fooExample.json"))).toBeTruthy();

      const fooData = {
        stringVariable: "stringVariable",
        numberVariable: 12345,
        booleanVariable: true,
      };

      flatfilePersistence.insert(fooData, "fooExample");

      expect(
        JSON.parse(
          fs.readFileSync(getPath("flatfileDb", "fooExample.json")).toString("utf-8")
        )
      ).toStrictEqual([fooData]);
    });

    it("will throw an error if location is not found", () => {
      const flatfilePersistence = new FlatfilePersistence();

      const fooData = {
        stringVariable: "stringVariable",
        numberVariable: 12345,
        booleanVariable: true,
      };

      expect(() => flatfilePersistence.insert(fooData, "nonExistent"))
        .toThrow("The path indicated does not exist.");
    });
  });

  describe("drop method", () => {
    it("will remove the designated file if exists", () => {
      const flatfilePersistence = new FlatfilePersistence();
      flatfilePersistence.create("fooExample");
      expect(fs.existsSync(getPath("flatfileDb", "fooExample.json"))).toBeTruthy();

      flatfilePersistence.drop("fooExample");

      expect(fs.existsSync(getPath("flatfileDb", "fooExample.json"))).toBeFalsy();
    });

    it("will not impact the file structure if designated file does not exist", () => {
      const flatfilePersistence = new FlatfilePersistence();
      expect(fs.existsSync(getPath("flatfileDb", "fooExample.json"))).toBeFalsy();

      flatfilePersistence.drop("fooExample");

      expect(fs.existsSync(getPath("flatfileDb", "fooExample.json"))).toBeFalsy();
    });
  });

  describe("update method", () => {
    it("will update an existing entry", () => {
      const flatfilePersistence = new FlatfilePersistence();
      flatfilePersistence.create("fooExample");

      const fooData = {
        stringVariable: "stringVariable",
        numberVariable: 12345,
        booleanVariable: true,
      };

      flatfilePersistence.insert(fooData, "fooExample");

      const updatedData = {
        stringVariable: "updatedString",
        numberVariable: 54321,
        booleanVariable: false,
      };

      flatfilePersistence.update([updatedData], "fooExample");

      expect(
        JSON.parse(
          fs.readFileSync(getPath("flatfileDb", "fooExample.json")).toString("utf-8")
        )
      ).toStrictEqual([updatedData]);
    });

    it("will not update if entry does not exist", () => {
      const flatfilePersistence = new FlatfilePersistence();

      const fooData = {
        stringVariable: "stringVariable",
        numberVariable: 12345,
        booleanVariable: true,
      };

      expect(() => flatfilePersistence.update([fooData], "nonExistent"))
        .toThrow("The path indicated does not exist.");
    });
  });

  describe("delete method", () => {
    it("will delete an existing entry", () => {
      const flatfilePersistence = new FlatfilePersistence();
      flatfilePersistence.create("fooExample");

      const fooData = {
        stringVariable: "stringVariable",
        numberVariable: 12345,
        booleanVariable: true,
      };

      flatfilePersistence.insert(fooData, "fooExample");

      flatfilePersistence.delete(fooData, "fooExample");

      expect(
        JSON.parse(
          fs.readFileSync(getPath("flatfileDb", "fooExample.json")).toString("utf-8")
        )
      ).toStrictEqual([]);
    });

    it("will not delete if entry does not exist", () => {
      const flatfilePersistence = new FlatfilePersistence();

      const fooData = {
        stringVariable: "stringVariable",
        numberVariable: 12345,
        booleanVariable: true,
      };

      expect(() => flatfilePersistence.delete(fooData, "nonExistent"))
        .toThrow("The path indicated does not exist.");
    });
  });
});
