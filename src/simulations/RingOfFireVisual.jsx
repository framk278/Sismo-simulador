const COUNTRY_ART = {
  chile: { landmark: 'Andes y costa del Pacífico', photo: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80' },
  peru: { landmark: 'Cordillera de los Andes', photo: 'https://static1.evcdn.net/images/reduction/228109_w-3840_h-2160_q-70_m-crop.jpg' },
  colombia: { landmark: 'Volcanes de los Andes colombianos', photo: 'https://www.budgetbucketlist.com/uploads/2/9/4/6/29463439/manizales-32_orig.jpg' },
  mexico: { landmark: 'Arco volcánico mexicano', photo: 'https://www.dgcs.unam.mx/boletin/bdboletin/multimedia/WAV190315/187%281%29.jpg' },
  eeuu: { landmark: 'Costa oeste y falla de San Andrés', photo: 'https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&w=1200&q=80' },
  japon: { landmark: 'Arco de islas volcánicas', photo: 'https://png.pngtree.com/background/20250126/original/pngtree-majestic-mount-fuji-captured-with-its-snow-capped-summit-rocky-landscape-picture-image_16255884.jpg' },
  filipinas: { landmark: 'Arco insular de Filipinas', photo: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80' },
  indonesia: { landmark: 'Arco de Sonda', photo: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/a3/08/06/full-view-of-bromo-area.jpg?h=900&s=1&w=1200' },
  nz: { landmark: 'Alpes del Sur y falla Alpina', photo: 'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1200&q=80' },
}

export function RingOfFireVisual({ country }) {
  const art = COUNTRY_ART[country.id] ?? COUNTRY_ART.chile
  const label = `${country.name}: ${art.landmark}`

  return (
    <figure className="ring-visual">
      <div className="country-photo" style={{ backgroundImage: `linear-gradient(0deg, rgba(4, 13, 19, .78), rgba(4, 13, 19, .03)), url("${art.photo}")` }}>
        <span>{country.name}</span><small>{art.landmark}</small>
      </div>
      <figcaption>Fotografía real de un paisaje asociado al arco volcánico o tectónico del país.</figcaption>
    </figure>
  )
}
