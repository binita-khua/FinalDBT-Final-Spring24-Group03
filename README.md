# **DBT-Final-Spring24-Group3**

## **Project Overview**
This project is an online bookstore system that manages physical books, e-books, and audiobooks. The system allows customers to browse the catalog, make purchases, and leave reviews. It also supports features for authors and publishers. The database is designed to track power writers, loyal customers, well-reviewed books, and the most popular genres.

## **Table of Contents**
- [Project Overview](#project-overview)
- [Duties Assigned to Team Members](#duties-assigned-to-team-members)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [CRUD Operations](#crud-operations)
- [Testing](#testing)
- [Presentation](#presentation)
- [Entity-Relationship Diagram](#entity-relationship-diagram)

## **Duties Assigned to Team Members**

### **Aayushi Mehta: Database Design & Implementation**
1. **Database Schema Design:**
   - Design the database schema based on the bookstore requirements.
   - Include tables for `Books`, `Customers`, `Authors`, `Publishers`, `Reviews`, `Genres`, `Sales`, etc.
   - Ensure the schema supports all required features like tracking power writers, loyal customers, well-reviewed books, most popular genres, etc.
   - Create an Entity-Relationship Diagram (ERD) to visualize the database structure.
  
2. **TypeORM Setup:**
   - Implement the database schema using TypeORM in TypeScript.
   - Define entities, relationships, and constraints.
   - Ensure the database is containerized and works in a Docker environment.



### **Binita Khua: CRUD Operations & Unit Testing**
1. **CRUD Implementation:**
   - Develop Create, Read, Update, and Delete (CRUD) operations for all tables.
   - Ensure these operations handle all necessary business logic, such as calculating power writers, loyal customers, and well-reviewed books.

2. **Unit Testing:**
   - Write unit tests to cover the CRUD operations.
   - Use a testing framework (like Jest) to ensure that each CRUD function behaves as expected.

### **Bansi Kalariya: Integration Testing, Presentation & Documentation**
1. **Integration Testing:**
   - Develop integration tests to cover interactions between different tables.
   - Test complex scenarios such as calculating the most popular genre by sales and fetching the 10 most recent reviews.

2. **Presentation Preparation:**
   - Create a 15-minute presentation that covers:
     - The problem set and requirements.
     - The database design and how it satisfies the requirements.
     - The implementation of CRUD operations and testing strategies.
     - How does the project ensure high data persistence and quality for the bookstore client?

3. **Documentation:**
   - Document the entire system, including setup instructions, how to run the project, and how to execute tests.
   - Write a README file that includes an overview of the project, dependencies, and how to get started.

## **Technologies Used**
- **TypeScript**: Main programming language.
- **TypeORM**: ORM used for managing database interactions.
- **PostgreSQL/MySQL**: Relational database used.
- **Docker**: Used for containerizing the application.
- **Jest**: A testing framework for unit and integration tests.

## **Setup Instructions**
### **Prerequisites**
- **Node.js** (version 14.x or higher)
- **Docker** and **Docker Compose**
- **Git**

### **Installation**
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/DBT-Final-Spring24-Group3.git
   cd DBT-Final-Spring24-Group3
   
 Install Dependencies: npm install
 
Set Up Environment Variables:
Copy the .env.example file to .env and fill in the required environment variables.

Run Migrations:npm run typeorm migration:run

Start the Application:docker-compose up

Database Schema
The database contains tables like Books, Authors, Customers, Publishers, Reviews, Genres, and Sales. Refer to the Entity-Relationship Diagram for a visual representation.

CRUD Operations
CRUD operations are implemented for all tables, allowing users to create, read, update, and delete entries efficiently. These operations also handle business logic like tracking power writers and loyal customers.

Testing
Unit Tests: npm run test
Due to an issue with the pv semaphore, not all tests may pass with npm run test. Use the specific commands below to run tests for individual modules:
test:flatfile
test:author
test:book
test:customer
test:publisher
test:review
test:purchase
test:sale

Integration Tests: npm start

Entity-Relationship Diagram
Refer to the attached Entity-Relationship Diagram (ERD) to understand the relationships between different entities within the database.
