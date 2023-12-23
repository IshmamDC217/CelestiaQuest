# Supplier Tester Server Setup

## Overview

This README provides instructions on setting up the Supplier Tester, including database configuration, environmental variables, and user management.

## Prerequisites

- Node.js (Version 16 or higher)
- MySQL Server

## Installation

1. Clone the repository.
2. Run `npm install` to install all dependencies.

## Configuration

### Environment Variables

Create an `.env` file in the root of your project with the following as content:

```env
DB_HOST=localhost
DB_USER=HLRMatrix
DB_PASS=hlrtpse164
DB_NAME=loginDB
SESSION_SECRET=hagendas48yum
```

### Database Setup

1. Create a MySQL database named `loginDB`.
2. Create the following tables:

#### Users Table

```sql
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

#### Sessions Table

```sql
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Running the Server

Execute `node server.js` to start the server. It will be accessible on `http://localhost:3000`.

## User Management

### Adding a New User

To add a new user, you need to hash their password and insert the credentials into the database. You can do this by using the following script:

```javascript
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const saltRounds = 10;

const username = "new_username";
const plainTextPassword = "new_password";

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
        if (err) throw err;
        db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) throw err;
            console.log('User created:', result.insertId);
            db.end();
        });
    });
});
```

Replace `new_username` and `new_password` with the desired credentials. Run this script in a Node.js environment.
