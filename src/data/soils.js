// Valores aproximados con fines didácticos (no corresponden a un sitio real).
// Vs = velocidad de onda de corte, densidad relativa, factor de amplificación
// aproximado usado únicamente para la simulación educativa.
export const SOILS = [
  {
    id: 'roca',
    label: 'San José del Palmar (Roca Basáltica / GW)',
    description: 'Alta velocidad (> 760 m/s). La onda viaja muy rápido y de forma limpia. No hay amplificación: el suelo no se “sacude” más de la cuenta.',
    vs: 800, // m/s, valor representativo de una velocidad superior a 760 m/s
    density: 0.95, // relativo, 0-1
    amplification: 1.0,
    color: '#8a9099',
    particleSpacing: 10,
    particleJitter: 0.4,
  },
  {
    id: 'firme',
    label: 'Valle de Caracas (Aluvión Sedimentario / CL-SC)',
    description: 'Velocidad moderada-alta (320 m/s). La onda viaja de forma eficiente, pero la geometría del terreno (efecto cuenca) puede atrapar la energía.',
    vs: 320,
    density: 0.75,
    amplification: 1.4,
    color: '#6e7c8a',
    particleSpacing: 14,
    particleJitter: 1.1,
  },
  {
    id: 'blando',
    label: 'Cali (Limo-Arenoso / CL-SM) y La Guaira (Limos y Arenas / ML)',
    description: 'Velocidad baja (220 - 240 m/s). Al pasar de roca a este suelo, la onda se frena pero aumenta su amplitud. Provoca una fuerte amplificación sísmica en superficie.',
    vs: 230,
    density: 0.5,
    amplification: 2.1,
    color: '#a89070',
    particleSpacing: 20,
    particleJitter: 2.2,
  },
  {
    id: 'muyblando',
    label: 'Pereira / Eje Cafetero (Ceniza Volcánica / MH)',
    description: 'Velocidad muy baja (210 m/s). El suelo pierde rigidez fácilmente bajo carga. Favorece deformaciones severas, efectos topográficos y deslizamientos.',
    vs: 210,
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
