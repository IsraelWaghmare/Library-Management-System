-- ============================================
--  LIBRARY MANAGEMENT SYSTEM — MySQL Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- ─── BOOKS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  author      VARCHAR(255) NOT NULL,
  isbn        VARCHAR(20)  UNIQUE NOT NULL,
  genre       VARCHAR(100),
  publisher   VARCHAR(255),
  total_copies    INT DEFAULT 1,
  available_copies INT DEFAULT 1,
  published_year  YEAR,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── MEMBERS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  phone       VARCHAR(20),
  address     TEXT,
  membership_type ENUM('standard', 'premium') DEFAULT 'standard',
  joined_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active   BOOLEAN DEFAULT TRUE
);

-- ─── BORROW RECORDS ──────────────────────────
CREATE TABLE IF NOT EXISTS borrow_records (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  book_id     INT NOT NULL,
  member_id   INT NOT NULL,
  borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date    DATE NOT NULL,
  returned_at TIMESTAMP NULL DEFAULT NULL,
  status      ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
  FOREIGN KEY (book_id)   REFERENCES books(id)   ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- ─── SEED DATA ───────────────────────────────
INSERT INTO books (title, author, isbn, genre, publisher, total_copies, available_copies, published_year) VALUES
('The Pragmatic Programmer',  'David Thomas',      '978-0135957059', 'Technology',  'Addison-Wesley', 3, 3, 2019),
('Clean Code',                'Robert C. Martin',  '978-0132350884', 'Technology',  'Prentice Hall',  2, 2, 2008),
('Dune',                      'Frank Herbert',     '978-0441013593', 'Science Fiction', 'Ace Books',  4, 4, 1965),
('Sapiens',                   'Yuval Noah Harari', '978-0062316097', 'History',     'Harper Perennial',3,3,2015),
('Atomic Habits',             'James Clear',       '978-0735211292', 'Self-Help',   'Avery',          2, 2, 2018),
('The Great Gatsby',          'F. Scott Fitzgerald','978-0743273565','Fiction',     'Scribner',        2, 2, 1925),
('Kubernetes in Action',      'Marko Luksa',       '978-1617293726', 'Technology',  'Manning',         2, 2, 2017),
('The Alchemist',             'Paulo Coelho',      '978-0062315007', 'Fiction',     'HarperOne',       3, 3, 1988);

INSERT INTO members (name, email, phone, membership_type) VALUES
('Ravi Kumar',    'ravi@example.com',   '9876543210', 'premium'),
('Priya Sharma',  'priya@example.com',  '9123456789', 'standard'),
('Amit Desai',    'amit@example.com',   '9988776655', 'standard'),
('Neha Patil',    'neha@example.com',   '9871234560', 'premium');
