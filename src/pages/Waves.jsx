import { useState } from 'react'
import { Panel, Slider, Button, Pill } from '../components/Panel.jsx'
import { WaveCanvas } from '../simulations/WaveCanvas.jsx'
import { WaveTypeAnimation } from '../simulations/WaveTypeAnimation.jsx'
import { BodyWavesDiagram, HypocenterDiagram } from '../simulations/SeismicConceptDiagrams.jsx'
import { WAVE_TYPES } from '../data/waveTypes.js'

export function Waves() {
  const [amplitude, setAmplitude] = useState(40)
  const [wavelength, setWavelength] = useState(120)
  const [speed, setSpeed] = useState(90)
  const [running, setRunning] = useState(true)
  const [selectedType, setSelectedType] = useState(WAVE_TYPES[0])

  const frequency = speed / wavelength

  return (
    <div className="stack">
      <Panel eyebrow="CONCEPTO" title="¿Qué es una onda?">
        <p className="lead">
          Una onda transporta energía sin transportar materia. Modifica los controles y observa
          cómo cambian la forma y el movimiento de la onda en tiempo real.
        </p>
        <WaveCanvas amplitude={amplitude} wavelength={wavelength} speed={speed} running={running} particleMode height={200} />
        <div className="controls-row">
          <div className="controls-col">
            <Slider label="Amplitud" value={amplitude} min={10} max={70} onChange={setAmplitude} unit=" px" />
            <Slider label="Longitud de onda (λ)" value={wavelength} min={40} max={220} onChange={setWavelength} unit=" px" />
          </div>
          <div className="controls-col">
            <Slider label="Velocidad (v)" value={speed} min={20} max={200} onChange={setSpeed} unit=" px/s" accent="amber" />
            <div className="formula-box">
              <span>v = f · λ</span>
              <span className="readout">f ≈ {frequency.toFixed(2)} Hz</span>
            </div>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setRunning((r) => !r)}>{running ? 'Pausar' : 'Reanudar'}</Button>
      </Panel>

      <Panel eyebrow="VIAJE POR EL PLANETA" title="Ondas de cuerpo: P y S">
        <p className="lead">Desde el hipocentro, las ondas P (primarias o compresionales) son las más rápidas y atraviesan sólidos y líquidos. Las ondas S (secundarias o de cizalla) se propagan solo en materiales sólidos; por eso se detienen al llegar al núcleo externo líquido.</p>
        <BodyWavesDiagram />
      </Panel>

      <Panel eyebrow="SUPERFICIE" title="Epicentro: donde las ondas cambian de comportamiento">
        <div className="epicenter-layout">
          <HypocenterDiagram />
          <p className="lead">El epicentro es la proyección vertical del hipocentro sobre la superficie. Allí llegan primero las ondas P y luego las S; al interactuar con la superficie se generan ondas Love, de movimiento horizontal, y Rayleigh, de movimiento elíptico. Por estar más cerca del foco, suele concentrar un sacudimiento intenso.</p>
        </div>
      </Panel>

      <Panel eyebrow="COMPARACIÓN" title="Tipos de ondas sísmicas">
        <div className="pill-row">
          {WAVE_TYPES.map((w) => (
            <Pill key={w.id} active={selectedType.id === w.id} onClick={() => setSelectedType(w)}>
              {w.name}
            </Pill>
          ))}
        </div>

        <div className="wave-detail">
          <WaveTypeAnimation type={selectedType.id} color={selectedType.color} height={190} />
          <div className="wave-info">
            <h4 style={{ color: selectedType.color }}>{selectedType.fullName}</h4>
            <div className="info-row"><span>Categoría</span><span>{selectedType.category}</span></div>
            <div className="info-row"><span>Velocidad relativa</span><span>{selectedType.speed}</span></div>
            <div className="info-row"><span>Medio</span><span>{selectedType.medium}</span></div>
            <div className="info-row"><span>Movimiento de partícula</span><span>{selectedType.motion}</span></div>
          </div>
        </div>
      </Panel>

      <style>{`
        .stack { display: flex; flex-direction: column; gap: 20px; }
        .lead { color: var(--ink-1); font-size: 13.5px; margin-bottom: 14px; max-width: 62ch; }
        .controls-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 16px 0 12px; }
        .formula-box {
          display: flex; justify-content: space-between; align-items: center;
          background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m);
          padding: 10px 14px; font-family: var(--font-mono); font-size: 13px; color: var(--ink-1);
        }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .wave-detail { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; }
        .epicenter-layout { display: grid; grid-template-columns: 1.1fr .9fr; gap: 16px; align-items: center; }
        .wave-info { background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m); padding: 16px; }
        .wave-info h4 { margin-bottom: 10px; font-size: 15px; }
        .info-row { display: flex; justify-content: space-between; gap: 10px; font-size: 12.5px; color: var(--ink-1); padding: 7px 0; border-bottom: 1px solid var(--line-soft); }
        .info-row span:last-child { text-align: right; color: var(--ink-2); max-width: 60%; }

        @media (max-width: 900px) {
          .controls-row { grid-template-columns: 1fr; }
          .wave-detail, .epicenter-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
