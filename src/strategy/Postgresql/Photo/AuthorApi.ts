import { Express } from "express";
import { DataSource } from "typeorm";
import { Author } from "./Author";

export default class AuthorApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    // Create a new author
    this.#express.post("/authors", async (req, res) => {
      const { body } = req;

      const author = new Author();
      author.author_name = body.author_name;
      author.author_bio = body.author_bio;

      try {
        await this.#dataSource.manager.save(author);
        console.log(`Author created with id: ${author.author_id}`);
        res.status(201).json(author);
      } catch (err) {
        res.status(503).json({ error: "Author creation failed in db." });
      }
    });

    // Get an author by id
    this.#express.get("/authors/:id", async (req, res) => {
      try {
        const author = await this.#dataSource.manager.findOne(Author, {
          where: { author_id: parseInt(req.params.id, 10) },
        });

        if (!author) {
          return res.status(404).json({ error: "Author not found." });
        }

        res.json(author);
      } catch (err) {
        res.status(503).json({ error: "Failed to retrieve author." });
      }
    });

    // Get all authors
    this.#express.get("/authors", async (req, res) => {
      try {
        const authors = await this.#dataSource.manager.find(Author);
        res.json(authors);
      } catch (err) {
        res.status(503).json({ error: "Failed to retrieve authors." });
      }
    });

    // Update an author by id
    this.#express.put("/authors/:id", async (req, res) => {
      try {
        const author = await this.#dataSource.manager.findOne(Author, {
          where: { author_id: parseInt(req.params.id, 10) },
        });

        if (!author) {
          return res.status(404).json({ error: "Author not found." });
        }

        const { body } = req;
        author.author_name = body.author_name || author.author_name;
        author.author_bio = body.author_bio || author.author_bio;

        await this.#dataSource.manager.save(author);
        res.json(author);
      } catch (err) {
        res.status(503).json({ error: "Author update failed in db." });
      }
    });

    // Delete an author by id
    this.#express.delete("/authors/:id", async (req, res) => {
      try {
        const author = await this.#dataSource.manager.findOne(Author, {
          where: { author_id: parseInt(req.params.id, 10) },
        });

        if (!author) {
          return res.status(404).json({ error: "Author not found." });
        }

        await this.#dataSource.manager.remove(author);
        res.status(204).end();
      } catch (err) {
        res.status(503).json({ error: "Author deletion failed in db." });
      }
    });
  }
}
