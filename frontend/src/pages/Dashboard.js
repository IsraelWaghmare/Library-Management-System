import React from 'react';
import './Dashboard.css';

const stats = [
  { label: 'Total Books',  value: 8,  icon: '📚', color: 'gold',   change: '▲ 2 this month', up: true },
  { label: 'Members',      value: 4,  icon: '👥', color: 'teal',   change: '▲ 1 new today',  up: true },
  { label: 'Issued',       value: 0,  icon: '↗',  color: 'coral',  change: '● None active',  up: false },
  { label: 'Overdue',      value: 0,  icon: '⚠',  color: 'violet', change: '● All clear',    up: true },
];

const recentBooks = [
  { title: 'The Pragmatic Programmer', author: 'David Thomas',      genre: 'Technology',     status: 'available' },
  { title: 'Dune',                     author: 'Frank Herbert',     genre: 'Science Fiction', status: 'available' },
  { title: 'Atomic Habits',            author: 'James Clear',       genre: 'Self-Help',      status: 'borrowed' },
  { title: 'Sapiens',                  author: 'Yuval Noah Harari', genre: 'History',        status: 'available' },
  { title: 'The Alchemist',            author: 'Paulo Coelho',      genre: 'Fiction',        status: 'available' },
];

const genreData = [
  { genre: 'Technology',     count: 3, color: '#2dcaad' },
  { genre: 'Fiction',        count: 2, color: '#e87bb0' },
  { genre: 'Science Fiction',count: 1, color: '#8b7ff0' },
  { genre: 'History',        count: 1, color: '#f0a500' },
  { genre: 'Self-Help',      count: 1, color: '#5abf7e' },
];
const total = genreData.reduce((s, g) => s + g.count, 0);

export default function Dashboard({ onNavigate }) {
  return (
    <div className="dash">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Library Dashboard</h1>
          <p className="dash-sub">Welcome back — here's what's happening today.</p>
        </div>
        <button className="btn-primary" onClick={() => onNavigate('books')}>
          ＋ Add Book
        </button>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {stats.map(s => (
          <div className={`stat-card stat-${s.color}`} key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-change ${s.up ? 'up' : 'neutral'}`}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Recent books */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Books</span>
            <button className="link-btn" onClick={() => onNavigate('books')}>View all →</button>
          </div>
          <div className="book-list">
            {recentBooks.map((b, i) => (
              <div className="book-row" key={i}>
                <div className="book-thumb">{b.title[0]}</div>
                <div className="book-info">
                  <div className="book-name">{b.title}</div>
                  <div className="book-meta">{b.author} · {b.genre}</div>
                </div>
                <span className={`status-dot ${b.status}`}>
                  {b.status === 'available' ? 'Available' : 'Borrowed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Genre breakdown */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Genre Breakdown</span>
          </div>
          <div className="genre-list">
            {genreData.map(g => (
              <div className="genre-row" key={g.genre}>
                <div className="genre-label">
                  <span className="genre-dot" style={{ background: g.color }} />
                  {g.genre}
                </div>
                <div className="genre-bar-wrap">
                  <div className="genre-bar-track">
                    <div className="genre-bar-fill"
                      style={{ width: `${(g.count/total)*100}%`, background: g.color }} />
                  </div>
                  <span className="genre-count">{g.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <p className="panel-title" style={{ marginBottom: '12px' }}>Quick Actions</p>
            <div className="qa-grid">
              <button className="qa-btn" onClick={() => onNavigate('books')}>📖 Books</button>
              <button className="qa-btn" onClick={() => onNavigate('members')}>👤 Members</button>
              <button className="qa-btn" onClick={() => onNavigate('borrows')}>↩ Borrows</button>
              <button className="qa-btn">📊 Reports</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
