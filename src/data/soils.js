// Valores aproximados con fines didácticos (no corresponden a un sitio real).
// Vs = velocidad de onda de corte, densidad relativa, factor de amplificación
// aproximado usado únicamente para la simulación educativa.
export const SOILS = [
  {
    id: 'roca',
    label: 'Roca',
    description: 'Material rígido y muy compacto. Las ondas viajan rápido y con poca amplificación.',
    vs: 760, // m/s, aproximado (límite típico tipo B según clasificaciones NEHRP)
    density: 0.95, // relativo, 0-1
    amplification: 1.0,
    color: '#8a9099',
    particleSpacing: 10,
    particleJitter: 0.4,
  },
  {
    id: 'firme',
    label: 'Suelo firme',
    description: 'Suelo denso o roca blanda. Amplifica moderadamente la señal sísmica.',
    vs: 400,
    density: 0.75,
    amplification: 1.4,
    color: '#6e7c8a',
    particleSpacing: 14,
    particleJitter: 1.1,
  },
  {
    id: 'blando',
    label: 'Suelo blando',
    description: 'Depósito poco consolidado. Tiende a amplificar notablemente el movimiento.',
    vs: 200,
    density: 0.5,
    amplification: 2.1,
    color: '#a89070',
    particleSpacing: 20,
    particleJitter: 2.2,
  },
  {
    id: 'muyblando',
    label: 'Suelo muy blando',
    description: 'Sedimentos saturados y sueltos. Mayor riesgo de amplificación y resonancia.',
    vs: 120,
    density: 0.3,
    amplification: 2.9,
    color: '#9a7a62',
    particleSpacing: 28,
    particleJitter: 3.4,
  },
]

export function getSoil(id) {
  return SOILS.find((s) => s.id === id) ?? SOILS[0]
}
