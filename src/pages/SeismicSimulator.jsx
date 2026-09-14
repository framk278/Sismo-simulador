import { useEffect, useMemo, useRef, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Panel, Slider, Pill, Button, StatChip } from '../components/Panel.jsx'
import { StructureAnimation } from '../simulations/StructureAnimation.jsx'
import { peakStats, generateSeries } from '../simulations/seismicModel.js'
import { SOILS, getSoil } from '../data/soils.js'
import { STRUCTURAL_SYSTEMS } from '../data/structuralSystems.js'

const FLOOR_OPTIONS = [1, 3, 5, 10, 15]
const DURATION = 12

export function SeismicSimulator() {
  const [soilId, setSoilId] = useState('firme')
  const [floors, setFloors] = useState(5)
  const [freq, setFreq] = useState(1.5)
  const [system, setSystem] = useState('convencional')
  const [phase, setPhase] = useState('idle') // idle | running | paused | done
  const [elapsed, setElapsed] = useState(0)
  const [compareMode, setCompareMode] = useState(false)
  const rafRef = useRef(null)
  const startRef = useRef(0)

  const soil = getSoil(soilId)

  useEffect(() => {
    if (phase !== 'running') return
    startRef.current = performance.now() - elapsed * 1000
    function tick(now) {
      const t = (now - startRef.current) / 1000
      if (t >= DURATION) {
        setElapsed(DURATION)
        setPhase('done')
        return
      }
      setElapsed(t)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function startQuake() {
    setElapsed(0)
    setPhase('running')
  }
  function pauseQuake() {
    setPhase('paused')
  }
  function resumeQuake() {
    setPhase('running')
  }
  function resetQuake() {
    cancelAnimationFrame(rafRef.current)
    setElapsed(0)
    setPhase('idle')
  }

  const stats = useMemo(
    () => peakStats({ floors, excitationFreq: freq, system, soilId, duration: DURATION }),
    [floors, freq, system, soilId]
  )
  const isActive = phase === 'running' || phase === 'paused' || phase === 'done'

  const compareSeries = useMemo(() => {
    if (!compareMode) return null
    const a = generateSeries({ floors, excitationFreq: freq, system: 'convencional', soilId, duration: DURATION })
    const b = generateSeries({ floors, excitationFreq: freq, system: 'disipadores', soilId, duration: DURATION })
    const c = generateSeries({ floors, excitationFreq: freq, system: 'aislamiento', soilId, duration: DURATION })
    return a.map((p, i) => ({ t: p.t, sinAislamiento: p.displacement, disipadores: b[i]?.displacement, aislamiento: c[i]?.displacement }))
  }, [compareMode, floors, freq, soilId])

  return (
    <div className="stack">
      <Panel eyebrow="SIMULADOR FINAL" title="Configura el escenario sísmico">
        <div className="config-grid">
          <div className="config-block">
            <span className="config-title">Tipo de suelo</span>
            <div className="pill-row">
              {SOILS.map((s) => (
                <Pill key={s.id} active={soilId === s.id} onClick={() => setSoilId(s.id)}>{s.label}</Pill>
              ))}
            </div>
          </div>
          <div className="config-block">
            <span className="config-title">Número de pisos</span>
            <div className="pill-row">
              {FLOOR_OPTIONS.map((f) => (
                <Pill key={f} active={floors === f} onClick={() => setFloors(f)} accent="cyan">{f}</Pill>
              ))}
            </div>
          </div>
          <div className="config-block">
            <span className="config-title">Sistema estructural</span>
            <div className="pill-row">
              {STRUCTURAL_SYSTEMS.map((s) => (
                <Pill key={s.id} active={system === s.id} onClick={() => setSystem(s.id)} accent="amber">{s.name}</Pill>
              ))}
            </div>
          </div>
        </div>
        <Slider label="Frecuencia del sismo" value={freq} min={0.2} max={4} step={0.1} onChange={setFreq} unit=" Hz" accent="amber" />
      </Panel>

      <Panel eyebrow="VISUALIZACIÓN" title="Respuesta estructural en tiempo real">
        <StructureAnimation
          floors={floors}
          excitationFreq={freq}
          system={system}
          running={phase === 'running'}
          soilAmplification={soil.amplification}
          active={isActive}
        />

        <div className="sim-controls">
          {phase === 'idle' && <Button onClick={startQuake}>INICIAR SISMO</Button>}
          {phase === 'running' && <Button variant="secondary" onClick={pauseQuake}>Pausar</Button>}
          {phase === 'paused' && <Button onClick={resumeQuake}>Reanudar</Button>}
          {(phase === 'paused' || phase === 'done') && <Button variant="ghost" onClick={resetQuake}>Reiniciar</Button>}
          {phase === 'done' && <Button onClick={startQuake}>Repetir sismo</Button>}
        </div>

        <div className="stats-row">
          <StatChip label="Tiempo" value={elapsed.toFixed(1)} unit=" s" />
          <StatChip label="Desplaz. máx." value={isActive ? stats.maxDisplacementCm.toFixed(2) : '—'} unit=" cm" accent="amber" />
          <StatChip label="Acel. máx." value={isActive ? stats.maxAccelerationMs2.toFixed(2) : '—'} unit=" m/s²" />
          <StatChip label="Frecuencia" value={freq.toFixed(1)} unit=" Hz" />
        </div>
      </Panel>

      <Panel
        eyebrow="ANÁLISIS"
        title="Modo comparación"
        right={<Button variant="secondary" onClick={() => setCompareMode((v) => !v)}>{compareMode ? 'Ocultar' : 'Comparar sistemas'}</Button>}
      >
        {!compareMode ? (
          <p className="lead">
            Activa el modo comparación para ejecutar el mismo escenario (suelo, pisos, frecuencia)
            con los tres sistemas estructurales a la vez y ver el desplazamiento superpuesto.
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={compareSeries}>
                <CartesianGrid stroke="#1c2536" />
                <XAxis dataKey="t" stroke="#6d7994" fontSize={12} label={{ value: 's', position: 'insideBottomRight', offset: -4, fill: '#6d7994' }} />
                <YAxis stroke="#6d7994" fontSize={12} label={{ value: 'cm', angle: -90, position: 'insideLeft', fill: '#6d7994' }} />
                <Tooltip contentStyle={{ background: '#151c2b', border: '1px solid #263148' }} />
                <Legend />
                <Line type="monotone" dataKey="sinAislamiento" name="Sin aislamiento" stroke="#8a9099" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="disipadores" name="Con disipadores" stroke="#7d8f7a" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="aislamiento" name="Con aislamiento" stroke="#c4a574" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <p className="caption">
              Desplazamiento en cm del último piso a lo largo del tiempo para los tres sistemas,
              con el mismo suelo, número de pisos y frecuencia de excitación.
            </p>
          </>
        )}
      </Panel>

      <style>{`
        .stack { display: flex; flex-direction: column; gap: 20px; }
        .config-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 16px; }
        .config-title { display: block; font-size: 12px; color: var(--ink-2); margin-bottom: 8px; font-family: var(--font-mono); }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .sim-controls { display: flex; gap: 10px; margin: 16px 0; }
        .stats-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .lead { color: var(--ink-1); font-size: 13.5px; max-width: 62ch; }
        .caption { font-size: 13px; color: var(--ink-1); margin-top: 10px; }

        @media (max-width: 900px) {
          .config-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
