import React, { useState } from 'react';

const INIT_BORROWS = [
  { id:1, book:'The Pragmatic Programmer', member:'Alice Johnson', issued:'2026-03-20', due:'2026-04-10', returned:false },
  { id:2, book:'Atomic Habits',            member:'Carol White',   issued:'2026-03-25', due:'2026-04-15', returned:false },
  { id:3, book:'Dune',                     member:'Alice Johnson', issued:'2026-03-01', due:'2026-03-21', returned:true  },
  { id:4, book:'Sapiens',                  member:'Bob Smith',     issued:'2026-02-15', due:'2026-03-07', returned:true  },
];

const today = new Date();

function isOverdue(due, returned) {
  if (returned) return false;
  return new Date(due) < today;
}

function daysLeft(due) {
  const diff = Math.ceil((new Date(due) - today) / (1000*60*60*24));
  return diff;
}

export default function Borrows() {
  const [borrows, setBorrows] = useState(INIT_BORROWS);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ show:false, msg:'' });

  function showToast(msg) {
    setToast({ show:true, msg });
    setTimeout(() => setToast(t=>({...t,show:false})), 3000);
  }

  function markReturned(id) {
    setBorrows(bs => bs.map(b => b.id===id ? {...b, returned:true} : b));
    showToast('Book marked as returned!');
  }

  const list = borrows.filter(b => {
    if (filter === 'active')   return !b.returned;
    if (filter === 'overdue')  return isOverdue(b.due, b.returned);
    if (filter === 'returned') return b.returned;
    return true;
  });

  const active   = borrows.filter(b => !b.returned).length;
  const overdue  = borrows.filter(b => isOverdue(b.due, b.returned)).length;
  const returned = borrows.filter(b => b.returned).length;

  const filterStyle = (f) => ({
    padding:'8px 18px', borderRadius:'var(--radius-sm)',
    border: filter===f ? '1px solid rgba(240,165,0,0.3)' : '1px solid var(--border)',
    background: filter===f ? 'var(--gold-glow)' : 'var(--surface)',
    color: filter===f ? 'var(--gold)' : 'var(--text-muted)',
    fontSize:'13px', fontWeight:500, cursor:'pointer',
    transition:'all 0.18s', fontFamily:"'DM Sans',sans-serif",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:'36px' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:700, color:'var(--text)' }}>Borrows</h1>
        <p style={{ fontSize:'14px', color:'var(--text-muted)', marginTop:'6px' }}>Track issued and returned books</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'28px' }}>
        {[
          { label:'Active Borrows', val:active,   accent:'#f0a500', icon:'↗' },
          { label:'Overdue',        val:overdue,  accent:'#f07060', icon:'⚠' },
          { label:'Returned',       val:returned, accent:'#5abf7e', icon:'✅' },
        ].map(c => (
          <div key={c.label} style={{
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', padding:'20px 22px',
            borderTop:`3px solid ${c.accent}`,
          }}>
            <span style={{ fontSize:'20px', display:'block', marginBottom:'10px' }}>{c.icon}</span>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:700, color:'var(--text)', lineHeight:1 }}>{c.val}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {[['all','All'],['active','Active'],['overdue','Overdue'],['returned','Returned']].map(([f,l]) => (
          <button key={f} style={filterStyle(f)} onClick={() => setFilter(f)}>{l}</button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {list.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px', color:'var(--text-faint)', fontSize:'15px',
            background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)' }}>
            No records found
          </div>
        )}
        {list.map(b => {
          const overdue = isOverdue(b.due, b.returned);
          const days = daysLeft(b.due);
          return (
            <div key={b.id} style={{
              background:'var(--surface)', border:`1px solid ${overdue ? 'rgba(240,112,96,0.25)' : 'var(--border)'}`,
              borderRadius:'var(--radius)', padding:'20px 22px',
              display:'flex', alignItems:'center', gap:'20px',
              transition:'transform 0.18s',
            }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateX(3px)'}
              onMouseLeave={e=>e.currentTarget.style.transform=''}
            >
              {/* Status indicator */}
              <div style={{
                width:'42px', height:'42px', borderRadius:'10px', flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
                background: b.returned ? 'rgba(90,191,126,0.12)' : overdue ? 'rgba(240,112,96,0.12)' : 'rgba(240,165,0,0.12)',
                border: `1px solid ${b.returned ? 'rgba(90,191,126,0.2)' : overdue ? 'rgba(240,112,96,0.2)' : 'rgba(240,165,0,0.2)'}`,
              }}>
                {b.returned ? '✅' : overdue ? '⚠' : '📖'}
              </div>

              {/* Info */}
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, color:'var(--text)', fontSize:'15px', marginBottom:'4px' }}>{b.book}</div>
                <div style={{ fontSize:'13px', color:'var(--text-muted)' }}>
                  👤 {b.member} &nbsp;·&nbsp; Issued: {new Date(b.issued).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                </div>
              </div>

              {/* Due / status */}
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:'12px', color:'var(--text-faint)', marginBottom:'4px' }}>Due Date</div>
                <div style={{
                  fontSize:'14px', fontWeight:600,
                  color: b.returned ? 'var(--green)' : overdue ? 'var(--coral)' : 'var(--text)',
                }}>
                  {new Date(b.due).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                </div>
                {!b.returned && (
                  <div style={{ fontSize:'11px', color: overdue ? 'var(--coral)' : 'var(--text-faint)', marginTop:'2px' }}>
                    {overdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
                  </div>
                )}
              </div>

              {/* Badge & action */}
              <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
                <span style={{
                  fontSize:'11px', padding:'4px 10px', borderRadius:'20px', fontWeight:500,
                  background: b.returned ? 'rgba(90,191,126,0.12)' : overdue ? 'rgba(240,112,96,0.12)' : 'rgba(240,165,0,0.12)',
                  color: b.returned ? 'var(--green)' : overdue ? 'var(--coral)' : 'var(--amber)',
                  border: `1px solid ${b.returned ? 'rgba(90,191,126,0.2)' : overdue ? 'rgba(240,112,96,0.2)' : 'rgba(240,165,0,0.2)'}`,
                }}>
                  {b.returned ? 'Returned' : overdue ? 'Overdue' : 'Active'}
                </span>
                {!b.returned && (
                  <button onClick={() => markReturned(b.id)} style={{
                    padding:'6px 12px', borderRadius:'var(--radius-sm)', fontSize:'12px', fontWeight:500,
                    background:'rgba(90,191,126,0.12)', color:'var(--green)',
                    border:'1px solid rgba(90,191,126,0.2)', cursor:'pointer',
                    transition:'all 0.15s', fontFamily:"'DM Sans',sans-serif",
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(90,191,126,0.22)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(90,191,126,0.12)'}
                  >↩ Return</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
