export function Panel({ title, eyebrow, children, accent = 'cyan', className = '', right }) {
  return (
    <section className={`panel ${className}`}>
      {(title || right) && (
        <header className="panel-head">
          <div>
            {eyebrow && <div className="panel-eyebrow" style={{ color: `var(--${accent})` }}>{eyebrow}</div>}
            {title && <h3>{title}</h3>}
          </div>
          {right}
        </header>
      )}
      <div className="panel-body">{children}</div>

      <style>{`
        .panel {
          background: linear-gradient(180deg, rgba(31, 38, 45, 0.96), rgba(24, 29, 35, 0.96));
          border: 1px solid var(--line);
          border-radius: var(--radius-l);
          padding: 20px;
          box-shadow: var(--shadow-soft);
        }
        .panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .panel-eyebrow {
          font-size: 12px;
          font-family: var(--font-mono);
          margin-bottom: 4px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .panel-body { min-width: 0; }
      `}</style>
    </section>
  )
}

export function StatChip({ label, value, unit, accent = 'ink-0' }) {
  return (
    <div className="stat-chip">
      <span className="stat-label">{label}</span>
      <span className="stat-value readout" style={{ color: `var(--${accent})` }}>
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </span>
      <style>{`
        .stat-chip {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 14px;
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: var(--radius-m);
          min-width: 92px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
        }
        .stat-label {
          font-size: 11px;
          color: var(--ink-2);
        }
        .stat-value {
          font-size: 19px;
          font-weight: 600;
        }
        .stat-unit {
          font-size: 12px;
          margin-left: 3px;
          color: var(--ink-2);
        }
      `}</style>
    </div>
  )
}

export function Slider({ label, value, min, max, step = 1, unit, onChange, accent = 'cyan' }) {
  return (
    <label className="slider">
      <div className="slider-row">
        <span>{label}</span>
        <span className="readout slider-value" style={{ color: `var(--${accent})` }}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ accentColor: `var(--${accent})` }}
      />
      <style>{`
        .slider {
          display: block;
          margin-bottom: 14px;
        }
        .slider-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--ink-1);
          margin-bottom: 6px;
        }
        .slider-value { font-weight: 600; }
        input[type="range"] {
          width: 100%;
          cursor: pointer;
          opacity: 0.9;
        }
      `}</style>
    </label>
  )
}

export function Pill({ children, active, onClick, accent = 'cyan' }) {
  return (
    <button
      className="pill"
      onClick={onClick}
      data-active={active}
      style={active ? { borderColor: `var(--${accent})`, color: `var(--${accent})`, background: `var(--${accent}-dim)` } : undefined}
    >
      {children}
      <style>{`
        .pill {
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.02);
          color: var(--ink-1);
          font-size: 13px;
          font-family: var(--font-ui);
          transition: border-color .15s ease, color .15s ease, background .15s ease, transform .15s ease;
        }
        .pill:hover {
          border-color: var(--ink-2);
          transform: translateY(-1px);
        }
      `}</style>
    </button>
  )
}

export function Button({ children, onClick, variant = 'primary', disabled, type = 'button' }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} disabled={disabled} type={type}>
      {children}
      <style>{`
        .btn {
          padding: 11px 20px;
          border-radius: var(--radius-m);
          font-size: 14px;
          font-weight: 600;
          border: 1px solid transparent;
          transition: transform .12s ease, opacity .15s ease, border-color .15s ease;
        }
        .btn:active:not(:disabled) { transform: scale(0.98); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-primary { background: var(--amber); color: #17120f; box-shadow: 0 8px 18px rgba(183, 142, 97, 0.18); }
        .btn-secondary { background: var(--bg-1); color: var(--ink-0); border-color: var(--line); }
        .btn-ghost { background: transparent; color: var(--ink-1); border-color: var(--line); }
      `}</style>
    </button>
  )
}
