import React, { useEffect } from 'react';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:'fixed', inset:0,
        background:'rgba(0,0,0,0.72)',
        backdropFilter:'blur(4px)',
        zIndex:500,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'16px',
      }}>
      <div style={{
        background:'var(--surface)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:'16px',
        width:'480px', maxWidth:'100%',
        padding:'32px',
        animation:'modalIn 0.22s ease',
      }}>
        <style>{`
          @keyframes modalIn {
            from { opacity:0; transform:scale(0.95) translateY(10px); }
            to   { opacity:1; transform:scale(1) translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:600, color:'var(--text)' }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            width:'28px', height:'28px',
            background:'var(--surface2)', border:'1px solid var(--border)',
            borderRadius:'6px', cursor:'pointer',
            color:'var(--text-muted)', fontSize:'15px',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:"'DM Sans',sans-serif",
          }}>✕</button>
        </div>

        {children}
      </div>
    </div>
  );
}
