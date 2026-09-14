import { Panel, Button } from '../components/Panel.jsx'
import { useProgress } from '../hooks/useProgress.jsx'

export function Conclusions({ onNavigate }) {
  const { stats } = useProgress()

  return (
    <div className="stack">
      <Panel eyebrow="RECORRIDO" title="Progreso del laboratorio">
        <div className="score-row">
          <div className="score-big">
            <span className="readout score-num">{stats.sectionProgress}%</span>
            <span className="score-label">de secciones visitadas</span>
          </div>
        </div>
      </Panel>

      <Panel eyebrow="SÍNTESIS" title="Lo que recorriste">
        <p className="summary">
          Partiste de la acumulación de esfuerzo en las placas tectónicas —incluido el Cinturón de
          Fuego y el margen de Colombia y Venezuela—, viste cómo esa energía se libera como ondas
          P, S, Love y Rayleigh, cómo el tipo de suelo transforma esa señal, y cómo un pórtico de
          cortante de varios grados de libertad responde según su primer modo y su amortiguamiento.
          Los disipadores y el aislamiento sísmico modifican esa respuesta. Los valores son
          aproximaciones educativas y no sustituyen un análisis estructural profesional.
        </p>
        <div className="cta-row">
          <Button onClick={() => onNavigate('simulador')}>Volver al simulador</Button>
          <Button variant="ghost" onClick={() => onNavigate('inicio')}>Volver al inicio</Button>
        </div>
      </Panel>

      <style>{`
        .stack { display: flex; flex-direction: column; gap: 20px; }
        .score-row { display: flex; gap: 30px; align-items: center; flex-wrap: wrap; }
        .score-big { display: flex; flex-direction: column; align-items: flex-start; }
        .score-num { font-size: 46px; font-weight: 700; color: var(--amber); }
        .score-label { font-size: 13px; color: var(--ink-2); }
        .summary { color: var(--ink-1); font-size: 13.5px; line-height: 1.7; max-width: 74ch; margin-bottom: 18px; }
        .cta-row { display: flex; gap: 10px; }
      `}</style>
    </div>
  )
}
