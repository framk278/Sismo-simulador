const COUNTRY_ART = {
  chile: { landmark: 'Andes y costa del Pacífico', mountain: '#9aaec0', earth: '#9b5d42', ocean: '#2c718c', volcano: true },
  peru: { landmark: 'Cordillera de los Andes', mountain: '#b8a27e', earth: '#9d6249', ocean: '#317d94', volcano: true },
  colombia: { landmark: 'Costa Pacífica y cordillera', mountain: '#5f8d65', earth: '#835b45', ocean: '#2b7892', volcano: true },
  mexico: { landmark: 'Arco volcánico mexicano', mountain: '#a37d5b', earth: '#9c5944', ocean: '#297892', volcano: true },
  eeuu: { landmark: 'Costa oeste y falla de San Andrés', mountain: '#87999c', earth: '#8b5d48', ocean: '#2d748a', fault: true },
  japon: { landmark: 'Arco de islas volcánicas', mountain: '#839e8c', earth: '#8f5946', ocean: '#2c7690', volcano: true },
  filipinas: { landmark: 'Arco insular de Filipinas', mountain: '#6f9c75', earth: '#8f5946', ocean: '#2c7690', volcano: true },
  indonesia: { landmark: 'Arco de Sonda', mountain: '#779664', earth: '#955943', ocean: '#2b758b', volcano: true },
  nz: { landmark: 'Alpes del Sur y falla Alpina', mountain: '#8ba0a3', earth: '#8a5e4c', ocean: '#2e758a', fault: true },
}

export function RingOfFireVisual({ country }) {
  const art = COUNTRY_ART[country.id] ?? COUNTRY_ART.chile
  const label = `${country.name}: ${art.landmark}`

  return (
    <figure className="ring-visual">
      <svg viewBox="0 0 640 300" role="img" aria-label={label}>
        <defs>
          <linearGradient id="sky-ring" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b7d5df"/><stop offset="1" stopColor="#e8bd83"/></linearGradient>
          <linearGradient id="ocean-ring" x1="0" y1="0" x2="0" y2="1"><stop stopColor={art.ocean}/><stop offset="1" stopColor="#173947"/></linearGradient>
          <linearGradient id="land-ring" x1="0" y1="0" x2="0" y2="1"><stop stopColor={art.mountain}/><stop offset="1" stopColor={art.earth}/></linearGradient>
          <filter id="glow-ring"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="640" height="300" rx="12" fill="url(#sky-ring)" />
        <path d="M0 148 C80 140 150 153 235 145 S405 137 640 148V300H0Z" fill="url(#ocean-ring)" />
        <path d="M0 179 C95 163 145 188 225 174 S390 153 640 170V300H0Z" fill="#1a5262" opacity=".6" />
        <path d="M318 131 C360 93 398 91 439 124 C475 83 526 79 580 133 L640 154 V300 H268 L290 192Z" fill="url(#land-ring)" />
        <path d="M277 169 C350 153 441 161 640 147" fill="none" stroke="#f2e1ba" strokeWidth="3" opacity=".9" />
        <path d="M0 190 C98 174 168 196 271 183" fill="none" stroke="#b7e6ec" strokeWidth="2" opacity=".75" />
        <path d="M0 217 C96 201 180 224 272 209" fill="none" stroke="#78bfcc" strokeWidth="2" opacity=".55" />
        <path d="M286 195 C330 188 350 184 382 177" stroke="#e6b56e" strokeWidth="5" strokeDasharray="9 7" fill="none" />
        <text x="286" y="215" fill="#fff5df" fontSize="12" fontFamily="JetBrains Mono, monospace">ZONA DE SUBDUCCIÓN</text>
        {art.volcano && <>
          <path d="M449 126 L478 70 L507 126Z" fill="#4f4945" />
          <path d="M462 102 L478 70 L492 102Z" fill="#6a3830" />
          <path d="M478 71 C466 50 491 45 480 23 C504 47 492 57 501 73" fill="none" stroke="#e77945" strokeWidth="5" filter="url(#glow-ring)" />
          <text x="449" y="147" fill="#fff5df" fontSize="11" fontFamily="JetBrains Mono, monospace">VOLCANISMO</text>
        </>}
        {art.fault && <>
          <path d="M471 94 L450 123 L476 142 L449 177" fill="none" stroke="#f0c67c" strokeWidth="4" strokeDasharray="7 5" />
          <text x="488" y="177" fill="#fff5df" fontSize="11" fontFamily="JetBrains Mono, monospace">FALLA ACTIVA</text>
        </>}
        <circle cx="375" cy="181" r="7" fill="#f16e57" filter="url(#glow-ring)" />
        <circle cx="375" cy="181" r="16" fill="none" stroke="#f5b07c" strokeWidth="2" opacity=".8" />
        <text x="393" y="184" fill="#fff5df" fontSize="12" fontFamily="JetBrains Mono, monospace">FOCO SÍSMICO</text>
        <rect x="18" y="18" width="222" height="50" rx="8" fill="rgba(12, 26, 34, .76)" />
        <text x="32" y="40" fill="#fff" fontWeight="700" fontSize="17">{country.name}</text>
        <text x="32" y="57" fill="#cde1e6" fontSize="11">{art.landmark}</text>
      </svg>
      <figcaption>Ilustración educativa del contexto tectónico local: océano, subducción y actividad sísmica.</figcaption>
    </figure>
  )
}
