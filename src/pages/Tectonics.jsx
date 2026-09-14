import { useState } from 'react'
import { Panel, Pill, Button } from '../components/Panel.jsx'
import { PlateAnimation } from '../simulations/PlateAnimation.jsx'
import { HypocenterDiagram } from '../simulations/SeismicConceptDiagrams.jsx'
import { RegionalEventMap } from '../simulations/TectonicMaps.jsx'
import { BOUNDARY_TYPES, RING_OF_FIRE_COUNTRIES, COLOMBIA_VENEZUELA, REGIONAL_EARTHQUAKES } from '../data/tectonics.js'
import accumulationImage from '../assets/seismic-references/acumulacion.jpeg'
import deformationImage from '../assets/seismic-references/deformacion.jpeg'
import ruptureImage from '../assets/seismic-references/ruptura subita.jpeg'
import releaseImage from '../assets/seismic-references/liberacion.jpeg'
import epicenterImage from '../assets/seismic-references/epicentro.jpeg'
import convergentImage from '../assets/seismic-references/covergente.jpeg'
import divergentImage from '../assets/seismic-references/Divergente.jpeg'
import transformImage from '../assets/seismic-references/Tranformate.jpeg'
import fireRingImage from '../assets/seismic-references/Cinturon.jpg'

const BOUNDARY_IMAGES = {
  convergente: convergentImage,
  divergente: divergentImage,
  transformante: transformImage,
}

export function Tectonics() {
  const [boundary, setBoundary] = useState('convergente')
  const [running, setRunning] = useState(true)
  const [country, setCountry] = useState(RING_OF_FIRE_COUNTRIES[0])
  const [regionalCountry, setRegionalCountry] = useState('colombia')

  const activeBoundary = BOUNDARY_TYPES.find((b) => b.id === boundary)

  return (
    <div className="stack">
      <Panel eyebrow="ORIGEN" title="¿De dónde viene la energía de un terremoto?">
        <div className="energy-grid">
          {[
            { t: 'Acumulación de esfuerzo', d: 'Las placas se resisten a moverse; la roca se deforma elásticamente.', image: accumulationImage },
            { t: 'Deformación de la roca', d: 'La energía de deformación se acumula como energía potencial elástica.', image: deformationImage },
            { t: 'Ruptura súbita', d: 'Se supera la resistencia de la falla y la roca se rompe abruptamente.', image: ruptureImage },
            { t: 'Liberación de energía', d: 'La energía se libera como ondas sísmicas que se propagan en todas direcciones.', image: releaseImage },
          ].map((s, i) => (
            <div className="energy-card" key={s.t}>
              <img src={s.image} alt={`Ilustración de ${s.t.toLowerCase()}`} />
              <span className="readout energy-num">{i + 1}</span>
              <div>
                <strong>{s.t}</strong>
                <p>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="ORIGEN DEL SISMO" title="Hipocentro y epicentro">
        <div className="hypocenter-layout">
          <div>
            <p className="caption">El <strong>hipocentro</strong>, o foco sísmico, es el punto en el interior de la Tierra donde inicia la ruptura de la falla. Su proyección vertical sobre la superficie se llama <strong>epicentro</strong>.</p>
            <p className="caption">Al romperse la roca, la energía acumulada por fricción se libera de golpe como ondas mecánicas.</p>
          </div>
          <div className="concept-visuals">
            <HypocenterDiagram />
            <figure className="reference-figure">
              <img src={epicenterImage} alt="Esquema que ubica el hipocentro y el epicentro de un sismo" />
              <figcaption>El foco se origina bajo tierra; su punto de referencia en superficie es el epicentro.</figcaption>
            </figure>
          </div>
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
        <div className="plate-layout">
          <PlateAnimation type={boundary} running={running} />
          <figure className="reference-figure boundary-reference">
            <img src={BOUNDARY_IMAGES[boundary]} alt={`Esquema de límite ${activeBoundary.name.toLowerCase()}`} />
            <figcaption>Referencia visual: límite {activeBoundary.name.toLowerCase()}.</figcaption>
          </figure>
        </div>
        <p className="caption">{activeBoundary.description} <span className="ink-2">· Ej.: {activeBoundary.example}</span></p>
      </Panel>

      <Panel eyebrow="CINTURÓN DE FUEGO" title="Arco sísmico y volcánico del Pacífico">
        <p className="caption" style={{ marginBottom: 12 }}>
          El Cinturón de Fuego concentra la mayor parte de la sismicidad y el vulcanismo del planeta.
          Sigue fosas de subducción y arcos de islas alrededor del Pacífico. Explora los puntos de
          referencia para relacionar cada país con su contexto tectónico.
        </p>
        <figure className="reference-figure fire-ring-reference">
          <img src={fireRingImage} alt="Mapa de referencia del Cinturón de Fuego del Pacífico" />
          <figcaption>El Cinturón de Fuego se distribuye alrededor de los márgenes del océano Pacífico.</figcaption>
        </figure>
        <div className="ring-layout">
          <div className="ring-countries">
            {RING_OF_FIRE_COUNTRIES.map((c) => (
              <button key={c.id} className={`ring-country ${country.id === c.id ? 'active' : ''}`} onClick={() => setCountry(c)}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="country-card">
          <strong>{country.name}</strong>
          <p>{country.note}</p>
        </div>
      </Panel>

      <Panel eyebrow="CONTEXTO REGIONAL" title="Colombia y Venezuela: eventos de referencia">
        <p className="caption" style={{ marginBottom: 12 }}>Selecciona un país para abrir su propia información y visualizar el epicentro y las zonas destacadas por afectación.</p>
        <div className="pill-row">
          {Object.keys(COLOMBIA_VENEZUELA).map((key) => (
            <Pill key={key} active={regionalCountry === key} onClick={() => setRegionalCountry(key)} accent="amber">
              {key === 'colombia' ? 'Colombia' : 'Venezuela'}
            </Pill>
          ))}
        </div>
        <div className="regional-layout">
          <RegionalEventMap country={regionalCountry} event={REGIONAL_EARTHQUAKES[regionalCountry]} />
          <div className="region-card">
            <span className="event-kicker">EVENTO DE REFERENCIA</span>
            <strong>{REGIONAL_EARTHQUAKES[regionalCountry].title}</strong>
            <div className="region-row"><span>Fecha</span><span>{REGIONAL_EARTHQUAKES[regionalCountry].date}</span></div>
            <div className="region-row"><span>Magnitud</span><span>{REGIONAL_EARTHQUAKES[regionalCountry].magnitude}</span></div>
            <div className="region-row"><span>Placas</span><span>{COLOMBIA_VENEZUELA[regionalCountry].plates.join(', ')}</span></div>
            <div className="region-row"><span>Zona</span><span>{COLOMBIA_VENEZUELA[regionalCountry].zone}</span></div>
            <div className="region-row"><span>Movimiento</span><span>{COLOMBIA_VENEZUELA[regionalCountry].movement}</span></div>
            <p>{COLOMBIA_VENEZUELA[regionalCountry].note}</p>
            <p className="event-note">{REGIONAL_EARTHQUAKES[regionalCountry].note}</p>
          </div>
        </div>
      </Panel>

      <style>{`
        .stack { display: flex; flex-direction: column; gap: 20px; }
        .energy-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .energy-card { background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m); padding: 12px; display: grid; grid-template-columns: 1fr; gap: 10px; }
        .energy-card img { width: 100%; aspect-ratio: 1.65; object-fit: cover; border: 1px solid var(--line-soft); border-radius: var(--radius-s); }
        .energy-num { color: var(--amber); font-size: 20px; font-weight: 700; }
        .energy-card p { font-size: 12.5px; color: var(--ink-1); margin-top: 4px; }
        .reference-figure { margin: 0; }
        .reference-figure img { width: 100%; display: block; border: 1px solid var(--line); border-radius: var(--radius-s); background: #fff; }
        .reference-figure figcaption { margin-top: 6px; font-size: 11.5px; color: var(--ink-2); }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .caption { font-size: 13px; color: var(--ink-1); margin-top: 10px; }
        .ink-2 { color: var(--ink-2); }
        .country-card { margin-top: 4px; background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m); padding: 14px; }
        .country-card p { font-size: 13px; color: var(--ink-1); margin-top: 4px; }
        .fire-ring-reference { margin-bottom: 14px; background: #fff; border-radius: var(--radius-m); overflow: hidden; }
        .fire-ring-reference img { max-height: 390px; object-fit: contain; }
        .fire-ring-reference figcaption { padding: 0 10px 9px; }
        .ring-layout { display: block; }
        .ring-countries { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; align-content: center; }
        .ring-country { border: 1px solid var(--line); border-radius: var(--radius-s); background: var(--bg-1); color: var(--ink-1); padding: 10px 8px; font-size: 12px; text-align: left; }
        .ring-country:hover, .ring-country.active { border-color: var(--amber); background: var(--amber-dim); color: var(--ink-0); }
        .regional-layout { display: grid; grid-template-columns: 1.25fr .75fr; gap: 14px; align-items: stretch; }
        .hypocenter-layout { display: grid; grid-template-columns: .75fr 1.25fr; gap: 18px; align-items: center; }
        .concept-visuals { display: grid; gap: 12px; }
        .plate-layout { display: grid; grid-template-columns: 1.3fr .7fr; gap: 14px; align-items: center; }
        .region-card { background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--radius-m); padding: 14px; }
        .region-row { display: flex; justify-content: space-between; gap: 10px; font-size: 12.5px; color: var(--ink-1); padding: 6px 0; border-bottom: 1px solid var(--line-soft); }
        .region-card p { font-size: 12.5px; color: var(--ink-2); margin-top: 8px; }
        .event-kicker { display: block; margin-bottom: 6px; color: var(--amber); font-family: var(--font-mono); font-size: 10px; letter-spacing: .08em; }
        .event-note { color: var(--ink-1) !important; }
        .epicenter-icon { background: transparent; border: 0; }
        .epicenter-pulse { position: relative; display: grid; place-items: center; width: 76px; height: 76px; border-radius: 50%; background: rgba(220, 97, 74, .19); animation: epicenter-pulse 1.8s ease-out infinite; }
        .epicenter-pulse::before, .epicenter-pulse::after { content: ''; position: absolute; inset: 12px; border: 2px solid rgba(233, 118, 90, .75); border-radius: 50%; animation: epicenter-ring 1.8s ease-out infinite; }
        .epicenter-pulse::after { animation-delay: .6s; }
        .epicenter-core { position: relative; z-index: 1; display: grid; place-items: center; width: 28px; height: 28px; background: #e36f5a; border: 3px solid #fff5e5; border-radius: 50%; box-shadow: 0 0 0 5px rgba(227, 111, 90, .25), 0 4px 14px rgba(75, 22, 16, .45); color: #fff; font-size: 17px; line-height: 1; }
        @keyframes epicenter-pulse { 0%, 100% { transform: scale(.9); } 50% { transform: scale(1.05); } }
        @keyframes epicenter-ring { 0% { transform: scale(.45); opacity: 1; } 100% { transform: scale(1.35); opacity: 0; } }

        @media (max-width: 900px) {
          .energy-grid { grid-template-columns: 1fr 1fr; }
          .hypocenter-layout, .plate-layout, .regional-layout, .ring-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .energy-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
