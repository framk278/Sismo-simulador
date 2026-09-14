import { useState } from 'react'
import { Panel, Pill, Button } from '../components/Panel.jsx'
import { PlateAnimation } from '../simulations/PlateAnimation.jsx'
import { RingOfFireMap, AndeanMap } from '../simulations/TectonicMaps.jsx'
import { BOUNDARY_TYPES, RING_OF_FIRE_COUNTRIES, COLOMBIA_VENEZUELA } from '../data/tectonics.js'

export function Tectonics() {
  const [boundary, setBoundary] = useState('convergente')
  const [running, setRunning] = useState(true)
  const [country, setCountry] = useState(RING_OF_FIRE_COUNTRIES[0])

  const activeBoundary = BOUNDARY_TYPES.find((b) => b.id === boundary)

  return (
    <div className="stack">
      <Panel eyebrow="ORIGEN" title="¿De dónde viene la energía de un terremoto?">
        <div className="energy-grid">
          {[
            { t: 'Acumulación de esfuerzo', d: 'Las placas se resisten a moverse; la roca se deforma elásticamente.' },
            { t: 'Deformación de la roca', d: 'La energía de deformación se acumula como energía potencial elástica.' },
            { t: 'Ruptura súbita', d: 'Se supera la resistencia de la falla y la roca se rompe abruptamente.' },
            { t: 'Liberación de energía', d: 'La energía se libera como ondas sísmicas que se propagan en todas direcciones.' },
          ].map((s, i) => (
            <div className="energy-card" key={s.t}>
              <span className="readout energy-num">{i + 1}</span>
              <div>
                <strong>{s.t}</strong>
                <p>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        eyebrow="SIMULACIÓN"
        title="Movimiento de placas tectónicas"
        right={<Button variant="secondary" onClick={() => setRunning((r) => !r)}>{running ? 'Pausar' : 'Reanudar'}</Button>}
      >
        <div className="pill-row">
          {BOUNDARY_TYPES.map((b) => (
            <Pill key={b.id} active={boundary === b.id} onClick={() => setBoundary(b.id)}>
              {b.name}
            </Pill>
          ))}
        </div>
        <PlateAnimation type={boundary} running={running} />
        <p className="caption">{activeBoundary.description} <span className="ink-2">· Ej.: {activeBoundary.example}</span></p>
      </Panel>

      <Panel eyebrow="CINTURÓN DE FUEGO" title="Arco sísmico y volcánico del Pacífico">
        <p className="caption" style={{ marginBottom: 12 }}>
          El Cinturón de Fuego concentra la mayor parte de la sismicidad y el vulcanismo del planeta.
          Sigue fosas de subducción y arcos de islas alrededor del Pacífico. Elige un país para ver
          su contexto tectónico.
        </p>
        <RingOfFireMap selectedId={country.id} onSelect={setCountry} />
        <div className="pill-row" style={{ marginTop: 12 }}>
          {RING_OF_FIRE_COUNTRIES.map((c) => (
            <Pill key={c.id} active={country.id === c.id} onClick={() => setCountry(c)} accent="amber">
              {c.name}
            </Pill>
          ))}
        </div>
        <div className="country-card">
          <strong>{country.name}</strong>
          <p>{country.note}</p>
        </div>
      </Panel>

      <Panel eyebrow="CONTEXTO REGIONAL" title="Colombia y Venezuela">
        <p className="caption" style={{ marginBottom: 12 }}>
          En el Pacífico colombiano subduce la placa de Nazca. Al norte, la placa del Caribe se
          desplaza hacia el este respecto a la Suramericana, y en Venezuela esa interacción se
          expresa sobre todo en el sistema de fallas de Boconó.
        </p>
        <AndeanMap />
        <div className="grid-2col" style={{ marginTop: 14 }}>
          {Object.entries(COLOMBIA_VENEZUELA).map(([key, data]) => (
            <div className="region-card" key={key}>
              <strong style={{ textTransform: 'capitalize' }}>{key}</strong>
              <div className="region-row"><span>Placas</span><span>{data.plates.join(', ')}</span></div>
              <div className="region-row"><span>Zona</span><span>{data.zone}</span></div>
              <div className="region-row"><span>Movimiento</span><span>{data.movement}</span></div>
              <p>{data.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      <style>{`
        .stack { display: flex; flex-direction: column; gap: 20px; }
        .energy-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .energy-card { background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m); padding: 14px; display: flex; gap: 10px; }
        .energy-num { color: var(--amber); font-size: 20px; font-weight: 700; }
        .energy-card p { font-size: 12.5px; color: var(--ink-1); margin-top: 4px; }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .caption { font-size: 13px; color: var(--ink-1); margin-top: 10px; }
        .ink-2 { color: var(--ink-2); }
        .country-card { margin-top: 4px; background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m); padding: 14px; }
        .country-card p { font-size: 13px; color: var(--ink-1); margin-top: 4px; }
        .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .region-card { background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m); padding: 14px; }
        .region-row { display: flex; justify-content: space-between; gap: 10px; font-size: 12.5px; color: var(--ink-1); padding: 6px 0; border-bottom: 1px solid var(--line-soft); }
        .region-card p { font-size: 12.5px; color: var(--ink-2); margin-top: 8px; }

        @media (max-width: 900px) {
          .energy-grid { grid-template-columns: 1fr 1fr; }
          .grid-2col { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .energy-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
