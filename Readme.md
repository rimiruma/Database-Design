https://drive.google.com/file/d/1aEcDMdkM3ynlxee73Zj6-xPtonE4hLvW/view?usp=sharing




# 🗄️ Prisma ORM — Complete Notes

> A comprehensive guide to Prisma ORM for Backend Development

---

## 📌 Table of Contents

1. [What is Prisma ORM?](#1-what-is-prisma-orm)
2. [findUnique() vs findFirst()](#2-findunique-vs-findfirst)
3. [Prisma Migration](#3-prisma-migration)
4. [select vs include](#4-select-vs-include)
5. [schema.prisma File](#5-schemaprisma-file)

---

## 1. What is Prisma ORM?

### 🔍 Definition

**Prisma** is a modern, open-source **ORM (Object-Relational Mapper)** built for Node.js and TypeScript. It makes working with databases easier, type-safe, and more productive.

> **What is an ORM?** — An ORM is a tool that lets you interact with a database using JavaScript/TypeScript objects instead of writing raw SQL queries.

### ✅ Why is Prisma used in Backend Development?

| Reason | Description |
|--------|-------------|
| **Type Safety** | Get auto-complete and type-checking with TypeScript |
| **Auto-generated Client** | Database client is automatically generated from the schema |
| **Clean Syntax** | Much more readable and simpler than raw SQL |
| **Migration Support** | Easily manage and track database schema changes |
| **Multi-DB Support** | Supports PostgreSQL, MySQL, SQLite, MongoDB, and more |

### 🛠️ 3 Main Parts of Prisma

```
┌─────────────────────────────────────────────────┐
│               PRISMA ECOSYSTEM                  │
├─────────────────┬───────────────────────────────┤
│  Prisma Schema  │  Define your data models       │
│                 │  in schema.prisma              │
├─────────────────┼───────────────────────────────┤
│  Prisma Client  │  Auto-generated, type-safe     │
│                 │  query builder for Node.js      │
├─────────────────┼───────────────────────────────┤
│  Prisma Migrate │  Track and apply database      │
│                 │  schema changes                 │
└─────────────────┴───────────────────────────────┘
```

### 💻 Basic Example

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Fetch all users
const users = await prisma.user.findMany();

// Create a new user
const newUser = await prisma.user.create({
  data: {
    name: "John",
    email: "john@example.com"
  }
});
```

---

## 2. findUnique() vs findFirst()

### 🔍 Difference at a Glance

| Aspect | `findUnique()` | `findFirst()` |
|--------|---------------|---------------|
| **Purpose** | Finds a single record by a unique field | Finds the first record matching any condition |
| **Field Constraint** | Only `@unique` or `@id` fields allowed | Any field can be used |
| **Sorting** | No sorting support | Supports `orderBy` |
| **Performance** | Uses DB index — faster | May do a full table scan |
| **Result** | A unique record or `null` | First matching record or `null` |

---

### 📖 findUnique() — In Detail

`findUnique()` can only query by **unique** or **primary key** fields.

```typescript
// ✅ By id (Primary Key)
const user = await prisma.user.findUnique({
  where: { id: 1 }
});

// ✅ By email (only if @unique is set in schema)
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" }
});

// ❌ This will throw an error — name is not @unique
const user = await prisma.user.findUnique({
  where: { name: "John" } // ERROR!
});
```

**How to define a unique field in schema:**
```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique   // ← can now be used in findUnique
  name  String
}
```

---

### 📖 findFirst() — In Detail

`findFirst()` can query by any field and returns the **first matching** record.

```typescript
// Search by any field
const user = await prisma.user.findFirst({
  where: { name: "John" }
});

// Multiple conditions
const user = await prisma.user.findFirst({
  where: {
    name: "John",
    age: { gte: 18 }
  }
});

// With sorting — get the most recent user
const latestUser = await prisma.user.findFirst({
  orderBy: { createdAt: 'desc' }
});

// With sorting — get the oldest active user
const oldestUser = await prisma.user.findFirst({
  where: { isActive: true },
  orderBy: { age: 'desc' }
});
```

---

### 🎯 When to Use Which?

```
Do you have an ID or unique field?
    ├── Yes → Use findUnique() (faster and safer)
    └── No  → Use findFirst()
                ├── Need sorting? → Add orderBy
                └── Multiple conditions? → Add to where
```

---

## 3. Prisma Migration

### 🔍 What is Migration?

**Migration** is the process of **tracking, versioning, and applying** changes to your database schema. Whenever you modify `schema.prisma` (new table, new column, etc.), you need a migration to apply those changes to the actual database.

### 🔄 What Happens Without Migration?

```
You change schema.prisma ✅
   ↓
Database remains unchanged ❌
   ↓
Running your app causes errors 💥
```

Migration solves this problem.

---

### 🛠️ Why Use `prisma migrate dev`?

```bash
npx prisma migrate dev --name add_user_table
```

This single command does multiple things at once:

```
What prisma migrate dev does:
┌──────────────────────────────────────────────────────┐
│  1. Detects changes in schema.prisma                 │
│  2. Creates a new SQL migration file                 │
│     (inside prisma/migrations/ folder)               │
│  3. Applies that SQL to the database                 │
│  4. Regenerates the Prisma Client                    │
└──────────────────────────────────────────────────────┘
```

---

### 📁 Migration File Structure

```
prisma/
├── schema.prisma
└── migrations/
    ├── 20240101120000_init/
    │   └── migration.sql         ← first migration
    ├── 20240115093000_add_age/
    │   └── migration.sql         ← added age column
    └── 20240120150000_add_post/
        └── migration.sql         ← added Post table
```

Each migration file contains raw SQL:
```sql
-- 20240115093000_add_age/migration.sql
ALTER TABLE "User" ADD COLUMN "age" INTEGER;
```

---

### 📋 Other Migration Commands

| Command | Purpose |
|---------|---------|
| `prisma migrate dev` | Create and apply new migration in development |
| `prisma migrate deploy` | Apply pending migrations in production |
| `prisma migrate reset` | Reset DB and re-run all migrations from scratch |
| `prisma migrate status` | Show which migrations have been applied |
| `prisma db push` | Push schema to DB without creating migration files (for prototyping) |

---

### 💡 Real-world Example

**Step 1:** Add a new field to the schema
```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  age   Int?   // ← newly added
}
```

**Step 2:** Run the migration
```bash
npx prisma migrate dev --name add_age_to_user
```

**Step 3:** Prisma generates and runs this SQL automatically
```sql
ALTER TABLE "User" ADD COLUMN "age" INTEGER;
```

---

## 4. select vs include

### 🔍 The Difference

| Aspect | `select` | `include` |
|--------|----------|-----------|
| **Purpose** | Returns only specified fields | Loads related models (relations) |
| **Use case** | Reduce response size for performance | Fetch data from related tables |
| **Together** | Cannot be used with `include` in the same query | Cannot be used with `select` in the same query |
| **Default behavior** | All fields are returned | Relations are not loaded |

---

### 📖 `select` — With Examples

`select` lets you specify **which fields** you want returned.

```typescript
// ❌ Without select — returns everything (including sensitive data)
const user = await prisma.user.findUnique({
  where: { id: 1 }
});
// Result: { id: 1, name: "John", email: "...", password: "...", createdAt: ..., updatedAt: ... }

// ✅ With select — only get what you need
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    email: true
    // password is excluded — more secure!
  }
});
// Result: { name: "John", email: "john@example.com" }
```

**Nested select:**
```typescript
// Only get post title and author's name
const posts = await prisma.post.findMany({
  select: {
    title: true,
    author: {
      select: {
        name: true   // nested select on relation
      }
    }
  }
});
// Result: [{ title: "Hello World", author: { name: "John" } }]
```

---

### 📖 `include` — With Examples

`include` loads all data from a related model.

```typescript
// Schema:
// User has many Posts
// Post belongs to User

// ✅ Get a user along with all their posts
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true   // loads all posts
  }
});
// Result: { id: 1, name: "John", email: "...", posts: [{...}, {...}] }

// ✅ Nested include — also load comments for each post
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        comments: true   // loads comments for every post
      }
    }
  }
});

// ✅ include with where/orderBy filters
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },     // only published posts
      orderBy: { createdAt: 'desc' }  // newest first
    }
  }
});
```

---

### ⚠️ select and include Cannot Be Used Together

```typescript
// ❌ This will throw an ERROR
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: { name: true },
  include: { posts: true }  // ERROR!
});

// ✅ Instead, include the relation inside select
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    posts: true   // relation inside select
  }
});
```

---

### 🎯 When to Use Which?

```
Need only specific fields?          → Use select
   Example: only need name and email

Need data from a related table?     → Use include
   Example: User with all their Posts

Need both specific fields + related data? → Put relation inside select
```

---

## 5. schema.prisma File

### 🔍 What is schema.prisma?

`schema.prisma` is the **most important configuration file** in a Prisma project. This single file defines everything — the database connection, data models, and code generator settings.

### 📁 File Location

```
project/
├── node_modules/
├── src/
├── prisma/
│   ├── schema.prisma  ← this file
│   └── migrations/
└── package.json
```

---

### 🏗️ 3 Main Sections of schema.prisma

```
schema.prisma
├── 1. generator    → How the Prisma Client should be generated
├── 2. datasource   → Where and how to connect to the database
└── 3. model        → The structure of each database table
```

---

### 📋 Section 1: `generator`

```prisma
generator client {
  provider = "prisma-client-js"
}
```

- Tells Prisma what kind of client to generate
- `prisma-client-js` means a JavaScript/TypeScript client
- Running `npx prisma generate` creates the client based on this config

---

### 📋 Section 2: `datasource`

```prisma
datasource db {
  provider = "postgresql"        // database type: postgresql, mysql, sqlite, mongodb
  url      = env("DATABASE_URL") // connection URL loaded from .env file
}
```

**Connection URL formats for different databases:**
```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite (local file)
DATABASE_URL="file:./dev.db"

# MongoDB
DATABASE_URL="mongodb://user:password@localhost:27017/mydb"
```

---

### 📋 Section 3: `model`

A model is the blueprint for a database table.

```prisma
model User {
  // Field Name  Type     Attributes
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  age       Int?     // ? means optional (nullable)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relation
  posts     Post[]   // one user can have many posts
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())

  // Foreign Key
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

---

### 🏷️ Common Attributes Reference

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `@id` | Marks the primary key | `id Int @id` |
| `@default()` | Sets a default value | `@default(autoincrement())` |
| `@unique` | Adds a unique constraint | `email String @unique` |
| `@updatedAt` | Auto-sets the update timestamp | `updatedAt DateTime @updatedAt` |
| `@relation` | Defines a relationship between tables | `@relation(fields: [...])` |
| `?` | Makes a field optional/nullable | `age Int?` |
| `[]` | Defines a one-to-many relation | `posts Post[]` |

---

### 🗂️ Complete schema.prisma Example

```prisma
// 1. Generator
generator client {
  provider = "prisma-client-js"
}

// 2. Datasource
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 3. Models
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      Role     @default(USER)  // using an Enum
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
  profile   Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}

// Enum — a fixed list of allowed values
enum Role {
  USER
  ADMIN
  MODERATOR
}
```

---

## 🎓 Quick Summary

```
┌────────────────────────────────────────────────────────────────────┐
│                    PRISMA ORM — Summary                            │
├────────────────────────────────────────────────────────────────────┤
│  Prisma ORM    → Type-safe database access for Node.js/TypeScript  │
├────────────────────────────────────────────────────────────────────┤
│  findUnique()  → Find one record by a unique or primary key field  │
│  findFirst()   → Find the first record matching any condition      │
├────────────────────────────────────────────────────────────────────┤
│  Migration     → System to track and apply schema changes          │
│  migrate dev   → Creates migration, applies it, regenerates client │
├────────────────────────────────────────────────────────────────────┤
│  select        → Return only specific fields                       │
│  include       → Load related model (relation) data                │
├────────────────────────────────────────────────────────────────────┤
│  schema.prisma → generator + datasource + model                    │
└────────────────────────────────────────────────────────────────────┘
```

---

*📝 Prisma ORM Backend Development Study Notes*




# 📘 SQL Interview Questions & Answers

This README contains important SQL concepts and interview questions explained in a simple way.

---

## 1. Difference between DELETE, TRUNCATE, DROP

### 🔹 DELETE
- Deletes data row by row
- WHERE condition can be used
- Can be rolled back (if inside a transaction)

### 🔹 TRUNCATE
- Deletes all rows at once
- WHERE condition is not allowed
- Faster than DELETE
- Rollback is not always possible

### 🔹 DROP
- Removes the entire table structure
- Data and schema both are deleted permanently

---

## 2. What is a PRIMARY KEY?

- Uniquely identifies each row in a table
- Duplicate values are not allowed
- NULL values are not allowed

---

## 3. PRIMARY KEY vs UNIQUE KEY

### 🔹 PRIMARY KEY
- Only one per table
- Does not allow NULL values

### 🔹 UNIQUE KEY
- Multiple unique keys allowed in a table
- NULL values may be allowed (depends on DBMS)

---

## 4. What is a FOREIGN KEY?

- A field that references the PRIMARY KEY of another table
- Creates relationship between two tables
- Maintains referential integrity

---

## 5. What is JOIN in SQL?

JOIN is used to combine rows from two or more tables based on a related column.

### 🔹 INNER JOIN
- Returns only matching records from both tables

### 🔹 LEFT JOIN
- Returns all records from the left table
- Matching records from the right table (if exists)

---

## 6. What is Normalization?

Normalization is the process of organizing database tables to reduce redundancy and improve data integrity.

### 🔹 1NF (First Normal Form)
- No duplicate columns
- Each field contains atomic values

### 🔹 2NF (Second Normal Form)
- Follows 1NF
- Removes partial dependency

### 🔹 3NF (Third Normal Form)
- Follows 2NF
- Removes transitive dependency

---

## 7. What is Indexing?

Indexing is a technique used to speed up data retrieval in a database.

### Why do we use indexing?
- Faster search performance
- Improves query efficiency on large tables

---

## 8. WHERE vs HAVING

### 🔹 WHERE
- Filters individual rows
- Used before GROUP BY

### 🔹 HAVING
- Filters grouped data
- Used after GROUP BY

---

## 9. What is a Transaction in SQL?

A transaction is a sequence of SQL operations executed as a single unit.

### 🔹 COMMIT
- Saves changes permanently

### 🔹 ROLLBACK
- Reverts changes back to previous state




**Open ER Diagram**:
   Open [https://dbdiagram.io/d/6a055ee27a923b9472ada143] in your browser to see the live result.

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
- **Non-Clustered Index**: This creates a separate list that points to the original data (like the index at the back of a textbook). You can have many non-clustered indexes on a table to speed up searches.

### 10. Explain Database Sharding and Partitioning. When would you use each?
- **Partitioning**: Splitting a massive table into smaller, more manageable pieces **within the same database server** (e.g., dividing sales data by year). Use this to speed up queries on giant tables on a single server.
- **Sharding**: Splitting a huge database across **multiple different servers** (e.g., US users on Server A, EU users on Server B). Use this when your database gets so massive that one single physical server can no longer handle the traffic or storage.