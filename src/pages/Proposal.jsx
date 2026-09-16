import { Panel } from '../components/Panel.jsx'
import petBrickReference from '../assets/seismic-references/ladrillo de cemente.jpeg'

export function Proposal() {
  return (
    <Panel eyebrow="PROPUESTA" title="Alternativa para disipar ondas: ladrillo PET">
      <div className="pet-layout">
        <div>
          <p className="lead">
            Como propuesta del proyecto, el ladrillo de PET puede explorarse como una alternativa de
            mampostería liviana con potencial para redistribuir vibraciones mediante su geometría,
            relleno y juntas.
          </p>
          <p className="caption">
            Es una hipótesis educativa: su uso real exige ensayos de material, validación estructural
            y cumplimiento de la normativa aplicable.
          </p>
          <a
            className="proposal-link"
            href="https://canva.link/ch6kk1u9s1ixhsk"
            target="_blank"
            rel="noreferrer"
          >
            Ver material complementario de la propuesta en Canva
          </a>
        </div>
        <figure className="reference-figure pet-reference">
          <img src={petBrickReference} alt="Infografía sobre ladrillos de cemento con plástico reciclado" />
          <figcaption>Referencia visual de la alternativa con plástico reciclado.</figcaption>
        </figure>
      </div>

      <style>{`
        .pet-layout { display: grid; grid-template-columns: .9fr 1.1fr; gap: 18px; align-items: center; }
        .lead { color: var(--ink-1); font-size: 13.5px; margin-bottom: 14px; max-width: 62ch; }
        .caption { font-size: 13px; color: var(--ink-1); margin-top: 14px; }
        .proposal-link { display: inline-block; margin-top: 4px; color: var(--amber); font-size: 13px; }
        .proposal-link:hover { color: var(--ink-0); }
        .reference-figure { margin: 16px 0 0; }
        .pet-reference { margin: 0; }
        .reference-figure img { width: 100%; display: block; border: 1px solid var(--line); border-radius: var(--radius-m); background: #fff; }
        .reference-figure figcaption { margin-top: 6px; font-size: 11.5px; color: var(--ink-2); }

        @media (max-width: 900px) {
          .pet-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </Panel>
  )
}
