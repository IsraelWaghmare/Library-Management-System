import express from "express";
import * as book from "../controllers/bookController.js";
import * as member from "../controllers/memberController.js";
import * as borrow from "../controllers/borrowController.js";

const router = express.Router();

// Books
router.get("/books", book.getBooks);
router.get("/books/:id", book.getBookById);
router.post("/books", book.createBook);
router.put("/books/:id", book.updateBook);
router.delete("/books/:id", book.deleteBook);

// Members
router.get("/members", member.getMembers);
router.post("/members", member.createMember);
router.put("/members/:id", member.updateMember);
router.delete("/members/:id", member.deleteMember);

// Borrows
router.get("/borrows", borrow.getBorrows);
router.get("/borrows/stats", borrow.getStats);
router.post("/borrows", borrow.issueBook);
router.put("/borrows/:id/return", borrow.returnBook);

export default router;
