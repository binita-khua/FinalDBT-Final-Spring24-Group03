DBT-Final-Spring24-Group3

Duties Assigned to Team Members

Aayushi Mehta: Database Design & Implementation

Database Schema Design:

Design the database schema based on the bookstore requirements.
Include tables for Books, Customers, Authors, Publishers, Reviews, Genres, Sales, etc.
Ensure the schema supports all required features like tracking power writers, loyal customers, well-reviewed books, most popular genres, etc.
Create an Entity-Relationship Diagram (ERD) to visualize the database structure.

TypeORM Setup:

Implement the database schema using TypeORM in TypeScript.
Define entities, relationships, and constraints.
Ensure the database is containerized and works in a Docker environment.

Data Migration:

Implement a migration script that populates each table with at least three rows of data for testing and demonstration purposes.

Binita Khua: CRUD Operations & Testing

CRUD Implementation:
Develop Create, Read, Update, and Delete (CRUD) operations for all the tables.
Ensure that these operations handle all necessary business logic, such as calculating power writers, loyal customers, and well-reviewed books.

Unit Testing:
Write unit tests to cover the CRUD operations.
Use a testing framework (like Jest) to ensure that each CRUD function behaves as expected.

Integration Testing:
Develop integration tests to cover interactions between different tables.
Test complex scenarios such as calculating the most popular genre by sales and fetching the 10 most recent reviews.

Bansi Kalariya:Presentation & Documentation

Presentation Preparation:

Create a 15-minute presentation that covers:
The problem set and requirements.
The database design and how it satisfies the requirements.
The implementation of CRUD operations and testing strategies.
How the project ensures high data persistence and quality for the bookstore client.

Documentation:
Document the entire system, including setup instructions, how to run the project, and how to execute tests.
Write a README file that includes an overview of the project, dependencies, and how to get started.

Responsibility List:
Compile and include the responsibility list in the project submission.
Ensure the documentation and presentation materials are clear, concise, and professional.

Testing:
Command to run all UnitTest: npm run test
Due to an issue with pv semaphore, not all tests may pass when running npm run test.Thus, we have seperate command for all UnitTest


