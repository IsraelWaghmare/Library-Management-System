import React, { useEffect, useState, useCallback } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../api";
import Modal from "../components/Modal";
import "./Page.css";

const EMPTY = { 
  title: "", 
  author: "", 
  isbn: "", 
  genre: "", 
  publisher: "", 
  total_copies: 1, 
  published_year: "" 
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBooks(search ? { search } : {});
      const data = res?.data?.data || res?.data || [];
      setBooks(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ ...b });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editing) {
        await updateBook(editing.id, form);
      } else {
        await createBook(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Books</h1>
          <p className="page-sub">
            {books.length} books in collection
          </p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}>
          + Add Book
        </button>
      </div>

      {error && (
        <div className="alert alert--error">
          {error} <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by title, author, ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Genre</th>
                <th>Copies</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-row">
                    No books found.
                  </td>
                </tr>
              ) : (
                books.map((b, i) => (
                  <tr key={b.id}>
                    <td className="muted">{i + 1}</td>
                    <td><strong>{b.title}</strong></td>
                    <td>{b.author}</td>
                    <td className="mono">{b.isbn}</td>
                    <td>{b.genre || "—"}</td>
                    <td>{b.total_copies}</td>
                    <td>
                      <span
                        className={
                          "badge " +
                          (b.available_copies > 0
                            ? "badge--green"
                            : "badge--red")
                        }
                      >
                        {b.available_copies}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="btn btn--sm btn--outline"
                        onClick={() => openEdit(b)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal
          title={editing ? "Edit Book" : "Add New Book"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="modal-form">
            {error && <div className="alert alert--error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  required
                  value={form.author}
                  onChange={(e) =>
                    setForm({ ...form, author: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ISBN *</label>
                <input
                  required
                  value={form.isbn}
                  onChange={(e) =>
                    setForm({ ...form, isbn: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input
                  value={form.genre}
                  onChange={(e) =>
                    setForm({ ...form, genre: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Publisher</label>
                <input
                  value={form.publisher}
                  onChange={(e) =>
                    setForm({ ...form, publisher: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Published Year</label>
                <input
                  type="number"
                  min="1000"
                  max="2099"
                  value={form.published_year}
                  onChange={(e) =>
                    setForm({ ...form, published_year: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group form-group--sm">
              <label>Total Copies</label>
              <input
                type="number"
                min="1"
                value={form.total_copies}
                onChange={(e) =>
                  setForm({
                    ...form,
                    total_copies: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editing
                  ? "Update Book"
                  : "Add Book"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Books;

