import { motion } from 'framer-motion'

export function RegionalTectonicVisual({ country }) {
  const colombia = country === 'colombia'
  const title = colombia ? 'Colombia: Nazca, Caribe y Suramericana' : 'Venezuela: Caribe y Suramericana'
  return <svg viewBox="0 0 640 330" className="regional-tectonic-visual" role="img" aria-label={title}>
    <defs><linearGradient id="regionalLand" x1="0" y1="0" x2="0" y2="1"><stop stopColor={colombia ? '#668c68' : '#a68462'}/><stop offset="1" stopColor="#694b3d"/></linearGradient><linearGradient id="regionalOcean" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#3d8197"/><stop offset="1" stopColor="#173d4c"/></linearGradient><marker id="regionalArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0L8 3L0 6Z" fill="#f4d18b"/></marker></defs>
    <rect width="640" height="330" rx="12" fill="#14222c" />
    <path d="M0 78 C126 66 192 92 295 72 S482 57 640 76V330H0Z" fill="url(#regionalOcean)" />
    {colombia ? <>
      <path d="M275 76 C350 42 396 90 448 60 C501 42 545 71 640 43V330H265Z" fill="url(#regionalLand)" />
      <path d="M248 207 C320 176 397 210 477 168" fill="none" stroke="#e1b66c" strokeWidth="5" strokeDasharray="10 7" />
      <motion.path d="M70 250 L262 215" stroke="#f4d18b" strokeWidth="3" markerEnd="url(#regionalArrow)" animate={{ x:[-8,8,-8] }} transition={{duration:2,repeat:Infinity}} />
      <motion.path d="M558 105 L430 128" stroke="#f4d18b" strokeWidth="3" markerEnd="url(#regionalArrow)" animate={{ x:[7,-7,7] }} transition={{duration:2,repeat:Infinity}} />
      <text x="35" y="277" fill="#d7eff1" fontSize="15" fontWeight="700">PLACA DE NAZCA</text><text x="443" y="109" fill="#fff1d4" fontSize="14" fontWeight="700">CARIBE</text><text x="390" y="247" fill="#fff1d4" fontSize="14" fontWeight="700">SURAMERICANA</text>
      <circle cx="317" cy="186" r="7" fill="#f0725e"/><circle cx="317" cy="186" r="18" fill="none" stroke="#f2aa78" strokeWidth="2"/><text x="337" y="189" fill="#fff" fontSize="12">zona sísmica andina</text>
      <text x="22" y="28" fill="#f3f7f8" fontSize="16" fontWeight="700">Subducción en el Pacífico y fallas corticales andinas</text>
    </> : <>
      <path d="M0 116 C102 91 183 122 270 86 S493 111 640 80V330H0Z" fill="url(#regionalLand)" />
      <path d="M84 154 C185 123 280 150 373 118 S510 140 616 102" fill="none" stroke="#e1b66c" strokeWidth="5" strokeDasharray="10 7" />
      <motion.path d="M98 190 L257 152" stroke="#f4d18b" strokeWidth="3" markerEnd="url(#regionalArrow)" animate={{ x:[-9,9,-9] }} transition={{duration:2,repeat:Infinity}} />
      <motion.path d="M543 106 L395 139" stroke="#f4d18b" strokeWidth="3" markerEnd="url(#regionalArrow)" animate={{ x:[9,-9,9] }} transition={{duration:2,repeat:Infinity}} />
      <text x="45" y="218" fill="#fff1d4" fontSize="15" fontWeight="700">PLACA CARIBE</text><text x="395" y="193" fill="#fff1d4" fontSize="14" fontWeight="700">SURAMERICANA</text>
      <text x="97" y="137" fill="#f8dfa8" fontSize="12">Boconó - San Sebastián - El Pilar</text>
      <circle cx="337" cy="133" r="7" fill="#f0725e"/><circle cx="337" cy="133" r="18" fill="none" stroke="#f2aa78" strokeWidth="2"/><text x="357" y="136" fill="#fff" fontSize="12">ruptura transcurrente</text>
      <text x="22" y="28" fill="#f3f7f8" fontSize="16" fontWeight="700">Desplazamiento lateral entre placas y fallas activas</text>
    </>}
    <text x="22" y="310" fill="#b4c2c8" fontSize="11">Flechas: movimiento relativo simplificado para fines educativos.</text>
  </svg>
}
