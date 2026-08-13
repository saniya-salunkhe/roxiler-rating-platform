# Roxiler Rating Platform

A full-stack web application that allows users to submit ratings (1–5) for stores registered on the platform. Built with **Express.js**, **MySQL**, and **React.js**.

## Features

### Single Login System
One login for all users. Role-based access control redirects users to the appropriate dashboard after authentication.

### User Roles

#### 1. System Administrator
- View dashboard with total users, total stores, and total ratings
- Add new stores, normal users, and admin users
- View list of stores (Name, Email, Address, Rating)
- View list of normal and admin users (Name, Email, Address, Role)
- Apply filters on all listings (Name, Email, Address, Role)
- View user details — Store Owners also show their store's rating
- Sort all tables by key fields (ascending/descending)

#### 2. Normal User
- Sign up and log in to the platform
- Update password after logging in
- View list of all registered stores
- Search stores by Name and Address
- View Store Name, Address, Overall Rating, and own submitted rating
- Submit and modify ratings (1–5) for individual stores
- Sort store listings

#### 3. Store Owner
- Log in to the platform
- Update password after logging in
- View list of users who rated their store
- See the average rating of their store

## Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Backend    | Express.js (Node.js)     |
| Database   | MySQL 8.0+               |
| Frontend   | React.js                 |
| Auth       | JWT (JSON Web Tokens)    |
| Validation | express-validator        |
| Security   | bcryptjs, CORS, Rate limiting |

## Project Structure

```
roxiler-rating-platform/
├── backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js      # Signup, login, profile, password
│   │   ├── adminController.js     # Admin dashboard, users, stores
│   │   ├── storeController.js     # Store listing, ratings
│   │   └── ownerController.js     # Store owner dashboard
│   ├── middleware/
│   │   ├── auth.js                # JWT verify + role-based access
│   │   └── validators.js          # express-validator rules
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── storeRoutes.js
│   │   └── ownerRoutes.js
│   ├── utils/
│   │   └── queryHelpers.js        # WHERE/ORDER BY builders
│   ├── .env.example
│   ├── package.json
│   ├── runMigration.js
│   └── server.js                  # Express app entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/common/
│   │   │   ├── Navbar.js
│   │   │   ├── SortableTableHeader.js
│   │   │   └── RatingStars.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── auth/ (Login, Signup)
│   │   │   ├── admin/ (Dashboard, Users, Stores, AddUser, AddStore, UserDetail)
│   │   │   ├── user/ (StoreList, ChangePassword)
│   │   │   └── store/ (OwnerDashboard)
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with interceptors
│   │   │   └── services.js         # API service modules
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js                 # Routes + protected routes
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql                 # MySQL schema with constraints
└── README.md
```

## Database Schema

### users
| Column     | Type                    | Constraints                          |
|------------|-------------------------|--------------------------------------|
| id         | INT AUTO_INCREMENT      | PRIMARY KEY                          |
| name       | VARCHAR(60)             | NOT NULL, CHECK (20–60 chars)        |
| email      | VARCHAR(255)            | NOT NULL, UNIQUE                     |
| password   | VARCHAR(255)            | NOT NULL, CHECK (8–16 chars)         |
| address    | VARCHAR(400)            | DEFAULT NULL                         |
| role       | ENUM('admin','user','store_owner') | DEFAULT 'user'             |

### stores
| Column     | Type         | Constraints                          |
|------------|--------------|--------------------------------------|
| id         | INT AUTO_INCREMENT | PRIMARY KEY                    |
| name       | VARCHAR(60)  | NOT NULL, CHECK (20–60 chars)       |
| email      | VARCHAR(255) | NOT NULL                            |
| address    | VARCHAR(400) | DEFAULT NULL                         |
| owner_id   | INT          | FK → users(id) ON DELETE SET NULL    |

### ratings
| Column     | Type         | Constraints                                    |
|------------|--------------|------------------------------------------------|
| id         | INT AUTO_INCREMENT | PRIMARY KEY                              |
| store_id   | INT          | NOT NULL, FK → stores(id) ON DELETE CASCADE    |
| user_id    | INT          | NOT NULL, FK → users(id) ON DELETE CASCADE      |
| rating     | TINYINT      | NOT NULL, CHECK (1–5)                          |
|            |              | UNIQUE (store_id, user_id) — one rating per user per store |

## Form Validations

| Field    | Rule                                                        |
|----------|-------------------------------------------------------------|
| Name     | 20–60 characters                                             |
| Email    | Standard email format validation                            |
| Address  | Max 400 characters                                           |
| Password | 8–16 characters, at least 1 uppercase letter + 1 special char |
| Rating   | Integer between 1 and 5                                     |

## API Endpoints

### Auth
| Method | Endpoint           | Access  | Description              |
|--------|---------------------|---------|--------------------------|
| POST   | /api/auth/signup    | Public  | Register new user        |
| POST   | /api/auth/login     | Public  | Login (all roles)        |
| GET    | /api/auth/me        | Auth    | Get current user profile |
| PUT    | /api/auth/password  | Auth    | Change password          |

### Admin
| Method | Endpoint              | Access | Description                    |
|--------|------------------------|--------|--------------------------------|
| GET    | /api/admin/dashboard   | Admin  | Dashboard stats                |
| GET    | /api/admin/users       | Admin  | List users (filter + sort)     |
| GET    | /api/admin/users/:id   | Admin  | User detail                    |
| POST   | /api/admin/users       | Admin  | Create user                    |
| GET    | /api/admin/stores      | Admin  | List stores (filter + sort)    |
| POST   | /api/admin/stores      | Admin  | Create store                   |

### Stores
| Method | Endpoint              | Access          | Description              |
|--------|------------------------|-----------------|--------------------------|
| GET    | /api/stores            | User, Admin     | List stores (search + sort) |
| GET    | /api/stores/:id        | User, Admin     | Get store detail         |
| POST   | /api/stores/:id/rate   | User, Admin     | Submit/modify rating     |

### Store Owner
| Method | Endpoint              | Access      | Description           |
|--------|------------------------|-------------|-----------------------|
| GET    | /api/owner/dashboard   | Store Owner | Owner dashboard       |

## Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Database Setup
```bash
# Option A: Run the schema directly
mysql -u root -p < database/schema.sql

# Option B: Use the migration script (after configuring .env)
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm run migrate
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials and JWT secret
npm install
npm run dev    # Development (nodemon)
# or
npm start      # Production
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
# Edit .env with the backend API URL
npm install
npm start
```

Frontend runs on `http://localhost:3000`

### 4. Default Admin Login
```
Email:    admin@roxiler.com
Password: Admin@1234
```
Note: The password hash in schema.sql is a placeholder. Run the app once and the migration will create the admin. If the hash doesn't match, you can update it by running a quick bcrypt hash generation in the backend.

## Security Features
- Passwords hashed with bcrypt (10 rounds)
- JWT-based authentication with 24h expiry
- Role-based access control middleware
- Input validation on all routes (express-validator)
- Parameterized SQL queries (SQL injection prevention)
- CORS configured for frontend origin
- API rate limiting (100 requests / 15 minutes)

## Sorting & Filtering
All list views support:
- **Sorting**: Click column headers to sort ascending/descending
- **Filtering**: Admin can filter by Name, Email, Address, and Role
- **Search**: Users can search stores by Name and Address

## License
This project is part of the Roxiler assignment.
