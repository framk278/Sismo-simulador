import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet'
import {
  RING_OF_FIRE_COUNTRIES,
  COLOMBIA_OUTLINE,
  VENEZUELA_OUTLINE,
  BOCONO_FAULT,
  ANDEAN_CITIES,
} from '../data/tectonics.js'

function toLatLng(coords) {
  return coords.map(([lon, lat]) => [lat, lon])
}

export function RingOfFireMap({ selectedId, onSelect }) {
  const pacificCenter = [12, -150]
  const ringArc = [
    [-60, 10], [-74, -5], [-88, -18], [-100, -30], [-116, -22], [-130, -8],
    [-146, 8], [-168, 23], [-172, 40], [-160, 52], [-136, 58], [-118, 52],
    [-105, 43], [-90, 36], [-75, 27], [-58, 18], [-42, 4], [-28, -16],
    [-12, -34], [4, -48], [20, -58], [40, -60], [62, -52], [80, -40],
    [98, -24], [118, -14], [144, -12], [168, -6], [176, 12], [170, 28],
    [150, 42], [120, 50], [80, 52], [50, 46], [20, 35], [-6, 24], [-30, 16],
    [-60, 10],
  ]

  return (
    <div className="tectonic-map">
      <MapContainer center={pacificCenter} zoom={2.15} scrollWheelZoom={false} className="leaflet-map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={toLatLng(ringArc)} pathOptions={{ color: '#bf7e5f', weight: 2.4, dashArray: '7 6', opacity: 0.9 }} />
        {RING_OF_FIRE_COUNTRIES.map((country) => {
          const active = selectedId === country.id
          return (
            <CircleMarker
              key={country.id}
              center={[country.lat, country.lon]}
              radius={active ? 8.5 : 5.8}
              pathOptions={{
                color: active ? '#f3d7b3' : '#8ea4b4',
                fillColor: active ? '#f3d7b3' : '#8ea4b4',
                fillOpacity: 1,
                weight: 1.7,
              }}
              eventHandlers={{ click: () => onSelect(country) }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <span>{country.name}</span>
              </Tooltip>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export function AndeanMap() {
  const andeanCenter = [7.2, -69.8]
  const colombia = toLatLng(COLOMBIA_OUTLINE)
  const venezuela = toLatLng(VENEZUELA_OUTLINE)
  const bocono = toLatLng(BOCONO_FAULT)

  return (
    <div className="tectonic-map">
      <MapContainer center={andeanCenter} zoom={5.2} scrollWheelZoom={false} className="leaflet-map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline positions={colombia} pathOptions={{ color: '#7e8f9c', weight: 2.5, fillOpacity: 0.14 }} />
        <Polyline positions={venezuela} pathOptions={{ color: '#b78e61', weight: 2.5, fillOpacity: 0.14 }} />
        <Polyline positions={bocono} pathOptions={{ color: '#bf7e5f', weight: 2.8, dashArray: '5 5' }} />

        {ANDEAN_CITIES.map((city) => (
          <CircleMarker
            key={city.name}
            center={[city.lat, city.lon]}
            radius={4.5}
            pathOptions={{ color: '#edf1f3', fillColor: '#edf1f3', fillOpacity: 1, weight: 1.2 }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <span>{city.name}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

