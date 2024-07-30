import PersistenceService from "../../persistenceService";
import fs from "fs";
import path from "path";

export default class FlatfilePersistence implements PersistenceService {
  #defaultDb = 'flatfileDb';

  constructor() {
    const dbPath = this.getPath(this.#defaultDb);
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }
  }

  create(name: string) {
    const filePath = this.getPath(this.#defaultDb, `${name}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    }
  }

  insert<T = unknown>(content: T, target: string) {
    const insertPath = this.getPath(this.#defaultDb, `${target}.json`);

    if (!fs.existsSync(insertPath)) {
      throw new Error("The path indicated does not exist.");
    }

    const currentContent = fs.readFileSync(insertPath, "utf-8");
    let parsedContent: T[] = [];

    try {
      parsedContent = JSON.parse(currentContent);
      if (!Array.isArray(parsedContent)) {
        parsedContent = [];
      }
    } catch {
      parsedContent = [];
    }

    parsedContent.push(content);
    fs.writeFileSync(insertPath, JSON.stringify(parsedContent, null, 2));
  }

  read(location: string): string {
    const filePath = this.getPath(this.#defaultDb, `${location}.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error("The path indicated does not exist.");
    }

    return fs.readFileSync(filePath, "utf-8");
  }

  drop(name: string) {
    const filePath = this.getPath(this.#defaultDb, `${name}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  update<T = unknown>(content: T, target: string) {
    const updatePath = this.getPath(this.#defaultDb, `${target}.json`);

    if (!fs.existsSync(updatePath)) {
      throw new Error("The path indicated does not exist.");
    }

    fs.writeFileSync(updatePath, JSON.stringify(content, null, 2));
  }

  delete<T = unknown>(content: T, target: string) {
    const deletePath = this.getPath(this.#defaultDb, `${target}.json`);

    if (!fs.existsSync(deletePath)) {
      throw new Error("The path indicated does not exist.");
    }

    const currentContent = fs.readFileSync(deletePath, "utf-8");
    let parsedContent: T[] = [];

    try {
      parsedContent = JSON.parse(currentContent);
      if (!Array.isArray(parsedContent)) {
        parsedContent = [];
      }
    } catch {
      parsedContent = [];
    }

    const updatedContent = parsedContent.filter(
      (item: T) => JSON.stringify(item) !== JSON.stringify(content)
    );

    fs.writeFileSync(deletePath, JSON.stringify(updatedContent, null, 2));
  }

  private getPath(...dir: string[]) {
    return path.join(__dirname, ...dir);
  }
}
