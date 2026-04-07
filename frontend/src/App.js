import React, { useState } from 'react';
import './index.css';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Borrows from './pages/Borrows';

const sidebarStyles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0,
    zIndex: 100,
  },
  logo: {
    padding: '28px 24px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '36px', height: '36px',
    background: 'linear-gradient(135deg, #f0a500, #e07800)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px',
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text)',
  },
  nav: { padding: '20px 12px', flex: 1 },
  navLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-faint)',
    padding: '0 12px',
    marginBottom: '8px',
    marginTop: '16px',
    display: 'block',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid var(--border)',
  },
  userCard: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '34px', height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--violet), var(--teal))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 600, color: 'white',
    flexShrink: 0,
  },
};

function NavItem({ icon, label, badge, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    color: active ? 'var(--gold)' : hovered ? 'var(--text)' : 'var(--text-muted)',
    background: active ? 'var(--gold-glow)' : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
    border: active ? '1px solid rgba(240,165,0,0.2)' : '1px solid transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 400,
    marginBottom: '2px',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.18s ease',
    fontFamily: "'DM Sans', sans-serif",
  };
  return (
    <button style={style} onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{icon}</span>
      {label}
      {badge != null && (
        <span style={{
          marginLeft: 'auto', background: 'var(--gold)', color: '#000',
          fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px'
        }}>{badge}</span>
      )}
    </button>
  );
}

const PAGES = ['dashboard', 'books', 'members', 'borrows'];

export default function App() {
  const [page, setPage] = useState('dashboard');

  const pageMap = {
    dashboard: <Dashboard onNavigate={setPage} />,
    books:     <Books />,
    members:   <Members />,
    borrows:   <Borrows />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={sidebarStyles.sidebar}>
        <div style={sidebarStyles.logo}>
          <div style={sidebarStyles.logoIcon}>📚</div>
          <span style={sidebarStyles.logoText}>
            Library<span style={{ color: 'var(--gold)' }}>OS</span>
          </span>
        </div>

        <nav style={sidebarStyles.nav}>
          <span style={sidebarStyles.navLabel}>Main</span>
          <NavItem icon="⊞" label="Dashboard" active={page==='dashboard'} onClick={() => setPage('dashboard')} />
          <NavItem icon="📖" label="Books"     active={page==='books'}     onClick={() => setPage('books')}     badge={8} />
          <NavItem icon="👤" label="Members"   active={page==='members'}   onClick={() => setPage('members')}   badge={4} />
          <NavItem icon="↩" label="Borrows"   active={page==='borrows'}   onClick={() => setPage('borrows')} />

          <span style={{ ...sidebarStyles.navLabel, marginTop: '24px' }}>System</span>
          <NavItem icon="📊" label="Reports"  active={false} onClick={() => {}} />
          <NavItem icon="⚙"  label="Settings" active={false} onClick={() => {}} />
        </nav>

        <div style={sidebarStyles.footer}>
          <div style={sidebarStyles.userCard}>
            <div style={sidebarStyles.avatar}>AD</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>Admin</div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Librarian</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Page content */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '36px 40px', minHeight: '100vh' }}>
        {pageMap[page]}
      </main>
    </div>
  );
}
