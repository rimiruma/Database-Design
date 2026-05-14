#ER Diagram
 https://dbdiagram.io/d/6a055ee27a923b9472ada143

 **Open the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the live result.

---

## 📚 Database Concepts (Q&A)

### 1. What is the difference between Primary Key and Foreign Key?
- **Primary Key**: Think of it as a student ID number. It uniquely identifies a specific row in a table. There can only be one Primary Key per table, and it cannot be empty (null).
- **Foreign Key**: Think of it as a reference to another table's Primary Key. It connects two tables together. For example, an `Order` table might have a `user_id` Foreign Key that points back to the `User` table so we know who made the order.

### 2. Why is normalization important?
Normalization is like organizing your closet. It helps eliminate duplicate data and organizes data logically so that when you need to update something, you only have to do it in one place. It saves storage space and prevents data from becoming inconsistent.

### 3. What is a JOIN?
A JOIN is a way to combine data from two or more tables based on a related column between them. If you have a table for `Users` and a table for `Orders`, a JOIN lets you look at the user's name right next to their order details in one single view.

### 4. Difference between SQL and MongoDB?
- **SQL (Relational)**: Like a well-organized spreadsheet with strict rows and columns. It's great when data structure is fixed and consistency is highly critical (e.g., banking systems).
- **MongoDB (NoSQL)**: Like a collection of flexible JSON documents. It doesn't force a strict structure, making it great for rapidly changing data or unstructured data (e.g., social media feeds).

### 5. What is a composite key?
A composite key is just a Primary Key that is made up of **two or more columns** instead of just one. Sometimes a single column isn't enough to make a row totally unique, so you combine multiple columns (like `class_id` + `student_roll_number`) to create a unique identifier.

### 6. What is a weak entity?
A weak entity is a piece of data that cannot exist on its own; it totally depends on another "parent" entity. For example, a `Room` in a hotel is a weak entity—if the `Hotel` is destroyed or deleted from the database, the `Room` ceases to exist too.

### 7. Why do we use constraints?
Constraints are the "rules" of the database. We use them to ensure the data entered is valid and accurate. For example, a constraint can ensure a user's age cannot be less than 0, or that an email address must be unique so two people can't register with the same email.

### 8. Explain many-to-many relationship.
This happens when multiple records in one table relate to multiple records in another table. For example, Students and Classes. One student can take many classes, and one class can have many students. To fix this in SQL, we usually create a third "bridge" table (like `Enrollment`) to connect them.

### 9. What is the difference between Clustered and Non-Clustered Index?
- **Clustered Index**: This changes the physical order of the table to match the index (like a phone book sorted alphabetically). You can only have one clustered index per table.