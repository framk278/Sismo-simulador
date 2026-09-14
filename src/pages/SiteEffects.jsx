import { useState } from 'react'
import { Panel, Pill, Button, StatChip } from '../components/Panel.jsx'
import { SoilParticles } from '../simulations/SoilParticles.jsx'
import { WaveCanvas } from '../simulations/WaveCanvas.jsx'
import { SOILS, getSoil } from '../data/soils.js'

export function SiteEffects() {
  const [soilId, setSoilId] = useState('roca')
  const [running, setRunning] = useState(true)
  const soil = getSoil(soilId)
  const baseAmplitude = 22

  return (
    <div className="stack">
      <Panel eyebrow="CONCEPTO" title="El suelo no responde igual ante una onda sísmica">
        <p className="lead">
          A igual energía en la roca base, suelos más blandos y menos densos tienden a amplificar
          más el movimiento en superficie. Elige un tipo de suelo para ver su compacidad.
        </p>
        <div className="pill-row">
          {SOILS.map((s) => (
            <Pill key={s.id} active={soilId === s.id} onClick={() => setSoilId(s.id)}>
              {s.label}
            </Pill>
          ))}
        </div>
        <SoilParticles soil={soil} running={running} amplitude={soil.amplification * 3.2} />
        <div className="soil-stats">
          <StatChip label="Vs (onda de corte)" value={soil.vs} unit=" m/s" />
          <StatChip label="Densidad relativa" value={soil.density.toFixed(2)} />
          <StatChip label="Amplificación aprox." value={soil.amplification.toFixed(1)} unit="×" accent="amber" />
        </div>
        <p className="soil-desc">{soil.description}</p>
      </Panel>

      <Panel
        eyebrow="SIMULADOR"
        title="Propagación de onda a través del suelo"
        right={<Button variant="secondary" onClick={() => setRunning((r) => !r)}>{running ? 'Pausar' : 'Reanudar'}</Button>}
      >
        <div className="chain">
          <div className="chain-col">
            <span className="chain-label">Entrada (roca base)</span>
            <WaveCanvas amplitude={baseAmplitude} wavelength={110} speed={soil.vs / 6} running={running} color="#8a9099" height={110} />
          </div>
          <div className="chain-arrow">→</div>
          <div className="chain-col">
            <span className="chain-label">Medio: {soil.label}</span>
            <SoilParticles soil={soil} running={running} height={110} amplitude={soil.amplification * 2.4} />
          </div>
          <div className="chain-arrow">→</div>
          <div className="chain-col">
            <span className="chain-label">Onda resultante en superficie</span>
            <WaveCanvas
              amplitude={baseAmplitude * soil.amplification}
              wavelength={110}
              speed={soil.vs / 6}
              running={running}
              color={soil.color}
              height={110}
            />
          </div>
        </div>
        <p className="caption">
          La velocidad de la onda disminuye y su amplitud crece a medida que el suelo es menos
          rígido: la energía se redistribuye entre velocidad y amplitud.
        </p>
      </Panel>

      <style>{`
        .stack { display: flex; flex-direction: column; gap: 20px; }
        .lead { color: var(--ink-1); font-size: 13.5px; margin-bottom: 14px; max-width: 62ch; }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .soil-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
        .soil-desc { margin-top: 12px; font-size: 13px; color: var(--ink-1); }
        .chain { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 10px; align-items: center; }
        .chain-col { display: flex; flex-direction: column; gap: 6px; }
        .chain-label { font-size: 11.5px; color: var(--ink-2); font-family: var(--font-mono); }
        .chain-arrow { color: var(--ink-2); font-size: 20px; }
        .caption { font-size: 13px; color: var(--ink-1); margin-top: 14px; }

        @media (max-width: 900px) {
          .chain { grid-template-columns: 1fr; }
          .chain-arrow { display: none; }
        }
      `}</style>
    </div>
  )
}
