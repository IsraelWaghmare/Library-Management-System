import { pool } from "../config/db.js";

export const getMembers = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM members");
  res.json(rows);
};

export const createMember = async (req, res) => {
  const { name } = req.body;
  await pool.query("INSERT INTO members (name) VALUES (?)", [name]);
  res.json({ message: "Member added" });
};

export const updateMember = async (req, res) => {
  const { name } = req.body;
  await pool.query("UPDATE members SET name=? WHERE id=?", [name, req.params.id]);
  res.json({ message: "Updated" });
};

export const deleteMember = async (req, res) => {
  await pool.query("DELETE FROM members WHERE id=?", [req.params.id]);
  res.json({ message: "Deleted" });
};
