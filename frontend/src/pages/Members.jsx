import React, { useState } from 'react';
import Modal from '../components/Modal';

const COLORS = ['#2dcaad','#8b7ff0','#f07060','#f0a500','#e87bb0','#5abf7e'];

const INIT_MEMBERS = [
  { id:1, name:'Alice Johnson', email:'alice@example.com', phone:'555-0101', joined:'2024-01-15', borrowed:2 },
  { id:2, name:'Bob Smith',     email:'bob@example.com',   phone:'555-0102', joined:'2024-02-20', borrowed:0 },
  { id:3, name:'Carol White',   email:'carol@example.com', phone:'555-0103', joined:'2024-03-10', borrowed:1 },
  { id:4, name:'David Lee',     email:'david@example.com', phone:'555-0104', joined:'2024-04-01', borrowed:0 },
];

function initials(name) {
  return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
}

const inputStyle = {
  width:'100%', background:'var(--surface2)', border:'1px solid var(--border)',
  borderRadius:'var(--radius-sm)', padding:'10px 14px', color:'var(--text)',
  fontSize:'14px', outline:'none', fontFamily:"'DM Sans',sans-serif",
};

const labelStyle = { fontSize:'12px', color:'var(--text-muted)', fontWeight:500, display:'block', marginBottom:'6px' };

function Btn({ children, onClick, variant='primary' }) {
  const [h, setH] = useState(false);
  const styles = {
    primary: {
      background: h ? '#ffc43d' : 'var(--gold)', color:'#0f0e17',
      boxShadow: h ? '0 0 28px rgba(240,165,0,0.4)' : '0 0 16px rgba(240,165,0,0.2)',
      border:'none',
    },
    ghost: {
      background: h ? 'rgba(255,255,255,0.07)' : 'var(--surface2)',
      color: h ? 'var(--text)' : 'var(--text-muted)',
      border:'1px solid var(--border)',
    },
    danger: {
      background: h ? 'rgba(240,112,96,0.25)' : 'rgba(240,112,96,0.12)',
      color:'#f07060', border:'1px solid rgba(240,112,96,0.2)',
    },
  };
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'inline-flex', alignItems:'center', gap:'6px',
        padding:'8px 16px', borderRadius:'var(--radius-sm)',
        fontSize:'13px', fontWeight:500, cursor:'pointer',
        transition:'all 0.18s', fontFamily:"'DM Sans',sans-serif",
        transform: h && variant==='primary' ? 'translateY(-1px)' : 'none',
        ...styles[variant],
      }}>{children}</button>
  );
}

export default function Members() {
  const [members, setMembers] = useState(INIT_MEMBERS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'' });
  const [toast, setToast] = useState({ show:false, msg:'' });

  function showToast(msg) {
    setToast({ show:true, msg });
    setTimeout(() => setToast(t=>({...t, show:false})), 3000);
  }

  const list = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEditing(null); setForm({ name:'', email:'', phone:'' }); setShowModal(true); }
  function openEdit(m) { setEditing(m.id); setForm({ name:m.name, email:m.email, phone:m.phone }); setShowModal(true); }
  function save() {
    if (!form.name.trim()) return;
    if (editing) {
      setMembers(ms => ms.map(m => m.id===editing ? {...m,...form} : m));
      showToast(`${form.name} updated!`);
    } else {
      const id = members.length ? Math.max(...members.map(m=>m.id))+1 : 1;
      setMembers(ms => [...ms, { id, ...form, joined: new Date().toISOString().slice(0,10), borrowed:0 }]);
      showToast(`${form.name} added!`);
    }
    setShowModal(false);
  }
  function del(id, e) {
    e.stopPropagation();
    const m = members.find(x=>x.id===id);
    if (!window.confirm(`Remove ${m.name}?`)) return;
    setMembers(ms => ms.filter(x=>x.id!==id));
    showToast(`${m.name} removed.`);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'36px' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:700, color:'var(--text)' }}>Members</h1>
          <p style={{ fontSize:'14px', color:'var(--text-muted)', marginTop:'6px' }}>{members.length} registered members</p>
        </div>
        <Btn onClick={openAdd}>＋ Add Member</Btn>
      </div>

      {/* Search */}
      <div style={{ position:'relative', maxWidth:'360px', marginBottom:'24px' }}>
        <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-faint)' }}>🔍</span>
        <input style={{ ...inputStyle, paddingLeft:'40px' }}
          value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search members…" />
      </div>

      {/* Cards grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px' }}>
        {list.map((m, i) => (
          <div key={m.id} style={{
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', padding:'22px', position:'relative',
            transition:'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
              <div style={{
                width:'46px', height:'46px', borderRadius:'50%',
                background: COLORS[i % COLORS.length] + '22',
                border:`2px solid ${COLORS[i % COLORS.length]}44`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:700, fontSize:'15px', color: COLORS[i % COLORS.length],
                flexShrink:0,
              }}>{initials(m.name)}</div>
              <div>
                <div style={{ fontWeight:600, color:'var(--text)', fontSize:'15px' }}>{m.name}</div>
                <div style={{ fontSize:'12px', color:'var(--text-faint)', marginTop:'2px' }}>
                  Member since {new Date(m.joined).toLocaleDateString('en-US',{month:'short',year:'numeric'})}
                </div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'16px', paddingBottom:'16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                <span style={{ fontSize:'13px', color:'var(--text-faint)', width:'16px' }}>✉</span>
                <span style={{ fontSize:'13px', color:'var(--text-muted)' }}>{m.email}</span>
              </div>
              <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                <span style={{ fontSize:'13px', color:'var(--text-faint)', width:'16px' }}>📞</span>
                <span style={{ fontSize:'13px', color:'var(--text-muted)' }}>{m.phone}</span>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{
                fontSize:'12px', padding:'4px 10px', borderRadius:'20px',
                background: m.borrowed > 0 ? 'rgba(240,165,0,0.12)' : 'rgba(90,191,126,0.12)',
                color: m.borrowed > 0 ? 'var(--amber)' : 'var(--green)',
                border: `1px solid ${m.borrowed > 0 ? 'rgba(240,165,0,0.2)' : 'rgba(90,191,126,0.2)'}`,
              }}>
                {m.borrowed > 0 ? `${m.borrowed} book${m.borrowed>1?'s':''} borrowed` : 'No active borrows'}
              </span>
              <div style={{ display:'flex', gap:'8px' }}>
                <Btn variant="ghost" onClick={() => openEdit(m)}>✏</Btn>
                <Btn variant="danger" onClick={e => del(m.id, e)}>✕</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Member' : 'Add Member'}>
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name" />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@example.com" />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="555-0100" />
          </div>
        </div>
        <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
          <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={save}>{editing ? '💾 Save' : '＋ Add Member'}</Btn>
        </div>
      </Modal>

      {/* Toast */}
      <div style={{
        position:'fixed', bottom:'24px', right:'24px',
        background:'var(--surface)', border:'1px solid rgba(90,191,126,0.3)',
        borderLeft:'3px solid #5abf7e', borderRadius:'10px',
        padding:'14px 20px', fontSize:'14px', color:'var(--text)', zIndex:9999,
        opacity: toast.show ? 1 : 0, transform: toast.show ? 'translateY(0)' : 'translateY(12px)',
        transition:'all 0.3s ease', display:'flex', alignItems:'center', gap:'10px',
        boxShadow:'0 8px 32px rgba(0,0,0,0.4)', pointerEvents:'none',
      }}>✅ {toast.msg}</div>
    </div>
  );
}
