# Twitter Clone

A full-featured Twitter clone built with Node.js, Express, EJS, MySQL2, JWT, bcrypt, multer, and TypeScript. Features user authentication, tweet creation, profile management, and social media functionality.

## Features

### Authentication & User Management
- User registration with profile information
- Secure login with email/username
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- Profile editing with avatar and cover image uploads
- User search functionality

### Tweet Management
- Create tweets with text and image uploads
- Edit and delete own tweets
- Timeline feed showing all tweets
- Tweet display with user information and engagement metrics
- Image upload support for tweets

### User Profiles
- Personal profile pages with user information
- Display of user's tweets on profile pages
- Public user profile viewing
- Profile statistics and metadata

### UI/UX Features
- Modern, responsive design with CSS Grid and Flexbox
- Sticky sidebar navigation
- Mobile-responsive layout
- Clean, Twitter-inspired interface
- Form validation with TypeScript
- Error handling and user feedback

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templating, CSS3
- **Database**: MySQL2
- **Authentication**: JWT, bcrypt
- **File Uploads**: Multer
- **Language**: TypeScript
- **Development**: tsx (for development), tsc (for build)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your local MySQL and JWT configuration.

3. **Database setup**:
   Create a MySQL database and run the schema:
   ```bash
   mysql -u your_username -p < sql/schema.sql
   ```

4. **Development mode**:
   ```bash
   npm run dev
   ```

5. **Production build**:
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

Create a `.env` file with:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=twitter_clone
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
COOKIE_NAME=twitter_clone_auth
```

## Database Schema

The application uses two main tables:

- `users`: User accounts with profile information
- `tweets`: Tweet content with user relationships

Run `sql/schema.sql` to set up the complete database structure.

## Project Structure

```
├── src/
│   ├── app.ts                 # Main application setup
│   ├── config/
│   │   ├── db.ts             # Database configuration
│   │   └── env.ts            # Environment variables
│   ├── controllers/          # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── tweet.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── upload.middleware.ts
│   ├── routes/               # Route definitions
│   ├── services/             # Business logic
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── validators/           # Input validation
├── views/                    # EJS templates
├── public/css/              # Stylesheets
├── uploads/                 # User uploaded files
└── sql/                     # Database schema
```

## API Routes

### Authentication
- `GET /signup` - Registration page
- `POST /signup` - Register new user
- `GET /signin` - Login page
- `POST /signin` - Authenticate user
- `POST /logout` - Logout user

### Tweets
- `GET /home` - Main timeline
- `POST /tweets` - Create new tweet
- `GET /tweets/:id/edit` - Edit tweet form
- `POST /tweets/:id/edit` - Update tweet
- `POST /tweets/:id/delete` - Delete tweet

### Users & Profiles
- `GET /profile` - Current user profile
- `GET /profile/edit` - Edit profile form
- `POST /profile/edit` - Update profile
- `GET /user/:username` - Public user profile
- `GET /users` - Browse users
- `POST /search` - Search users

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run TypeScript compiler for type checking

### File Uploads

- Profile avatars and cover images are stored in `uploads/`
- Tweet images are also stored in `uploads/`
- Multer handles file uploads with size limits and type validation

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. See individual file headers for licensing information.
