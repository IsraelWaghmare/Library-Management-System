import React, { useState } from 'react';
import Modal from '../components/Modal';

const GENRE_STYLE = {
  'Technology':      { bg: 'rgba(45,202,173,0.12)',  color: '#2dcaad', border: 'rgba(45,202,173,0.2)'  },
  'Science Fiction': { bg: 'rgba(139,127,240,0.12)', color: '#8b7ff0', border: 'rgba(139,127,240,0.2)' },
  'History':         { bg: 'rgba(240,165,0,0.12)',   color: '#f0a500', border: 'rgba(240,165,0,0.2)'   },
  'Self-Help':       { bg: 'rgba(90,191,126,0.12)',  color: '#5abf7e', border: 'rgba(90,191,126,0.2)'  },
  'Fiction':         { bg: 'rgba(232,123,176,0.12)', color: '#e87bb0', border: 'rgba(232,123,176,0.2)' },
};

const INIT = [
  { id:1, title:'The Pragmatic Programmer', author:'David Thomas',        isbn:'978-0135957059', genre:'Technology',      copies:3, available:3 },
  { id:2, title:'Clean Code',               author:'Robert C. Martin',    isbn:'978-0132350884', genre:'Technology',      copies:2, available:2 },
  { id:3, title:'Dune',                     author:'Frank Herbert',       isbn:'978-0441013593', genre:'Science Fiction',  copies:4, available:4 },
  { id:4, title:'Sapiens',                  author:'Yuval Noah Harari',   isbn:'978-0062316097', genre:'History',         copies:3, available:3 },
  { id:5, title:'Atomic Habits',            author:'James Clear',         isbn:'978-0735211292', genre:'Self-Help',       copies:2, available:2 },
  { id:6, title:'The Great Gatsby',         author:'F. Scott Fitzgerald', isbn:'978-0743273565', genre:'Fiction',         copies:2, available:2 },
  { id:7, title:'Kubernetes in Action',     author:'Marko Luksa',         isbn:'978-1617293726', genre:'Technology',      copies:2, available:2 },
  { id:8, title:'The Alchemist',            author:'Paulo Coelho',        isbn:'978-0062315007', genre:'Fiction',         copies:3, available:3 },
];

const GENRES = ['Technology','Science Fiction','History','Self-Help','Fiction'];

const s = {
  wrap: { },
  header: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'36px' },
  title: { fontFamily:"'Playfair Display', serif", fontSize:'32px', fontWeight:700, color:'var(--text)' },
  sub:   { fontSize:'14px', color:'var(--text-muted)', marginTop:'6px' },
  actions: { display:'flex', gap:'12px', alignItems:'center' },

  toolbar: { display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', flexWrap:'wrap' },
  searchWrap: { position:'relative', flex:1, minWidth:'240px' },
  searchIcon: { position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-faint)', fontSize:'15px', pointerEvents:'none' },
  searchInput: {
    width:'100%', background:'var(--surface)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-sm)', padding:'10px 14px 10px 40px', color:'var(--text)',
    fontSize:'14px', outline:'none',
  },
  filterSelect: {
    background:'var(--surface)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-sm)', padding:'10px 14px', color:'var(--text-muted)',
    fontSize:'14px', outline:'none', minWidth:'130px',
  },
  tableWrap: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' },
  table: { width:'100%', borderCollapse:'collapse' },
  th: {
    background:'var(--surface2)', padding:'14px 18px', textAlign:'left',
    fontSize:'11px', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase',
    color:'var(--text-faint)', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap',
  },
  tdBase: { padding:'16px 18px', verticalAlign:'middle' },
  footer: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 18px', background:'var(--surface2)',
    borderTop:'1px solid var(--border)', fontSize:'13px', color:'var(--text-faint)',
  },
};

function GenreBadge({ genre }) {
  const g = GENRE_STYLE[genre] || { bg:'rgba(255,255,255,0.08)', color:'var(--text-muted)', border:'rgba(255,255,255,0.1)' };
  return (
    <span style={{
      display:'inline-block', padding:'4px 10px', borderRadius:'20px',
      fontSize:'11px', fontWeight:500,
      background: g.bg, color: g.color, border:`1px solid ${g.border}`,
    }}>{genre}</span>
  );
}

function CopiesBar({ available, copies }) {
  const pct = copies ? Math.round((available/copies)*100) : 0;
  const fill = pct >= 66 ? '#5abf7e' : pct >= 33 ? '#f0a500' : '#f07060';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
      <div style={{ width:'60px', height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'4px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:fill, borderRadius:'4px', transition:'width 0.4s' }} />
      </div>
      <span style={{ fontSize:'13px', color:'var(--text-muted)' }}>{available} / {copies}</span>
    </div>
  );
}

function BtnPrimary({ children, onClick, small }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'inline-flex', alignItems:'center', gap:'6px',
        padding: small ? '6px 14px' : '10px 20px',
        borderRadius:'var(--radius-sm)', border:'none',
        background: h ? '#ffc43d' : 'var(--gold)', color:'#0f0e17',
        fontSize: small ? '12px' : '14px', fontWeight:600, cursor:'pointer',
        boxShadow: h ? '0 0 28px rgba(240,165,0,0.4)' : '0 0 16px rgba(240,165,0,0.2)',
        transform: h ? 'translateY(-1px)' : 'none',
        transition:'all 0.18s', fontFamily:"'DM Sans', sans-serif",
      }}>{children}</button>
  );
}
function BtnGhost({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'inline-flex', alignItems:'center', gap:'6px', padding:'10px 18px',
        borderRadius:'var(--radius-sm)', background: h ? 'rgba(255,255,255,0.07)' : 'var(--surface2)',
        border:'1px solid var(--border)', color: h ? 'var(--text)' : 'var(--text-muted)',
        fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'all 0.18s',
        fontFamily:"'DM Sans', sans-serif",
      }}>{children}</button>
  );
}
function BtnEdit({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        padding:'6px 12px', borderRadius:'var(--radius-sm)', fontSize:'12px', fontWeight:500, cursor:'pointer',
        background: h ? 'rgba(139,127,240,0.22)' : 'rgba(139,127,240,0.12)',
        color:'#8b7ff0', border:'1px solid rgba(139,127,240,0.2)', transition:'all 0.15s',
        fontFamily:"'DM Sans', sans-serif",
      }}>✏ Edit</button>
  );
}
function BtnDelete({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        padding:'6px 12px', borderRadius:'var(--radius-sm)', fontSize:'12px', fontWeight:500, cursor:'pointer',
        background: h ? 'rgba(240,112,96,0.25)' : 'rgba(240,112,96,0.12)',
        color:'#f07060', border:'1px solid rgba(240,112,96,0.2)', transition:'all 0.15s',
        fontFamily:"'DM Sans', sans-serif",
      }}>✕ Delete</button>
  );
}

function Toast({ msg, show }) {
  return (
    <div style={{
      position:'fixed', bottom:'24px', right:'24px',
      background:'var(--surface)', border:'1px solid rgba(90,191,126,0.3)',
      borderLeft:'3px solid #5abf7e', borderRadius:'10px',
      padding:'14px 20px', fontSize:'14px', color:'var(--text)', zIndex:9999,
      opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(12px)',
      transition:'all 0.3s ease', display:'flex', alignItems:'center', gap:'10px',
      boxShadow:'0 8px 32px rgba(0,0,0,0.4)', pointerEvents:'none',
    }}>
      ✅ {msg}
    </div>
  );
}

export default function Books() {
  const [books, setBooks] = useState(INIT);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('id');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', author:'', isbn:'', genre:'Technology', copies:1 });
  const [toast, setToast] = useState({ show:false, msg:'' });
  const [rowHover, setRowHover] = useState(null);

  function showToast(msg) {
    setToast({ show:true, msg });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3000);
  }

  let list = books.filter(b => {
    const q = search.toLowerCase();
    const match = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q);
    return match && (!genre || b.genre === genre);
  });
  if (sort === 'title')  list = [...list].sort((a,b) => a.title.localeCompare(b.title));
  if (sort === 'author') list = [...list].sort((a,b) => a.author.localeCompare(b.author));
  if (sort === 'copies') list = [...list].sort((a,b) => b.copies - a.copies);

  function openAdd() {
    setEditing(null);
    setForm({ title:'', author:'', isbn:'', genre:'Technology', copies:1 });
    setShowModal(true);
  }
  function openEdit(b) {
    setEditing(b.id);
    setForm({ title:b.title, author:b.author, isbn:b.isbn, genre:b.genre, copies:b.copies });
    setShowModal(true);
  }
  function saveBook() {
    if (!form.title.trim() || !form.author.trim()) return;
    if (editing) {
      setBooks(bs => bs.map(b => b.id === editing ? { ...b, ...form, copies: Number(form.copies), available: Number(form.copies) } : b));
      showToast(`"${form.title}" updated!`);
    } else {
      const id = books.length ? Math.max(...books.map(b=>b.id))+1 : 1;
      setBooks(bs => [...bs, { id, ...form, copies: Number(form.copies), available: Number(form.copies) }]);
      showToast(`"${form.title}" added!`);
    }
    setShowModal(false);
  }
  function deleteBook(id, e) {
    e.stopPropagation();
    const b = books.find(x => x.id === id);
    if (!window.confirm(`Delete "${b.title}"?`)) return;
    setBooks(bs => bs.filter(x => x.id !== id));
    showToast(`"${b.title}" removed.`);
  }

  const inputStyle = {
    width:'100%', background:'var(--surface2)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-sm)', padding:'10px 14px', color:'var(--text)',
    fontSize:'14px', outline:'none', fontFamily:"'DM Sans', sans-serif",
  };

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Books</h1>
          <p style={s.sub}>{books.length} books in collection</p>
        </div>
        <div style={s.actions}>
          <BtnGhost>📥 Import</BtnGhost>
          <BtnPrimary onClick={openAdd}>＋ Add Book</BtnPrimary>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
        {[
          { label:'Total',     val:books.length,                                      icon:'📚', accent:'#f0a500' },
          { label:'Available', val:books.reduce((s,b)=>s+b.available,0),              icon:'✅', accent:'#2dcaad' },
          { label:'Copies',    val:books.reduce((s,b)=>s+b.copies,0),                 icon:'📋', accent:'#8b7ff0' },
          { label:'Genres',    val:[...new Set(books.map(b=>b.genre))].length,        icon:'🏷', accent:'#e87bb0' },
        ].map(c => (
          <div key={c.label} style={{
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', padding:'18px 20px',
            borderTop:`3px solid ${c.accent}`, transition:'transform 0.2s',
          }}>
            <span style={{ fontSize:'20px', display:'block', marginBottom:'10px' }}>{c.icon}</span>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'30px', fontWeight:700, color:'var(--text)', lineHeight:1 }}>{c.val}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input style={s.searchInput} value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by title, author, ISBN…" />
        </div>
        <select style={s.filterSelect} value={genre} onChange={e=>setGenre(e.target.value)}>
          <option value="">All Genres</option>
          {GENRES.map(g => <option key={g}>{g}</option>)}
        </select>
        <select style={s.filterSelect} value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="id">Sort by #</option>
          <option value="title">By Title</option>
          <option value="author">By Author</option>
          <option value="copies">By Copies</option>
        </select>
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {['#','Book','ISBN','Genre','Copies / Available','Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={6} style={{ ...s.tdBase, textAlign:'center', color:'var(--text-faint)', padding:'48px' }}>
                No books found
              </td></tr>
            )}
            {list.map((b, i) => (
              <tr key={b.id}
                onMouseEnter={()=>setRowHover(b.id)} onMouseLeave={()=>setRowHover(null)}
                style={{
                  borderBottom:'1px solid var(--border)',
                  background: rowHover===b.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                  transition:'background 0.15s',
                }}>
                <td style={{ ...s.tdBase, color:'var(--text-faint)', fontSize:'12px', width:'40px' }}>{i+1}</td>
                <td style={s.tdBase}>
                  <div style={{ fontWeight:600, color:'var(--text)', fontSize:'14px' }}>{b.title}</div>
                  <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>{b.author}</div>
                </td>
                <td style={{ ...s.tdBase, fontFamily:'monospace', fontSize:'12px', color:'var(--text-faint)' }}>{b.isbn}</td>
                <td style={s.tdBase}><GenreBadge genre={b.genre} /></td>
                <td style={s.tdBase}><CopiesBar available={b.available} copies={b.copies} /></td>
                <td style={s.tdBase}>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <BtnEdit onClick={() => openEdit(b)} />
                    <BtnDelete onClick={e => deleteBook(b.id, e)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={s.footer}>
          <span>Showing {list.length} of {books.length} books</span>
          <div style={{ display:'flex', gap:'6px' }}>
            {[1,2,'›'].map(p => (
              <button key={p} style={{
                width:'30px', height:'30px', borderRadius:'6px',
                border:'1px solid var(--border)', background: p===1 ? 'var(--gold-glow)' : 'transparent',
                color: p===1 ? 'var(--gold)' : 'var(--text-muted)',
                fontSize:'12px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Book' : 'Add New Book'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:500, display:'block', marginBottom:'6px' }}>Book Title</label>
            <input style={inputStyle} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Enter book title…" />
          </div>
          <div>
            <label style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:500, display:'block', marginBottom:'6px' }}>Author</label>
            <input style={inputStyle} value={form.author} onChange={e=>setForm(f=>({...f,author:e.target.value}))} placeholder="Author name" />
          </div>
          <div>
            <label style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:500, display:'block', marginBottom:'6px' }}>ISBN</label>
            <input style={inputStyle} value={form.isbn} onChange={e=>setForm(f=>({...f,isbn:e.target.value}))} placeholder="978-…" />
          </div>
          <div>
            <label style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:500, display:'block', marginBottom:'6px' }}>Genre</label>
            <select style={inputStyle} value={form.genre} onChange={e=>setForm(f=>({...f,genre:e.target.value}))}>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:500, display:'block', marginBottom:'6px' }}>Total Copies</label>
            <input style={inputStyle} type="number" min="1" value={form.copies} onChange={e=>setForm(f=>({...f,copies:e.target.value}))} />
          </div>
        </div>
        <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
          <BtnGhost onClick={() => setShowModal(false)}>Cancel</BtnGhost>
          <BtnPrimary onClick={saveBook}>{editing ? '💾 Save Changes' : '＋ Add Book'}</BtnPrimary>
        </div>
      </Modal>

      <Toast msg={toast.msg} show={toast.show} />
    </div>
  );
}
