import { motion } from 'framer-motion'

export function PlateAnimation({ type = 'convergente', running = true }) {
  const cycle = { duration: 4.2, repeat: running ? Infinity : 0, repeatType: 'mirror', ease: [0.4, 0, 0.2, 1] }

  return (
    <svg viewBox="0 0 640 220" width="100%" height="220" role="img" aria-label={`Corte de límite ${type}`}>
      <defs>
        <linearGradient id="mantle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a221c" />
          <stop offset="100%" stopColor="#1a1410" />
        </linearGradient>
        <linearGradient id="crustL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5360" />
          <stop offset="100%" stopColor="#323a46" />
        </linearGradient>
        <linearGradient id="crustR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5348" />
          <stop offset="100%" stopColor="#3a342c" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="640" height="220" fill="#14181f" rx="8" />
      <rect x="0" y="118" width="640" height="102" fill="url(#mantle)" />

      {type === 'convergente' && (
        <>
          <motion.g animate={{ x: running ? [0, 18] : 0 }} transition={cycle}>
            <path d="M0 96 L300 96 L300 118 L0 118 Z" fill="url(#crustL)" />
            <path d="M0 88 L300 88 L300 96 L0 96 Z" fill="#3d4654" />
            <path d="M240 96 L310 118 L300 160 L210 118 Z" fill="#323a46" opacity="0.9" />
          </motion.g>
          <motion.g animate={{ x: running ? [0, -10] : 0, y: running ? [0, -2] : 0 }} transition={cycle}>
            <path d="M318 70 L640 70 L640 118 L318 118 Z" fill="url(#crustR)" />
            <path d="M360 48 L430 48 L448 70 L372 70 Z" fill="#6a6358" />
            <path d="M500 40 L560 40 L575 70 L512 70 Z" fill="#6a6358" />
          </motion.g>
          <motion.path
            d="M292 100 C 310 130, 340 155, 390 188"
            fill="none"
            stroke="#a66d6d"
            strokeWidth="2.4"
            strokeDasharray="6 5"
            animate={{ strokeDashoffset: running ? [0, -24] : 0 }}
            transition={{ duration: 1.8, repeat: running ? Infinity : 0, ease: 'linear' }}
          />
          <text x="320" y="24" textAnchor="middle" fill="#a8a49c" fontSize="12" fontFamily="JetBrains Mono, monospace">
            Fosa · subducción · arco volcánico
          </text>
        </>
      )}

      {type === 'divergente' && (
        <>
          <motion.g animate={{ x: running ? [0, -22] : 0 }} transition={cycle}>
            <path d="M0 92 L300 92 L300 118 L0 118 Z" fill="url(#crustL)" />
          </motion.g>
          <motion.g animate={{ x: running ? [0, 22] : 0 }} transition={cycle}>
            <path d="M340 92 L640 92 L640 118 L340 118 Z" fill="url(#crustR)" />
          </motion.g>
          <motion.path
            d="M310 118 C 316 90, 324 90, 330 118"
            fill="#8a5a40"
            animate={{ opacity: running ? [0.45, 0.95, 0.45] : 0.7 }}
            transition={{ duration: 1.8, repeat: running ? Infinity : 0 }}
          />
          <motion.circle
            cx="320"
            cy="108"
            r="7"
            fill="#c4a574"
            animate={{ r: running ? [5, 9, 5] : 7, opacity: running ? [0.5, 1, 0.5] : 0.8 }}
            transition={{ duration: 1.8, repeat: running ? Infinity : 0 }}
          />
          <text x="320" y="24" textAnchor="middle" fill="#a8a49c" fontSize="12" fontFamily="JetBrains Mono, monospace">
            Dorsal · ascenso de magma · nueva corteza
          </text>
        </>
      )}

      {type === 'transformante' && (
        <>
          <motion.g animate={{ y: running ? [0, 16] : 0 }} transition={cycle}>
            <path d="M0 88 L320 88 L320 118 L0 118 Z" fill="url(#crustL)" />
            {[40, 90, 140, 190].map((x) => (
              <line key={x} x1={x} y1="70" x2={x} y2="88" stroke="#6f6b64" strokeWidth="2" />
            ))}
          </motion.g>
          <motion.g animate={{ y: running ? [0, -16] : 0 }} transition={cycle}>
            <path d="M320 88 L640 88 L640 118 L320 118 Z" fill="url(#crustR)" />
            {[380, 430, 480, 530].map((x) => (
              <line key={x} x1={x} y1="70" x2={x} y2="88" stroke="#6f6b64" strokeWidth="2" />
            ))}
          </motion.g>
          <line x1="320" y1="60" x2="320" y2="150" stroke="#a66d6d" strokeWidth="2" strokeDasharray="5 4" />
          <text x="320" y="24" textAnchor="middle" fill="#a8a49c" fontSize="12" fontFamily="JetBrains Mono, monospace">
            Deslizamiento lateral · falla transcurrente
          </text>
        </>
      )}
    </svg>
  )
}
