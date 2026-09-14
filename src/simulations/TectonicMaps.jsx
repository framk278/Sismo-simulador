import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Marker, Tooltip, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'

const epicenterIcon = divIcon({
  className: 'epicenter-icon',
  html: '<span class="epicenter-pulse"><span class="epicenter-core">✦</span></span>',
  iconSize: [76, 76],
  iconAnchor: [38, 38],
  tooltipAnchor: [0, -34],
})

function MapFocus({ center, zoom }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [map, center, zoom])

  return null
}

export function RegionalEventMap({ country, event }) {
  return (
    <div className="tectonic-map">
      <MapContainer center={event.center} zoom={event.zoom} scrollWheelZoom={false} className="leaflet-map regional-map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus center={event.center} zoom={event.zoom} />

        <Marker position={[event.epicenter.lat, event.epicenter.lon]} icon={epicenterIcon}>
          <Tooltip permanent direction="top" offset={[0, -10]} opacity={0.95}>
            <span>{event.epicenter.name}</span>
          </Tooltip>
        </Marker>
        {event.affected.map((city) => (
          <CircleMarker
            key={city.name}
            center={[city.lat, city.lon]}
            radius={8}
            pathOptions={{ color: '#fff5e5', fillColor: '#c99563', fillOpacity: 0.95, weight: 2.5 }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <span>Zona destacada: {city.name}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
