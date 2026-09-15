import { Panel } from '../components/Panel.jsx'

const REFERENCES = [
  'Chopra, A. K. (2020). Dynamics of structures: Theory and applications to earthquake engineering (5.ª ed.). Pearson.',
  'Fundación Venezolana de Investigaciones Sismológicas. (2026). Informe sismotectónico especial: Terremoto doblete de La Guaira y Yaracuy (24 de junio de 2026). FUNVISIS, Ministerio del Poder Popular para Ciencia y Tecnología.',
  'Kramer, S. L. (1996). Geotechnical earthquake engineering. Prentice Hall.',
  'Naeim, F., & Kelly, J. M. (1999). Design of seismic isolated structures: From theory to practice. John Wiley & Sons.',
  'Servicio Geológico Colombiano. (2026). Boletín técnico evaluativo: Terremoto de San José del Palmar, Chocó (Mw 7.4, profundidad 107 km). Dirección de Geoamenazas, SGC.',
  'U.S. Geological Survey. (2026). M 7.5 - Coastal Venezuela & M 7.4 - Western Colombia earthquake summary reports. Earthquake Hazards Program, U.S. Department of the Interior.',
]

export function References() {
  return (
    <div className="references-page">
      <Panel eyebrow="FUENTES" title="Referencias bibliográficas">
        <p className="intro">Material de consulta utilizado como apoyo conceptual para el laboratorio virtual.</p>
        <ol className="reference-list">
          {REFERENCES.map((reference) => <li key={reference}>{reference}</li>)}
        </ol>
      </Panel>
      <style>{`
        .references-page { display: flex; flex-direction: column; gap: 20px; }
        .intro { color: var(--ink-1); font-size: 13.5px; margin-bottom: 18px; }
        .reference-list { margin: 0; padding-left: 24px; display: flex; flex-direction: column; gap: 13px; color: var(--ink-1); }
        .reference-list li { padding: 12px 14px; background: var(--bg-1); border: 1px solid var(--line-soft); border-radius: var(--radius-s); line-height: 1.55; }
        .reference-list li::marker { color: var(--amber); font-family: var(--font-mono); font-weight: 700; }
      `}</style>
    </div>
  )
}
