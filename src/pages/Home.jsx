import { motion } from 'framer-motion'
import { Panel, Button } from '../components/Panel.jsx'
import { WaveCanvas } from '../simulations/WaveCanvas.jsx'

const STEPS = [
  { id: 'tectonica', label: 'Contexto tectónico y ondas', desc: 'Origen y propagación de la energía' },
  { id: 'suelo', label: 'Medios y efectos de sitio', desc: 'El suelo transforma la señal' },
  { id: 'laboratorio', label: 'Laboratorio masa-resorte', desc: 'Mide y experimenta' },
  { id: 'mitigacion', label: 'Mitigación estructural', desc: 'La estructura responde' },
  { id: 'simulador', label: 'Simulador sísmico', desc: 'Integra todo lo aprendido' },
]

export function Home({ onNavigate }) {
  return (
    <div className="home">
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-text">
          <span className="hero-eyebrow">Laboratorio virtual · Ingeniería sísmica</span>
          <h1>Aprende viendo cómo se mueve la tierra, no leyendo sobre ella.</h1>
          <p>
            Modifica parámetros, corre simulaciones y observa en tiempo real cómo la energía de un
            sismo viaja desde las placas tectónicas hasta una estructura — y cómo distintos sistemas
            la controlan.
          </p>
          <div className="hero-actions">
            <Button onClick={() => onNavigate('tectonica')}>Empezar el recorrido</Button>
            <Button variant="ghost" onClick={() => onNavigate('simulador')}>
              Ir directo al simulador
            </Button>
          </div>
        </div>
        <div className="hero-wave">
          <WaveCanvas amplitude={38} wavelength={90} speed={70} color="#c4a574" particleMode height={180} />
        </div>
      </motion.section>

      <Panel title="Ruta de aprendizaje" eyebrow="RECORRIDO">
        <div className="path">
          {STEPS.map((s, i) => (
            <button key={s.id} className="path-step" onClick={() => onNavigate(s.id)}>
              <span className="path-num readout">{String(i + 1).padStart(2, '0')}</span>
              <span className="path-label">{s.label}</span>
              <span className="path-desc">{s.desc}</span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid-2">
        <Panel title="¿Qué vas a construir aquí?" eyebrow="OBJETIVO">
          <ul className="check-list">
            <li>Simular ondas P, S, Love y Rayleigh y comparar su comportamiento.</li>
            <li>Ver cómo el mismo sismo se amplifica distinto según el tipo de suelo.</li>
            <li>Comparar una estructura sin protección, con disipadores y con aislamiento sísmico.</li>
            <li>Medir período y frecuencia en un laboratorio masa-resorte.</li>
            <li>Integrar suelo, altura y sistema estructural en el simulador sísmico.</li>
          </ul>
        </Panel>
        <Panel title="Antes de empezar" eyebrow="NOTA ACADÉMICA" accent="amber">
          <p className="note">
            Los valores numéricos de este laboratorio son aproximaciones con fines didácticos.
            El simulador no reemplaza un software profesional de análisis estructural ni un estudio
            de microzonificación sísmica real.
          </p>
        </Panel>
      </div>

      <style>{`
        .home { display: flex; flex-direction: column; gap: 24px; }
        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: center;
          background: linear-gradient(160deg, var(--bg-2), var(--bg-1));
          border: 1px solid var(--line);
          border-radius: var(--radius-l);
          padding: 32px;
        }
        .hero-eyebrow {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--amber);
        }
        .hero-text h1 {
          font-size: 30px;
          line-height: 1.2;
          margin: 12px 0 14px;
          max-width: 22ch;
        }
        .hero-text p { color: var(--ink-1); max-width: 52ch; margin-bottom: 22px; }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-wave {
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: var(--radius-m);
          padding: 10px;
        }
        .path {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .path-step {
          text-align: left;
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: var(--radius-m);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .path-step:hover { border-color: var(--cyan); }
        .path-num { color: var(--cyan); font-size: 12px; }
        .path-label { font-weight: 600; font-size: 14px; }
        .path-desc { font-size: 12px; color: var(--ink-2); }
        .grid-2 {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
        }
        .check-list { margin: 0; padding-left: 18px; color: var(--ink-1); display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; }
        .note { color: var(--ink-1); font-size: 13.5px; line-height: 1.6; }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; }
          .path { grid-template-columns: 1fr 1fr; }
          .grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .path { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
