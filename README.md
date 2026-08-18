# Roxiler Rating Platform

A full-stack **Store Rating Platform** developed as part of the **Roxiler Full Stack Development Assignment**.

The application allows users to register, browse stores, and submit ratings from **1 to 5**. It provides role-based functionality for **System Administrators, Normal Users, and Store Owners**.

## Live Demo

- **Frontend:** https://roxiler-rating-platform-1.vercel.app
- **Backend:** https://roxiler-rating-backend-1.onrender.com
- **Database:** Aiven MySQL

---

## Features

### Single Login System

The application provides a single authentication system for all users. After successful login, users are redirected according to their assigned role.

### 1. System Administrator

The administrator can:

- View total users, stores, and ratings
- Add new stores
- Add normal users and administrators
- View all registered users
- View all registered stores
- View user details
- View store ratings
- Filter users by Name, Email, Address, and Role
- Filter stores by Name, Email, and Address
- Sort table data in ascending or descending order

### 2. Normal User

Normal users can:

- Sign up and log in
- Update their password
- View all registered stores
- Search stores by Name and Address
- View store details
- View overall store ratings
- View their own submitted rating
- Submit ratings from 1 to 5
- Modify previously submitted ratings
- Sort store listings

### 3. Store Owner

Store Owners can:

- Log in to the platform
- Update their password
- Access the Store Owner dashboard
- View users who rated their store
- View submitted ratings
- View the average rating of their store

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JWT |
| Password Security | bcryptjs |
| Validation | express-validator |
| API Communication | Axios |
| API Architecture | REST API |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Database Hosting | Aiven MySQL |
| Version Control | Git & GitHub |

---

## Project Structure

```text
roxiler-rating-platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   ├── runMigration.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

## Database Schema

The application uses three main tables:

### Users

| Column | Type | Description |
|---|---|---|
| id | INT | Primary Key |
| name | VARCHAR(60) | User name |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | bcrypt hashed password |
| address | VARCHAR(400) | User address |
| role | ENUM | admin, user, store_owner |

### Stores

| Column | Type | Description |
|---|---|---|
| id | INT | Primary Key |
| name | VARCHAR(60) | Store name |
| email | VARCHAR(255) | Store email |
| address | VARCHAR(400) | Store address |
| owner_id | INT | Foreign Key to users |

### Ratings

| Column | Type | Description |
|---|---|---|
| id | INT | Primary Key |
| store_id | INT | Foreign Key to stores |
| user_id | INT | Foreign Key to users |
| rating | TINYINT | Rating between 1 and 5 |

The database uses:

```text
UNIQUE(store_id, user_id)
```

This ensures that one user can have only one rating for a particular store. The user can modify the existing rating later.

---

## Form Validations

| Field | Validation |
|---|---|
| Name | 20–60 characters |
| Email | Valid email format |
| Address | Maximum 400 characters |
| Password | 8–16 characters |
| Password | At least 1 uppercase letter |
| Password | At least 1 special character |
| Rating | Integer between 1 and 5 |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register normal user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get logged-in user profile |
| PUT | `/api/auth/password` | Change password |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/users/:id` | View user details |
| POST | `/api/admin/users` | Create user |
| GET | `/api/admin/stores` | List stores |
| POST | `/api/admin/stores` | Create store |

### Stores

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stores` | List stores |
| GET | `/api/stores/:id` | Get store details |
| POST | `/api/stores/:id/rate` | Submit or modify rating |

### Store Owner

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/owner/dashboard` | Store Owner dashboard |

---

## Local Setup

### Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm
- MySQL 8.0+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/saniya-salunkhe/roxiler-rating-platform.git
cd roxiler-rating-platform
```

### 2. Database Setup

Run the provided schema:

```bash
mysql -u root -p < database/schema.sql
```

Or use the migration script after configuring the backend environment variables:

```bash
cd backend
npm install
npm run migrate
```

### 3. Backend Setup

Navigate to the backend:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=roxiler_rating_db

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=24h

CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend:

```text
http://localhost:3000
```

---

## Production Deployment

The application is deployed using:

```text
React Frontend
      │
      ▼
    Vercel
      │
      ▼
Express REST API
      │
      ▼
    Render
      │
      ▼
 Aiven MySQL
```

### Production URLs

**Frontend**

```text
https://roxiler-rating-platform-1.vercel.app
```

**Backend**

```text
https://roxiler-rating-backend-1.onrender.com
```

**API Base URL**

```text
https://roxiler-rating-backend-1.onrender.com/api
```

---

## Security Features

- Password hashing using bcryptjs
- JWT-based authentication
- Role-based authorization
- Protected frontend routes
- Protected backend API routes
- Input validation using express-validator
- Parameterized MySQL queries
- SQL injection prevention
- CORS configuration
- API rate limiting
- Express proxy configuration for Render
- Environment variables for sensitive configuration

> Production database passwords, JWT secrets, and `.env` files are not stored in the public repository.

---

## Sorting, Searching & Filtering

The platform supports:

- Ascending and descending table sorting
- User filtering by Name, Email, Address, and Role
- Store filtering by Name, Email, and Address
- Store search by Name and Address

---

## Assignment Requirements Implemented

- Single login system for all roles
- Role-based access control
- System Administrator dashboard
- Normal User registration
- Store Owner dashboard
- Store management
- User management
- Store rating system
- Rating modification
- Search and filtering
- Ascending/descending sorting
- Input validation
- Secure password storage
- REST API integration
- MySQL relational database
- Responsive React frontend
- Cloud deployment

---

## Important Security Note

Do not commit the following to GitHub:

- `.env` files
- Database passwords
- JWT secrets
- Private API keys
- Production credentials

Use environment variables for all sensitive information.

---

## License

This project was developed as part of the **Roxiler Full Stack Development Assignment**.
