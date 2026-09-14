import { useState } from 'react'
import { Panel, Slider, Pill, Button, StatChip } from '../components/Panel.jsx'
import { StructureAnimation, computeStructureMetrics } from '../simulations/StructureAnimation.jsx'
import { STRUCTURAL_SYSTEMS } from '../data/structuralSystems.js'

export function Mitigation() {
  const [floors, setFloors] = useState(5)
  const [excitationFreq, setExcitationFreq] = useState(1.5)
  const [intensity, setIntensity] = useState(1)
  const [system, setSystem] = useState('convencional')
  const [running, setRunning] = useState(true)

  const metrics = computeStructureMetrics({ floors, excitationFreq, system })

  return (
    <div className="stack">
      <Panel eyebrow="CONCEPTO" title="¿Qué ocurre cuando la onda llega a una estructura?">
        <p className="lead">
          El modelo representa un edificio de cortante con masas concentradas en cada nivel y
          rigideces de entrepiso que evolucionan con la deformación lateral. La respuesta depende
          de la frecuencia de excitación, del período fundamental y del amortiguamiento real del
          sistema, además de si se incorpora aislamiento o disipación.
        </p>
      </Panel>

      <Panel
        eyebrow="SIMULACIÓN"
        title="Modelo realista de pórtico de cortante con excitación sísmica"
        right={<Button variant="secondary" onClick={() => setRunning((r) => !r)}>{running ? 'Pausar' : 'Reanudar'}</Button>}
      >
        <div className="pill-row">
          {STRUCTURAL_SYSTEMS.map((s) => (
            <Pill key={s.id} active={system === s.id} onClick={() => setSystem(s.id)} accent="cyan">
              {s.name}
            </Pill>
          ))}
        </div>
        <StructureAnimation floors={floors} excitationFreq={excitationFreq} system={system} running={running} excitationIntensity={intensity} height={360} />

        <div className="controls-row">
          <Slider label="Número de pisos" value={floors} min={1} max={15} step={1} onChange={setFloors} />
          <Slider label="Frecuencia del sismo" value={excitationFreq} min={0.2} max={4} step={0.1} onChange={setExcitationFreq} unit=" Hz" accent="amber" />
          <Slider label="Intensidad del sismo" value={intensity} min={0.2} max={3} step={0.1} onChange={setIntensity} unit="×" accent="amber" />
        </div>

        <div className="stats-row">
          <StatChip label="Periodo T1" value={metrics.period.toFixed(2)} unit=" s" />
          <StatChip label="Frecuencia natural" value={metrics.naturalFreq.toFixed(2)} unit=" Hz" />
          <StatChip label="Relación r = f·T1" value={metrics.frequencyRatio.toFixed(2)} />
          <StatChip label="Amortiguamiento ζ" value={(metrics.dampingRatio * 100).toFixed(0)} unit="%" />
          <StatChip label="Amplificación (1er modo)" value={metrics.amplification.toFixed(2)} unit="×" accent="amber" />
        </div>
        <p className="caption">
          El color de las columnas se intensifica con la deriva de entrepiso. Los disipadores
          añaden amortiguamiento viscoso entre pisos; el aislamiento introduce un grado de libertad
          flexible en la base (T1 ≈ 2,5 s). La <strong>intensidad</strong> controla cuánto se mueve
          el modelo; la <strong>frecuencia</strong> permite explorar la resonancia, cuya respuesta
          máxima aparece al acercarse a la frecuencia natural del edificio.
        </p>
      </Panel>

      <Panel eyebrow="SISTEMAS" title="Disipación y aislamiento sísmico">
        <div className="system-grid">
          {STRUCTURAL_SYSTEMS.map((s) => (
            <div className="system-card" key={s.id} data-active={system === s.id}>
              <strong>{s.name}</strong>
              <p>{s.recommendedFor}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="COMPARACIÓN" title="Sistemas estructurales frente a frente">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sistema</th>
                <th>Costo relativo</th>
                <th>Complejidad</th>
                <th>Reducción de movimiento</th>
                <th>Ventaja clave</th>
                <th>Desventaja clave</th>
              </tr>
            </thead>
            <tbody>
              {STRUCTURAL_SYSTEMS.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{'$'.repeat(s.relativeCost)}</td>
                  <td>{s.complexity}</td>
                  <td>{s.reduction}</td>
                  <td>{s.pros[0]}</td>
                  <td>{s.cons[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="footnote">
          La selección real de un sistema estructural requiere diseño y análisis de ingeniería
          detallado; esta comparación es orientativa y educativa.
        </p>
      </Panel>

      <style>{`
        .stack { display: flex; flex-direction: column; gap: 20px; }
        .lead { color: var(--ink-1); font-size: 13.5px; max-width: 70ch; }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .controls-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 16px; }
        .stats-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }
        .caption { font-size: 13px; color: var(--ink-1); margin-top: 14px; }
        .system-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .system-card { background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m); padding: 16px; }
        .system-card[data-active="true"] { border-color: var(--cyan); }
        .system-card strong { display: block; margin-bottom: 6px; font-size: 14px; }
        .system-card p { font-size: 12.5px; color: var(--ink-2); }
        .table-wrap { overflow-x: auto; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--line-soft); white-space: nowrap; }
        th { color: var(--ink-2); font-weight: 500; font-size: 11.5px; text-transform: none; }
        td { color: var(--ink-1); }
        .footnote { font-size: 12px; color: var(--ink-2); }

        @media (max-width: 900px) {
          .controls-row { grid-template-columns: 1fr; }
          .system-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
