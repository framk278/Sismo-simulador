import { useProgress } from '../hooks/useProgress.jsx'

const NAV = [
  { id: 'inicio', label: 'Inicio', icon: '01' },
  { id: 'tectonica', label: 'Contexto tectónico', icon: '02' },
  { id: 'ondas', label: 'Ondas mecánicas', icon: '03' },
  { id: 'suelo', label: 'Medios y efectos de sitio', icon: '04' },
  { id: 'mitigacion', label: 'Mitigación estructural', icon: '05' },
  { id: 'laboratorio', label: 'Laboratorio masa-resorte', icon: '06' },
  { id: 'simulador', label: 'Simulador sísmico', icon: '07' },
  { id: 'conclusiones', label: 'Conclusiones', icon: '08' },
]

export function Sidebar({ current, onNavigate, open, onClose }) {
  const { visited, stats } = useProgress()

  return (
    <>
      {open && <div className="scrim" onClick={onClose} />}
      <nav className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div>
            <div className="brand-name">Sismolab</div>
            <div className="brand-sub">Laboratorio virtual</div>
          </div>
        </div>

        <div className="nav-list">
          {NAV.map((item) => (
            <button
              key={item.id}
              className="nav-item"
              data-active={current === item.id}
              onClick={() => {
                onNavigate(item.id)
                onClose?.()
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {visited.has(item.id) && <span className="nav-dot" />}
            </button>
          ))}
        </div>

        <div className="sidebar-foot">
          <div className="foot-row">
            <span>Progreso</span>
            <span className="readout">{stats.sectionProgress}%</span>
          </div>
          <div className="foot-bar">
            <div className="foot-bar-fill" style={{ width: `${stats.sectionProgress}%` }} />
          </div>
        </div>
      </nav>

      <style>{`
        .scrim {
          position: fixed; inset: 0; background: #000a; z-index: 20;
          display: none;
        }
        .sidebar {
          width: 250px;
          flex-shrink: 0;
          background: var(--bg-1);
          border-right: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 18px;
          border-bottom: 1px solid var(--line);
        }
        .brand-mark {
          width: 84px;
          height: 28px;
          display: block;
          border-radius: 6px;
          background: transparent;
          border: none;
          padding: 0;
          object-fit: contain;
          flex-shrink: 0;
        }
        .brand-name { font-weight: 700; font-size: 15px; }
        .brand-sub { font-size: 11px; color: var(--ink-2); }
        .nav-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          color: var(--ink-1);
          padding: 10px 10px;
          border-radius: var(--radius-m);
          text-align: left;
          font-size: 13.5px;
          position: relative;
        }
        .nav-item:hover { background: var(--bg-2); color: var(--ink-0); }
        .nav-item[data-active="true"] {
          background: var(--amber-dim);
          color: var(--amber);
        }
        .nav-icon { width: 22px; font-family: var(--font-mono); font-size: 11px; color: var(--ink-2); }
        .nav-item[data-active="true"] .nav-icon { color: var(--amber); }
        .nav-label { flex: 1; }
        .nav-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); }
        .sidebar-foot {
          padding: 16px 18px 20px;
          border-top: 1px solid var(--line);
        }
        .foot-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--ink-1);
          margin-bottom: 6px;
        }
        .foot-bar {
          height: 5px;
          background: var(--bg-3);
          border-radius: 3px;
          overflow: hidden;
        }
        .foot-bar-fill {
          height: 100%;
          background: var(--amber);
          transition: width .4s ease;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -260px;
            top: 0;
            z-index: 30;
            transition: left .2s ease;
          }
          .sidebar.open { left: 0; }
          .scrim { display: block; }
        }
      `}</style>
    </>
  )
}
