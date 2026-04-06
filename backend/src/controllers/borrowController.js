import { pool } from "../config/db.js";

export const getBorrows = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT b.*, bk.title, m.name
    FROM borrows b
    JOIN books bk ON b.book_id = bk.id
    JOIN members m ON b.user_id = m.id
    ORDER BY b.id DESC
  `);
  res.json(rows);
};

export const issueBook = async (req, res) => {
  const { bookId, memberId } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Check availability
    const [book] = await conn.query(
      "SELECT available_copies FROM books WHERE id=? FOR UPDATE",
      [bookId]
    );

    if (!book.length || book[0].available_copies <= 0) {
      throw new Error("No copies available");
    }

    // ✅ FIX: member_id → user_id
    await conn.query(
      `INSERT INTO borrows (book_id, user_id, issue_date, due_date)
       VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [bookId, memberId]
    );

    // Decrease copy count
    await conn.query(
      "UPDATE books SET available_copies = available_copies - 1 WHERE id=?",
      [bookId]
    );

    await conn.commit();
    res.json({ message: "Book issued" });

  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};

export const returnBook = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [borrow] = await conn.query(
      "SELECT * FROM borrows WHERE id=? FOR UPDATE",
      [req.params.id]
    );

    if (!borrow.length || borrow[0].return_date) {
      throw new Error("Invalid return");
    }

    const bookId = borrow[0].book_id;

    await conn.query(
      "UPDATE borrows SET return_date=NOW() WHERE id=?",
      [req.params.id]
    );

    await conn.query(
      "UPDATE books SET available_copies = available_copies + 1 WHERE id=?",
      [bookId]
    );

    await conn.commit();
    res.json({ message: "Book returned" });

  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};

export const getStats = async (req, res) => {
  const [[books]] = await pool.query("SELECT COUNT(*) as totalBooks FROM books");
  const [[members]] = await pool.query("SELECT COUNT(*) as totalMembers FROM members");
  const [[issued]] = await pool.query(
    "SELECT COUNT(*) as issuedBooks FROM borrows WHERE return_date IS NULL"
  );
  const [[overdue]] = await pool.query(`
    SELECT COUNT(*) as overdueBooks
    FROM borrows
    WHERE return_date IS NULL AND due_date < NOW()
  `);

  res.json({
    totalBooks: books.totalBooks,
    totalMembers: members.totalMembers,
    issuedBooks: issued.issuedBooks,
    overdueBooks: overdue.overdueBooks
  });
};

