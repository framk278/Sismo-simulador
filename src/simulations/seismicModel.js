import { getSoil } from '../data/soils.js'
import { integrateSeries } from './mdof.js'

export function structureResponseAt({ t, floors, excitationFreq, system, soilId, duration = 12 }) {
  const series = generateSeries({ floors, excitationFreq, system, soilId, duration, dt: 0.04 })
  const i = Math.min(series.length - 1, Math.max(0, Math.round(t / 0.04)))
  const displacement = (series[i]?.displacement ?? 0) / 100
  const omega = 2 * Math.PI * excitationFreq
  return { displacement, acceleration: -displacement * omega * omega }
}

export function generateSeries({ floors, excitationFreq, system, soilId, duration = 12, dt = 0.02 }) {
  const soil = getSoil(soilId)
  const { points } = integrateSeries({
    floors,
    excitationFreq,
    system,
    soilAmp: soil.amplification,
    duration,
    dt,
  })
  return points
}

export function peakStats({ floors, excitationFreq, system, soilId, duration = 12 }) {
  const soil = getSoil(soilId)
  const { maxDisplacementCm, maxAccelerationMs2 } = integrateSeries({
    floors,
    excitationFreq,
    system,
    soilAmp: soil.amplification,
    duration,
    dt: 0.012,
  })
  return { maxDisplacementCm, maxAccelerationMs2 }
}
