import express, { Express } from "express";
import cors from "cors";

// Import API classes
import SaleApi from "./strategy/Postgresql/Photo/SaleApi"; // Adjust path as needed
import BookApi from "./strategy/Postgresql/Photo/BookApi"; // Adjust path as needed
import CustomerApi from "./strategy/Postgresql/Photo/CustomerApi"; // Adjust path as needed
import AuthorApi from "./strategy/Postgresql/Photo/AuthorApi"; // Adjust path as needed
import PublisherApi from "./strategy/Postgresql/Photo/PublisherApi"; // Adjust path as needed
import PurchaseApi from "./strategy/Postgresql/Photo/PurchaseApi"; // Adjust path as needed
import ReviewApi from "./strategy/Postgresql/Photo/ReviewApi"; // Adjust path as needed

// Import the AppDataSource from data source file
import { AppDataSource } from "./strategy/Postgresql/configure"; // Ensure the path is correct

// Configure the Express application
const app: Express = express();
app.use(cors());
app.use(express.json());

// Initialize the AppDataSource and start the server
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // Initialize and use APIs
    new SaleApi(AppDataSource, app);
    new BookApi(AppDataSource, app);
    new CustomerApi(AppDataSource, app);
    new AuthorApi(AppDataSource, app);
    new PublisherApi(AppDataSource, app);
    new PurchaseApi(AppDataSource, app);
    new ReviewApi(AppDataSource, app);

    // Start the server
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
