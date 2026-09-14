export const BOUNDARY_TYPES = [
  {
    id: 'convergente',
    name: 'Convergente',
    description: 'Dos placas se acercan; una puede subducir bajo la otra o generar montañas.',
    example: 'Zona de subducción de Nazca bajo Sudamérica',
  },
  {
    id: 'divergente',
    name: 'Divergente',
    description: 'Las placas se separan y el magma asciende, formando nueva corteza.',
    example: 'Dorsal Mesoatlántica',
  },
  {
    id: 'transformante',
    name: 'Transformante',
    description: 'Las placas se deslizan lateralmente una respecto a la otra.',
    example: 'Falla de San Andrés',
  },
]

export const RING_OF_FIRE_COUNTRIES = [
  { id: 'chile', name: 'Chile', lon: -71.5, lat: -33.4, note: 'Subducción Nazca-Suramericana. Megaterremotos de interfaz y tsunami en el Pacífico.' },
  { id: 'peru', name: 'Perú', lon: -77.0, lat: -12.0, note: 'Fosa Perú-Chile. Sismicidad de interfaz e intermedia por la placa de Nazca.' },
  { id: 'colombia', name: 'Colombia', lon: -77.5, lat: 4.0, note: 'Margen pacífico andino: subducción de Nazca y sismicidad cortical en los Andes.' },
  { id: 'mexico', name: 'México', lon: -99.1, lat: 19.4, note: 'Subducción de Cocos. Sismos de interfaz y de slab, además de fallas corticales.' },
  { id: 'eeuu', name: 'EE. UU. (oeste)', lon: -122.4, lat: 37.8, note: 'Cascadia (subducción) al norte y San Andrés (transformante) en California.' },
  { id: 'japon', name: 'Japón', lon: 138.3, lat: 36.2, note: 'Confluencia de Pacífica, Filipina, Euroasiática y Norteamericana. Alta sismicidad.' },
  { id: 'filipinas', name: 'Filipinas', lon: 121.0, lat: 14.6, note: 'Fosas de Manila y Filipinas. Arco volcánico activo y sismos de subducción.' },
  { id: 'indonesia', name: 'Indonesia', lon: 106.8, lat: -6.2, note: 'Arco de Sonda. Subducción Indoaustraliana; megaterremotos y volcanes.' },
  { id: 'nz', name: 'Nueva Zelanda', lon: 174.8, lat: -41.3, note: 'Límite Pacífica-Australiana: Alpine Fault (transcurrente) y zona de Hikurangi.' },
]

export const COLOMBIA_VENEZUELA = {
  colombia: {
    plates: ['Nazca', 'Suramericana', 'Caribe'],
    zone: 'Costa Pacífica, Andes y margen Caribe',
    movement: 'Subducción de Nazca (convergente) y acortamiento andino',
    note: 'La sismicidad intermedia y profunda se asocia al slab de Nazca; en superficie dominan fallas corticales andinas.',
  },
  venezuela: {
    plates: ['Caribe', 'Suramericana'],
    zone: 'Norte del país, sistema Boconó–San Sebastián–El Pilar',
    movement: 'Predominantemente transformante, con componente oblicuo',
    note: 'La interacción lateral Caribe-Suramericana produce sismicidad cortical somera a lo largo del sistema de fallas del norte.',
  },
}

export const COLOMBIA_OUTLINE = [
  [-81.9, 12.4], [-81.2, 11.2], [-80.0, 11.2], [-78.6, 10.7], [-77.2, 10.5],
  [-76.0, 9.7], [-74.9, 8.4], [-73.8, 7.5], [-72.9, 6.6], [-72.2, 5.2],
  [-71.6, 4.1], [-71.0, 2.7], [-71.3, 0.9], [-72.1, -0.7], [-72.9, -2.5],
  [-74.1, -3.7], [-75.8, -4.1], [-77.3, -3.0], [-78.5, -1.2], [-79.8, 0.8],
  [-80.9, 3.0], [-81.1, 5.8], [-81.5, 8.8], [-81.8, 10.8], [-81.9, 12.4],
]

export const VENEZUELA_OUTLINE = [
  [-73.4, 12.1], [-72.2, 12.3], [-70.5, 12.6], [-68.8, 12.3], [-67.1, 11.8],
  [-65.7, 11.0], [-64.3, 9.5], [-63.3, 7.9], [-62.3, 6.0], [-61.8, 4.1],
  [-62.2, 2.1], [-63.0, 0.8], [-64.5, 0.6], [-66.2, 0.9], [-67.7, 2.0],
  [-68.8, 4.0], [-69.8, 6.5], [-70.7, 8.8], [-71.8, 10.5], [-72.7, 12.0],
  [-73.4, 12.1],
]

export const BOCONO_FAULT = [
  [-72.8, 9.3], [-71.8, 9.8], [-70.9, 10.1], [-70.1, 10.3], [-69.0, 10.6],
  [-68.0, 10.8], [-67.1, 10.9], [-66.2, 11.2],
]

export const ANDEAN_CITIES = [
  { name: 'Bogotá', lon: -74.08, lat: 4.71, country: 'colombia' },
  { name: 'Medellín', lon: -75.56, lat: 6.25, country: 'colombia' },
  { name: 'Cali', lon: -76.53, lat: 3.45, country: 'colombia' },
  { name: 'Cúcuta', lon: -72.51, lat: 7.89, country: 'colombia' },
  { name: 'Caracas', lon: -66.90, lat: 10.48, country: 'venezuela' },
  { name: 'Maracaibo', lon: -71.64, lat: 10.65, country: 'venezuela' },
  { name: 'Mérida', lon: -71.14, lat: 8.59, country: 'venezuela' },
]
