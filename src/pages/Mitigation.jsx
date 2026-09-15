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

      <Panel eyebrow="TRANSFERENCIA DE ENERGÍA" title="De la onda al movimiento de la estructura">
        <div className="energy-explainer">
          <div className="energy-stage" aria-hidden="true">
            <div className="ground-line" />
            <span className="wave-pulse wave-one" />
            <span className="wave-pulse wave-two" />
            <span className="wave-pulse wave-three" />
            <div className="energy-building">
              <i /><i /><i /><i />
            </div>
            <span className="energy-orb orb-one" /><span className="energy-orb orb-two" /><span className="energy-orb orb-three" />
          </div>
          <div className="energy-copy">
            <div><span>1</span><p><strong>Energía cinética.</strong> El suelo acelera de un lado a otro y transmite movimiento a la base del edificio.</p></div>
            <div><span>2</span><p><strong>Respuesta dinámica.</strong> Por inercia, cada masa intenta conservar su posición. Aparecen fuerzas internas, deformación y deriva entre pisos.</p></div>
            <div><span>3</span><p><strong>Disipación y control.</strong> La rigidez almacena parte de la energía como energía elástica; el amortiguamiento y los disipadores convierten parte en calor y reducen la vibración.</p></div>
          </div>
        </div>
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
        .energy-explainer { display: grid; grid-template-columns: .85fr 1.15fr; gap: 22px; align-items: center; }
        .energy-stage { min-height: 240px; position: relative; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius-m); background: linear-gradient(180deg, #1d2730 0 70%, #141a20 70%); }
        .ground-line { position: absolute; left: 0; right: 0; bottom: 54px; height: 7px; background: #56616b; box-shadow: 0 4px 0 #303941; animation: ground-shift 1.4s ease-in-out infinite alternate; }
        .wave-pulse { position: absolute; bottom: 43px; width: 26px; height: 26px; border: 2px solid rgba(183, 142, 97, .8); border-radius: 50%; animation: wave-travel 2.4s linear infinite; }
        .wave-two { animation-delay: .8s; } .wave-three { animation-delay: 1.6s; }
        .energy-building { position: absolute; right: 22%; bottom: 61px; width: 84px; height: 142px; border: 4px solid #c6b496; border-bottom: 0; display: flex; flex-direction: column; justify-content: space-evenly; animation: building-sway 1.4s ease-in-out infinite alternate; transform-origin: bottom center; }
        .energy-building::before, .energy-building::after { content: ''; position: absolute; inset: 0 auto 0 20px; width: 3px; background: #c6b496; } .energy-building::after { left: auto; right: 20px; }
        .energy-building i { display: block; height: 3px; background: #c6b496; }
        .energy-orb { position: absolute; right: 7%; width: 10px; height: 10px; border-radius: 50%; background: var(--amber); box-shadow: 0 0 12px var(--amber); animation: energy-rise 1.8s ease-in infinite; }
        .orb-one { bottom: 88px; } .orb-two { bottom: 128px; animation-delay: .55s; } .orb-three { bottom: 168px; animation-delay: 1.1s; }
        .energy-copy { display: grid; gap: 11px; }
        .energy-copy > div { display: grid; grid-template-columns: 27px 1fr; gap: 10px; align-items: start; padding: 10px 12px; border: 1px solid var(--line-soft); border-radius: var(--radius-s); background: var(--bg-1); }
        .energy-copy span { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--amber-dim); color: var(--amber); font-family: var(--font-mono); font-size: 12px; }
        .energy-copy p { color: var(--ink-1); font-size: 12.5px; line-height: 1.5; } .energy-copy strong { color: var(--ink-0); }
        @keyframes ground-shift { from { transform: translateX(-8px); } to { transform: translateX(8px); } }
        @keyframes building-sway { from { transform: rotate(-2.3deg); } to { transform: rotate(2.3deg); } }
        @keyframes wave-travel { from { left: -30px; opacity: 0; transform: scale(.35); } 20% { opacity: 1; } to { left: 72%; opacity: 0; transform: scale(2.2); } }
        @keyframes energy-rise { 0% { transform: translate(-10px, 14px) scale(.4); opacity: 0; } 35% { opacity: 1; } 100% { transform: translate(8px, -28px) scale(1.2); opacity: 0; } }
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
          .controls-row, .energy-explainer { grid-template-columns: 1fr; }
          .system-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
