import { pool } from "../config/db.js";

export const getBooks = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM books");
  res.json(rows);
};

export const getBookById = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
};

export const createBook = async (req, res) => {
  const { title } = req.body;
  await pool.query("INSERT INTO books (title) VALUES (?)", [title]);
  res.json({ message: "Book added" });
};

export const updateBook = async (req, res) => {
  const { title } = req.body;
  await pool.query("UPDATE books SET title=? WHERE id=?", [title, req.params.id]);
  res.json({ message: "Updated" });
};

export const deleteBook = async (req, res) => {
  await pool.query("DELETE FROM books WHERE id=?", [req.params.id]);
  res.json({ message: "Deleted" });
};
