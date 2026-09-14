export function Topbar({ title, subtitle, onMenu }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Abrir menú">
        <span className="menu-bars" />
      </button>
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="topbar-sub">{subtitle}</p>}
      </div>
      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 22px 28px;
          border-bottom: 1px solid var(--line);
          background: var(--bg-0);
          position: sticky;
          top: 0;
          z-index: 5;
        }
        .topbar h2 { font-size: 20px; }
        .topbar-sub { font-size: 13px; color: var(--ink-2); margin-top: 3px; }
        .menu-btn {
          display: none;
          background: var(--bg-2);
          border: 1px solid var(--line);
          color: var(--ink-0);
          width: 38px; height: 38px;
          border-radius: var(--radius-m);
          position: relative;
        }
        .menu-bars, .menu-bars::before, .menu-bars::after {
          display: block;
          width: 16px;
          height: 1.5px;
          background: var(--ink-0);
          position: absolute;
          left: 10px;
        }
        .menu-bars { top: 18px; }
        .menu-bars::before { content: ''; top: -5px; }
        .menu-bars::after { content: ''; top: 5px; }
        @media (max-width: 900px) {
          .menu-btn { display: block; }
        }
      `}</style>
    </header>
  )
}
