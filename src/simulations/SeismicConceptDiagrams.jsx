import { motion } from 'framer-motion'

const EARTH_LAYERS = [
  { y: 133, h: 22, color: '#5c6874', label: 'Corteza sólida' },
  { y: 155, h: 44, color: '#7d6654', label: 'Manto sólido / plástico' },
  { y: 199, h: 40, color: '#8d563e', label: 'Núcleo externo líquido' },
  { y: 239, h: 22, color: '#c49a5c', label: 'Núcleo interno sólido' },
]

export function RuptureSequence({ active = 0 }) {
  const steps = [
    { label: 'Esfuerzo', path: 'M20 72 C52 47 80 50 114 72', mark: <><path d="M34 49h27" /><path d="M87 49h27" /></> },
    { label: 'Deformación', path: 'M20 76 C50 38 84 94 114 60', mark: <path d="M62 36 C78 53 78 71 60 84" /> },
    { label: 'Ruptura', path: 'M20 73 L62 55 L78 85 L114 58', mark: <path d="M66 43l10 16-9 9 12 15" /> },
    { label: 'Ondas', path: 'M20 70 L114 70', mark: <><circle cx="67" cy="70" r="6" /><path d="M45 56c-16 8-16 20 0 28M89 56c16 8 16 20 0 28" /></> },
  ]
  const step = steps[active]
  return (
    <svg viewBox="0 0 134 110" role="img" aria-label={`Ilustración de ${step.label}`}>
      <rect x="6" y="18" width="122" height="74" rx="9" fill="#141a20" stroke="#3a434d" />
      <path d={step.path} fill="none" stroke="#7e8f9c" strokeWidth="8" strokeLinecap="round" />
      <g fill="none" stroke="#c4a574" strokeWidth="2.5" strokeLinecap="round">{step.mark}</g>
      <text x="67" y="105" textAnchor="middle" fill="#8e98a1" fontSize="10" fontFamily="JetBrains Mono, monospace">{step.label}</text>
    </svg>
  )
}

export function HypocenterDiagram() {
  return (
    <svg viewBox="0 0 760 300" width="100%" role="img" aria-label="Diagrama de hipocentro y epicentro">
      <defs><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#59636c"/><stop offset="1" stopColor="#303942"/></linearGradient></defs>
      <rect width="760" height="300" rx="10" fill="#12181e" />
      <path d="M0 87 C115 73 170 99 282 84 S500 71 760 89 L760 300 L0 300Z" fill="url(#ground)" />
      <path d="M0 90 C115 76 170 102 282 87 S500 74 760 92" fill="none" stroke="#c4a574" strokeWidth="3" />
      <path d="M0 170 C160 145 325 187 487 154 S650 166 760 151" fill="none" stroke="#8e735a" strokeWidth="2" opacity=".7" />
      <path d="M385 275 L447 118" stroke="#a96d68" strokeWidth="5" strokeDasharray="10 7" />
      <motion.g animate={{ scale: [1, 1.7, 1], opacity: [.9, .15, .9] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ transformOrigin: '405px 225px' }}>
        <circle cx="405" cy="225" r="28" fill="none" stroke="#c4a574" strokeWidth="2" />
      </motion.g>
      <circle cx="405" cy="225" r="8" fill="#c4a574" /><circle cx="447" cy="84" r="7" fill="#a96d68" />
      <path d="M405 218 L447 92" stroke="#b9c2c8" strokeWidth="1.5" strokeDasharray="4 5" />
      <text x="420" y="253" fill="#edf1f3" fontSize="15" fontWeight="600">Hipocentro (foco)</text>
      <text x="462" y="68" fill="#edf1f3" fontSize="15" fontWeight="600">Epicentro</text>
      <text x="28" y="122" fill="#c7ced4" fontSize="13">Ruptura de la falla</text>
      <text x="28" y="143" fill="#8e98a1" fontSize="12">La energía se libera en forma de ondas mecánicas.</text>
    </svg>
  )
}

export function BodyWavesDiagram() {
  return (
    <svg viewBox="0 0 760 300" width="100%" role="img" aria-label="Propagación de ondas P y S por el interior de la Tierra">
      <defs><marker id="waveArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0L8 3L0 6Z" fill="#9fc0d4"/></marker></defs>
      <rect width="760" height="300" rx="10" fill="#12181e" />
      {EARTH_LAYERS.map((layer) => <g key={layer.label}><rect x="20" y={layer.y} width="720" height={layer.h} fill={layer.color} /><text x="32" y={layer.y + layer.h / 2 + 4} fontSize="11" fill="#edf1f3">{layer.label}</text></g>)}
      <path d="M77 126 C172 170 242 197 349 214 S546 264 686 249" fill="none" stroke="#9fc0d4" strokeWidth="3" strokeDasharray="8 7" markerEnd="url(#waveArrow)" />
      <path d="M77 126 C150 169 210 185 279 189 S397 182 472 170" fill="none" stroke="#c4a574" strokeWidth="3" strokeDasharray="8 7" markerEnd="url(#waveArrow)" />
      <circle cx="77" cy="126" r="7" fill="#a96d68" /><text x="48" y="112" fill="#edf1f3" fontSize="12">Foco</text>
      <g transform="translate(510 38)"><rect width="205" height="64" rx="8" fill="#1f262d" stroke="#3a434d"/><line x1="16" y1="23" x2="52" y2="23" stroke="#9fc0d4" strokeWidth="3" strokeDasharray="8 7"/><text x="63" y="27" fill="#c7ced4" fontSize="12">Onda P: atraviesa sólidos y líquidos</text><line x1="16" y1="46" x2="52" y2="46" stroke="#c4a574" strokeWidth="3" strokeDasharray="8 7"/><text x="63" y="50" fill="#c7ced4" fontSize="12">Onda S: se detiene en el líquido</text></g>
      <text x="38" y="284" fill="#8e98a1" fontSize="11">Las trayectorias se refractan al cambiar la densidad y el estado del material.</text>
    </svg>
  )
}

export function PetBrickDiagram() {
  return (
    <svg viewBox="0 0 760 210" width="100%" role="img" aria-label="Esquema conceptual de mampostería con ladrillos PET para disipación">
      <rect width="760" height="210" rx="10" fill="#12181e" />
      <path d="M35 150 C72 120 104 181 141 150 S211 120 248 150" fill="none" stroke="#c4a574" strokeWidth="5" />
      <text x="32" y="185" fill="#8e98a1" fontSize="11">Onda incidente</text>
      {Array.from({ length: 12 }, (_, i) => { const col = i % 4; const row = Math.floor(i / 4); return <g key={i} transform={`translate(${315 + col * 74 + (row % 2 ? 36 : 0)} ${42 + row * 39})`}><rect width="68" height="34" rx="5" fill="#486d70" stroke="#8fb6b2"/><circle cx="13" cy="17" r="7" fill="none" stroke="#b9d7cc"/><path d="M27 10h28M27 17h22M27 24h28" stroke="#b9d7cc" strokeWidth="2"/></g> })}
      <path d="M618 150 C650 142 682 158 720 150" fill="none" stroke="#7e8f9c" strokeWidth="2" opacity=".7" />
      <text x="556" y="185" fill="#8e98a1" fontSize="11">Movimiento atenuado</text>
      <text x="315" y="25" fill="#edf1f3" fontSize="13" fontWeight="600">Muro conceptual con ladrillo PET</text>
      <text x="315" y="193" fill="#8e98a1" fontSize="11">Geometría, relleno y juntas redistribuyen energía; requiere validación experimental.</text>
    </svg>
  )
}
