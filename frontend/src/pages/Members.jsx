import React, { useEffect, useState, useCallback } from "react";
import { getMembers, createMember, updateMember, deleteMember } from "../api";
import Modal from "../components/Modal";
import "./Page.css";

const EMPTY = { name: "", email: "", phone: "", address: "", membership_type: "standard" };

const Members = () => {
  const [members, setMembers] = useState([]);
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
      const res = await getMembers(search ? { search } : {});
      
      // ✅ SAFE API handling
      const data = res?.data?.data || res?.data || [];
      setMembers(Array.isArray(data) ? data : []);
      
    } catch {
      setError("Failed to load members.");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({ ...m });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editing) {
        await updateMember(editing.id, form);
      } else {
        await createMember(form);
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
    if (!window.confirm("Delete this member?")) return;
    try {
      await deleteMember(id);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-sub">
            {members?.length || 0} registered members
          </p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}>
          + Add Member
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
          placeholder="Search by name or email..."
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-row">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((m, i) => (
                  <tr key={m.id}>
                    <td className="muted">{i + 1}</td>
                    <td><strong>{m.name}</strong></td>
                    <td>{m.email}</td>
                    <td>{m.phone || "—"}</td>

                    <td>
                      <span
                        className={
                          "badge " +
                          (m.membership_type === "premium"
                            ? "badge--gold"
                            : "badge--blue")
                        }
                      >
                        {m.membership_type}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          "badge " +
                          (m.is_active ? "badge--green" : "badge--red")
                        }
                      >
                        {m.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="muted">
                      {new Date(m.joined_at).toLocaleDateString("en-IN")}
                    </td>

                    <td className="actions">
                      <button
                        className="btn btn--sm btn--outline"
                        onClick={() => openEdit(m)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => handleDelete(m.id)}
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
          title={editing ? "Edit Member" : "Add New Member"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="modal-form">
            {error && <div className="alert alert--error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Membership Type</label>
                <select
                  value={form.membership_type}
                  onChange={(e) =>
                    setForm({ ...form, membership_type: e.target.value })
                  }
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            {editing && (
              <div className="form-group form-group--sm">
                <label>Status</label>
                <select
                  value={form.is_active ? "1" : "0"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_active: e.target.value === "1",
                    })
                  }
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            )}

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
                  ? "Update Member"
                  : "Add Member"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Members;

