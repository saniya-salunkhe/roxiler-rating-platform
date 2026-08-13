-- ============================================================================
-- Roxiler Rating Platform - Database Schema
-- MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS roxiler_rating_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE roxiler_rating_db;


-- ============================================================================
-- TABLE: users
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    -- Stores bcrypt hash
    password VARCHAR(255) NOT NULL,

    address VARCHAR(400) DEFAULT NULL,

    role ENUM('admin', 'user', 'store_owner')
        NOT NULL DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_name
        CHECK (
            CHAR_LENGTH(name) >= 20
            AND CHAR_LENGTH(name) <= 60
        ),

    INDEX idx_users_email (email),

    INDEX idx_users_role (role)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: stores
-- ============================================================================

CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(255) NOT NULL,

    address VARCHAR(400) DEFAULT NULL,

    owner_id INT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_stores_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_store_name
        CHECK (
            CHAR_LENGTH(name) >= 20
            AND CHAR_LENGTH(name) <= 60
        ),

    INDEX idx_stores_email (email),

    INDEX idx_stores_owner (owner_id)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: ratings
-- ============================================================================

CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    store_id INT NOT NULL,

    user_id INT NOT NULL,

    rating TINYINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ratings_store
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ratings_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_rating_value
        CHECK (
            rating >= 1
            AND rating <= 5
        ),

    UNIQUE KEY uq_store_user_rating (
        store_id,
        user_id
    ),

    INDEX idx_ratings_store (store_id),

    INDEX idx_ratings_user (user_id)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- DEFAULT ADMIN
--
-- Email: admin@roxiler.com
-- Password: Admin@1234
-- ============================================================================

INSERT INTO users (
    name,
    email,
    password,
    address,
    role
)
SELECT
    'System Administrator',
    'admin@roxiler.com',

    -- bcrypt hash for Admin@1234
    '$2b$10$aW5koYYR/KqDZ8.Kr.GQAuL0JrweM9vcrDw8xC3LKo0EWHFuuAlLu',

    'Roxiler Technologies, Pune, Maharashtra, India',
    'admin'

WHERE NOT EXISTS (
    SELECT 1
    FROM users
    WHERE email = 'admin@roxiler.com'
);


-- ============================================================================
-- SAMPLE STORES
-- ============================================================================

INSERT INTO stores (
    name,
    email,
    address
)
SELECT
    'The Coffee Bean & Tea Leaf Cafe',
    'contact@coffeebean.com',
    'Shop 5, Linking Road, Bandra West, Mumbai, Maharashtra 400050'
WHERE NOT EXISTS (
    SELECT 1
    FROM stores
    WHERE email = 'contact@coffeebean.com'
);


INSERT INTO stores (
    name,
    email,
    address
)
SELECT
    'FreshMart Organic Grocery Store',
    'hello@freshmart.com',
    '12 Jubilee Hills, Hyderabad, Telangana 500033'
WHERE NOT EXISTS (
    SELECT 1
    FROM stores
    WHERE email = 'hello@freshmart.com'
);


INSERT INTO stores (
    name,
    email,
    address
)
SELECT
    'Spice Route Authentic Indian Kitchen',
    'info@spiceroute.com',
    '45 Park Street, Kolkata, West Bengal 700016'
WHERE NOT EXISTS (
    SELECT 1
    FROM stores
    WHERE email = 'info@spiceroute.com'
);


INSERT INTO stores (
    name,
    email,
    address
)
SELECT
    'BookWorm Literary Corner Bookstore',
    'books@bookworm.com',
    '78 Connaught Place, New Delhi 110001'
WHERE NOT EXISTS (
    SELECT 1
    FROM stores
    WHERE email = 'books@bookworm.com'
);


INSERT INTO stores (
    name,
    email,
    address
)
SELECT
    'TechHub Electronics & Gadgets Store',
    'sales@techhub.com',
    '23 Residency Road, Bengaluru, Karnataka 560025'
WHERE NOT EXISTS (
    SELECT 1
    FROM stores
    WHERE email = 'sales@techhub.com'
);


-- ============================================================================
-- VERIFY
-- ============================================================================

SELECT
    id,
    name,
    email,
    role
FROM users;

SELECT
    id,
    name,
    email,
    address
FROM stores;