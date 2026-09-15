import { useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts'
import { Panel, Slider, Button, StatChip } from '../components/Panel.jsx'
import { MassSpring, computeDynamics } from '../simulations/MassSpring.jsx'

let expId = 0

const EXCEL_LAB_DATA = [
  { test: 1, mass: 0.75, angularFrequency: 3.796, elongation: 0.68, springForce: 7.35, springConstant: 10.809 },
  { test: 2, mass: 0.77, angularFrequency: 3.769, elongation: 0.69, springForce: 7.546, springConstant: 10.936 },
  { test: 3, mass: 0.79, angularFrequency: 3.715, elongation: 0.71, springForce: 7.742, springConstant: 10.904 },
  { test: 4, mass: 0.81, angularFrequency: 3.664, elongation: 0.73, springForce: 7.938, springConstant: 10.874 },
  { test: 5, mass: 0.83, angularFrequency: 3.615, elongation: 0.75, springForce: 8.134, springConstant: 10.845 },
  { test: 6, mass: 0.85, angularFrequency: 3.568, elongation: 0.77, springForce: 8.33, springConstant: 10.818 },
  { test: 7, mass: 0.87, angularFrequency: 3.522, elongation: 0.79, springForce: 8.526, springConstant: 10.792 },
  { test: 8, mass: 0.89, angularFrequency: 3.478, elongation: 0.81, springForce: 8.722, springConstant: 10.768 },
  { test: 9, mass: 0.91, angularFrequency: 3.436, elongation: 0.83, springForce: 8.918, springConstant: 10.745 },
  { test: 10, mass: 0.93, angularFrequency: 3.395, elongation: 0.85, springForce: 9.114, springConstant: 10.722 },
]

export function MassSpringLab() {
  const [mass, setMass] = useState(5)
  const [stiffness, setStiffness] = useState(200)
  const [damping, setDamping] = useState(4)
  const [force, setForce] = useState(30)
  const [running, setRunning] = useState(true)
  const [experiments, setExperiments] = useState([])

  const dyn = computeDynamics({ mass, stiffness, damping, force })

  function addExperiment() {
    expId += 1
    setExperiments((prev) => [
      ...prev,
      {
        id: expId,
        mass,
        stiffness,
        damping,
        period: dyn.zeta < 1 ? dyn.period : null,
        frequency: dyn.zeta < 1 ? dyn.freq : null,
        amplitude: Math.abs(dyn.x0).toFixed(2),
      },
    ])
  }

  function removeExperiment(id) {
    setExperiments((prev) => prev.filter((e) => e.id !== id))
  }

  const massVsPeriod = experiments
    .filter((e) => e.period)
    .map((e) => ({ mass: e.mass, period: Number(e.period.toFixed(3)) }))
    .sort((a, b) => a.mass - b.mass)

  const stiffnessVsFreq = experiments
    .filter((e) => e.frequency)
    .map((e) => ({ stiffness: e.stiffness, frequency: Number(e.frequency.toFixed(3)) }))
    .sort((a, b) => a.stiffness - b.stiffness)

  return (
    <div className="stack">
      <Panel eyebrow="LABORATORIO" title="Sistema masa-resorte">
        <p className="lead">
          Ajusta la masa, la rigidez del resorte, el amortiguamiento y la fuerza aplicada. La masa
          se libera desde el desplazamiento estático x₀ = F/k y oscila con amortiguamiento real.
        </p>
        <MassSpring mass={mass} stiffness={stiffness} damping={damping} force={force} running={running} />

        <div className="controls-grid">
          <Slider label="Masa (m)" value={mass} min={1} max={30} step={0.5} onChange={setMass} unit=" kg" />
          <Slider label="Rigidez del resorte (k)" value={stiffness} min={20} max={500} step={5} onChange={setStiffness} unit=" N/m" accent="cyan" />
          <Slider label="Amortiguamiento (c)" value={damping} min={0} max={40} step={0.5} onChange={setDamping} unit=" N·s/m" accent="violet" />
          <Slider label="Fuerza aplicada (F)" value={force} min={5} max={100} step={1} onChange={setForce} unit=" N" accent="amber" />
        </div>

        <div className="stats-row">
          <StatChip label="Período (T)" value={dyn.zeta < 1 ? dyn.period.toFixed(2) : '—'} unit=" s" />
          <StatChip label="Frecuencia (f)" value={dyn.zeta < 1 ? dyn.freq.toFixed(2) : '—'} unit=" Hz" accent="cyan" />
          <StatChip label="Desplazamiento (x₀)" value={dyn.x0.toFixed(2)} unit=" m" accent="amber" />
          <StatChip label="Amortiguamiento (ζ)" value={dyn.zeta.toFixed(2)} accent={dyn.zeta >= 1 ? 'red' : 'ink-0'} />
        </div>
        {dyn.zeta >= 1 && <p className="warn">Sistema sobreamortiguado: la masa regresa al reposo sin oscilar.</p>}

        <div className="actions-row">
          <Button variant="secondary" onClick={() => setRunning((r) => !r)}>{running ? 'Pausar' : 'Reanudar'}</Button>
          <Button onClick={addExperiment}>Registrar experimento</Button>
        </div>
      </Panel>

      <Panel eyebrow="REGISTRO" title="Tabla de experimentos">
        {experiments.length === 0 ? (
          <p className="empty">Aún no has registrado experimentos. Ajusta los parámetros y presiona "Registrar experimento".</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Masa (kg)</th>
                  <th>Rigidez (N/m)</th>
                  <th>Período (s)</th>
                  <th>Frecuencia (Hz)</th>
                  <th>Amplitud (m)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {experiments.map((e, i) => (
                  <tr key={e.id}>
                    <td>{i + 1}</td>
                    <td>{e.mass}</td>
                    <td>{e.stiffness}</td>
                    <td>{e.period ? e.period.toFixed(3) : '—'}</td>
                    <td>{e.frequency ? e.frequency.toFixed(3) : '—'}</td>
                    <td>{e.amplitude}</td>
                    <td><button className="del-btn" onClick={() => removeExperiment(e.id)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <details className="source-graphs">
        <summary>
          <span>
            <span className="details-eyebrow">DATOS DEL LABORATORIO</span>
            <strong>Ver gráficas de la práctica</strong>
          </span>
          <span className="details-hint">Abrir</span>
        </summary>
        <div className="source-graphs-content">
          <p className="source-graphs-note">Gráficas recreadas con los 10 registros de <em>Lab 1 Física Gráficas.xlsx</em>.</p>
          <div className="source-chart-grid">
            <Panel eyebrow="LEY DE HOOKE" title="Fuerza del resorte vs. elongación">
              <ResponsiveContainer width="100%" height={230}>
                <ScatterChart margin={{ top: 8, right: 12, left: -8, bottom: 8 }}>
                  <CartesianGrid stroke="#2b3239" />
                  <XAxis dataKey="elongation" name="Elongación" unit=" m" stroke="#8e98a1" fontSize={12} />
                  <YAxis dataKey="springForce" name="Fuerza" unit=" N" stroke="#8e98a1" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#181d23', border: '1px solid #3a434d' }} />
                  <Scatter data={EXCEL_LAB_DATA} fill="#b78e61" line={{ stroke: '#b78e61' }} />
                </ScatterChart>
              </ResponsiveContainer>
            </Panel>
            <Panel eyebrow="RIGIDEZ" title="Constante del resorte por prueba">
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={EXCEL_LAB_DATA} margin={{ top: 8, right: 12, left: -8, bottom: 8 }}>
                  <CartesianGrid stroke="#2b3239" />
                  <XAxis dataKey="test" name="Prueba" stroke="#8e98a1" fontSize={12} />
                  <YAxis dataKey="springConstant" name="Constante" unit=" N/m" stroke="#8e98a1" fontSize={12} domain={['dataMin - 0.05', 'dataMax + 0.05']} />
                  <Tooltip contentStyle={{ background: '#181d23', border: '1px solid #3a434d' }} />
                  <Line type="monotone" dataKey="springConstant" name="Constante" stroke="#7e8f9c" strokeWidth={2.5} dot={{ r: 3.5, fill: '#7e8f9c' }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
            <Panel eyebrow="OSCILACIÓN" title="Frecuencia angular vs. masa">
              <ResponsiveContainer width="100%" height={230}>
                <ScatterChart margin={{ top: 8, right: 12, left: -8, bottom: 8 }}>
                  <CartesianGrid stroke="#2b3239" />
                  <XAxis dataKey="mass" name="Masa" unit=" kg" stroke="#8e98a1" fontSize={12} />
                  <YAxis dataKey="angularFrequency" name="Frecuencia angular" unit=" rad/s" stroke="#8e98a1" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#181d23', border: '1px solid #3a434d' }} />
                  <Scatter data={EXCEL_LAB_DATA} fill="#8a7d96" line={{ stroke: '#8a7d96' }} />
                </ScatterChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </div>
      </details>

      {experiments.length > 1 && (
        <div className="grid-2">
          <Panel eyebrow="GRÁFICO" title="Masa vs período">
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart margin={{ left: -10 }}>
                <CartesianGrid stroke="#1c2536" />
                <XAxis dataKey="mass" name="Masa" unit=" kg" stroke="#6d7994" fontSize={12} />
                <YAxis dataKey="period" name="Período" unit=" s" stroke="#6d7994" fontSize={12} />
                <Tooltip contentStyle={{ background: '#151c2b', border: '1px solid #263148' }} />
                <Scatter data={massVsPeriod} fill="#7a8b9a" line />
              </ScatterChart>
            </ResponsiveContainer>
          </Panel>
          <Panel eyebrow="GRÁFICO" title="Rigidez vs frecuencia">
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart margin={{ left: -10 }}>
                <CartesianGrid stroke="#1c2536" />
                <XAxis dataKey="stiffness" name="Rigidez" unit=" N/m" stroke="#6d7994" fontSize={12} />
                <YAxis dataKey="frequency" name="Frecuencia" unit=" Hz" stroke="#6d7994" fontSize={12} />
                <Tooltip contentStyle={{ background: '#151c2b', border: '1px solid #263148' }} />
                <Scatter data={stiffnessVsFreq} fill="#c4a574" line />
              </ScatterChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      )}

      <style>{`
        .stack { display: flex; flex-direction: column; gap: 20px; }
        .lead { color: var(--ink-1); font-size: 13.5px; margin-bottom: 14px; max-width: 62ch; }
        .controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 16px 0 6px; }
        .stats-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
        .warn { color: var(--red); font-size: 12.5px; margin-bottom: 10px; }
        .actions-row { display: flex; gap: 10px; }
        .empty { color: var(--ink-2); font-size: 13px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { text-align: left; padding: 9px 12px; border-bottom: 1px solid var(--line-soft); white-space: nowrap; }
        th { color: var(--ink-2); font-weight: 500; font-size: 11.5px; }
        td { color: var(--ink-1); }
        .del-btn { color: var(--red); background: none; border: none; font-size: 12px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .source-graphs { border: 1px solid var(--line); border-radius: var(--radius-l); background: var(--bg-1); overflow: hidden; }
        .source-graphs summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 18px; cursor: pointer; list-style: none; }
        .source-graphs summary::-webkit-details-marker { display: none; }
        .source-graphs summary::after { content: '+'; color: var(--amber); font-family: var(--font-mono); font-size: 20px; line-height: 1; }
        .source-graphs[open] summary::after { content: '−'; }
        .details-eyebrow { display: block; margin-bottom: 3px; color: var(--amber); font-family: var(--font-mono); font-size: 10px; letter-spacing: .08em; }
        .details-hint { color: var(--ink-2); font-size: 12px; }
        .source-graphs[open] .details-hint { display: none; }
        .source-graphs-content { border-top: 1px solid var(--line); padding: 18px; }
        .source-graphs-note { margin: 0 0 14px; color: var(--ink-2); font-size: 12.5px; }
        .source-chart-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }

        @media (max-width: 900px) {
          .controls-grid { grid-template-columns: 1fr; }
          .grid-2, .source-chart-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
