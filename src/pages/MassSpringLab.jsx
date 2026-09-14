import { useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Panel, Slider, Button, StatChip } from '../components/Panel.jsx'
import { MassSpring, computeDynamics } from '../simulations/MassSpring.jsx'

let expId = 0

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

        @media (max-width: 900px) {
          .controls-grid { grid-template-columns: 1fr; }
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
