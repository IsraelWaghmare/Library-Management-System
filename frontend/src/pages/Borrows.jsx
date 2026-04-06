import React, { useEffect, useState, useCallback } from "react";
import { getBorrows, issueBook, returnBook, getBooks, getMembers } from "../api";
import Modal from "../components/Modal";
import "./Page.css";

const today = new Date();
const defaultDue = new Date(today.getTime() + 14 * 86400000)
  .toISOString()
  .split("T")[0];

const Borrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    book_id: "",
    member_id: "",
    due_date: defaultDue,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBorrows(filter ? { status: filter } : {});

      // ✅ SAFE handling
      const data = res?.data?.data || res?.data || [];
      setBorrows(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load borrows.");
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const openModal = async () => {
    setError("");
    setForm({ book_id: "", member_id: "", due_date: defaultDue });

    try {
      const [b, m] = await Promise.all([getBooks(), getMembers()]);

      const booksData = b?.data?.data || b?.data || [];
      const membersData = m?.data?.data || m?.data || [];

      setBooks(
        Array.isArray(booksData)
          ? booksData.filter((bk) => bk.available_copies > 0)
          : []
      );

      setMembers(
        Array.isArray(membersData)
          ? membersData.filter((mb) => mb.is_active)
          : []
      );
    } catch {
      setError("Could not load books/members.");
    }

    setShowModal(true);
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await issueBook(form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not issue book.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Mark this book as returned?")) return;
    try {
      await returnBook(id);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Return failed.");
    }
  };

  // ✅ derive status (since backend doesn't send it)
  const getStatus = (r) => {
    if (r.return_date) return "returned";
    if (new Date(r.due_date) < new Date()) return "overdue";
    return "borrowed";
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Borrows</h1>
          <p className="page-sub">
            {borrows?.length || 0} records
          </p>
        </div>
        <button className="btn btn--primary" onClick={openModal}>
          + Issue Book
        </button>
      </div>

      {error && (
        <div className="alert alert--error">
          {error} <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className="toolbar">
        {["", "borrowed", "returned", "overdue"].map((s) => (
          <button
            key={s}
            className={`filter-btn ${
              filter === s ? "filter-btn--active" : ""
            }`}
            onClick={() => setFilter(s)}
          >
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>Member</th>
                <th>Borrowed</th>
                <th>Due Date</th>
                <th>Returned</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {borrows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-row">
                    No records found.
                  </td>
                </tr>
              ) : (
                borrows.map((r, i) => {
                  const status = getStatus(r);

                  return (
                    <tr key={r.id}>
                      <td className="muted">{i + 1}</td>

                      <td>
                        <strong>{r.title}</strong>
                      </td>

                      <td>{r.name}</td>

                      <td className="muted">
                        {new Date(r.issue_date).toLocaleDateString("en-IN")}
                      </td>

                      <td>
                        {new Date(r.due_date).toLocaleDateString("en-IN")}
                      </td>

                      <td className="muted">
                        {r.return_date
                          ? new Date(r.return_date).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            status === "returned"
                              ? "badge--green"
                              : status === "overdue"
                              ? "badge--red"
                              : "badge--blue"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {status === "borrowed" && (
                          <button
                            className="btn btn--sm btn--primary"
                            onClick={() => handleReturn(r.id)}
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Issue a Book" onClose={() => setShowModal(false)}>
          <form onSubmit={handleBorrow} className="modal-form">
            {error && <div className="alert alert--error">{error}</div>}

            <div className="form-group">
              <label>Select Book *</label>
              <select
                required
                value={form.book_id}
                onChange={(e) =>
                  setForm({ ...form, book_id: e.target.value })
                }
              >
                <option value="">-- Select Book --</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.available_copies} left)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Member *</label>
              <select
                required
                value={form.member_id}
                onChange={(e) =>
                  setForm({ ...form, member_id: e.target.value })
                }
              >
                <option value="">-- Select Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date *</label>
              <input
                required
                type="date"
                value={form.due_date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setForm({ ...form, due_date: e.target.value })
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
                {submitting ? "Issuing..." : "Issue Book"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Borrows;
