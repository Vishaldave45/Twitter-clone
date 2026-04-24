# Twitter Clone Auth Starter

Initial Twitter clone authentication built with Node.js, Express, EJS, MySQL2, JWT, bcrypt, multer, and TypeScript.

## Features

- Signup with name, username, email, password, bio, and optional avatar upload
- Signin with email or username
- Password hashing with bcrypt
- JWT-based authentication stored in an HTTP-only cookie
- Protected home page
- TypeScript validation for signup and signin payloads

## Tech Stack

- Node.js
- Express
- EJS
- MySQL2
- jsonwebtoken
- bcrypt
- multer
- TypeScript

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
copy .env.example .env
```

3. Update `.env` with your local MySQL and JWT values.

4. Create the MySQL database and table using [sql/schema.sql](./sql/schema.sql).

5. Run in development:

```bash
npm run dev
```

6. Build and run production:

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env` file from `.env.example` and set:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `COOKIE_NAME`

## Database Setup

Run the SQL in [sql/schema.sql](./sql/schema.sql) inside MySQL:

```sql
CREATE DATABASE IF NOT EXISTS twitter_clone;
USE twitter_clone;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  bio VARCHAR(280) DEFAULT NULL,
  avatar_path VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

## Upload To GitHub

If this folder is not already a git repository, run:

```bash
git init
git add .
git commit -m "Initial Twitter clone auth starter"
```

Then create an empty GitHub repository and connect it:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Important:

- Do not upload your real `.env` file
- Keep `.env` private and only commit `.env.example`
- If GitHub asks for authentication, use GitHub Desktop, browser sign-in, or a Personal Access Token

## Copy To Another Local System

If you move this project to another laptop or PC, follow these steps:

1. Install Node.js and MySQL on the new system.
2. Clone or copy the project folder.
3. Open the project in a terminal.
4. Install packages:

```bash
npm install
```

5. Create the environment file:

```bash
copy .env.example .env
```

6. Update `.env` with the new system's MySQL credentials.
7. Create the database and run the SQL from `sql/schema.sql`.
8. Start the app:

```bash
npm run dev
```

If you want production mode on the new system:

```bash
npm run build
npm start
```

## Notes For Another System

- `node_modules` should not be copied; always run `npm install`
- Uploaded avatars are stored in the local `uploads` folder, so copy that folder too if you want existing uploaded images
- Make sure MySQL is running before starting the app
- If the port is busy, change `PORT` in `.env`

## Default Routes

- `/signup`
- `/signin`
- `/home`
- `/logout`
