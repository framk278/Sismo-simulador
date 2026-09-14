// Modelo de masa concentrada para edificio de cortante MDOF.
// Mantiene un comportamiento educativo, pero con una formulación más realista de
// rigidez por nivel, masa variable y amortiguamiento proporcional.

function storyStiffness(floors, storyMass, mode = 1) {
  const n = Math.max(1, floors)
  const basePeriod = 0.09 * n + 0.12
  const w1 = (2 * Math.PI) / basePeriod
  const stiffnessFactor = mode === 1 ? 1 : 0.88
  const lateralStiffness = storyMass * (w1 ** 2) / stiffnessFactor
  return lateralStiffness
}

export function buildShearSystem({ floors, system }) {
  const n = Math.max(1, floors)
  const isolated = system === 'aislamiento'
  const dof = isolated ? n + 1 : n

  const storyMasses = Array.from({ length: n }, (_, i) => 1 + 0.18 * (n - i))
  const m = [...storyMasses]
  if (isolated) m.unshift(0.55 * storyMasses.reduce((a, b) => a + b, 0) / n)

  const baseK = storyStiffness(n, 1.25)
  const k = Array.from({ length: dof }, (_, i) => {
    const levelFactor = 1 + (i / Math.max(1, dof - 1)) * 0.9
    return baseK * levelFactor
  })

  if (isolated) {
    const totalSuperMass = m.slice(1).reduce((a, b) => a + b, 0)
    const Tiso = 2.2
    k[0] = totalSuperMass * ((2 * Math.PI) / Tiso) ** 2
  }

  const T1 = isolated ? 2.4 : 0.12 * n + 0.18
  const w1 = (2 * Math.PI) / T1
  const zeta = system === 'disipadores' ? 0.16 : isolated ? 0.11 : 0.06
  const alpha = 2 * zeta * w1 * 0.55
  const beta = (2 * zeta * 0.55) / w1
  const damperC = system === 'disipadores' ? 0.18 * Math.sqrt(baseK * storyMasses[0]) : 0

  return { n, dof, isolated, m, k, alpha, beta, damperC, T1, zeta, kStory: baseK }
}

function accel(sys, u, v, ugddot) {
  const { dof, m, k, alpha, beta, damperC } = sys
  const a = new Array(dof)
  for (let i = 0; i < dof; i++) {
    const ki = k[i]
    const kip = i < dof - 1 ? k[i + 1] : 0
    const uim = i > 0 ? u[i - 1] : 0
    const uip = i < dof - 1 ? u[i + 1] : 0
    const vim = i > 0 ? v[i - 1] : 0
    const vip = i < dof - 1 ? v[i + 1] : 0

    const fK = ki * (u[i] - uim) - kip * (uip - u[i])
    const fCRayleigh = alpha * m[i] * v[i] + beta * (ki * (v[i] - vim) - kip * (vip - v[i]))
    const fDamp = damperC * ((v[i] - vim) - (i < dof - 1 ? vip - v[i] : 0))
    a[i] = (-fK - fCRayleigh - fDamp) / m[i] - ugddot
  }
  return a
}

export function stepShear(sys, state, ugddot, dt) {
  const { u, v } = state
  const a0 = accel(sys, u, v, ugddot)
  const vMid = v.map((vi, i) => vi + a0[i] * dt)
  const u1 = u.map((ui, i) => ui + vMid[i] * dt)
  const a1 = accel(sys, u1, vMid, ugddot)
  const v1 = v.map((vi, i) => vi + 0.5 * (a0[i] + a1[i]) * dt)
  return { u: u1, v: v1, a: a1 }
}

export function envelope(t, duration) {
  const rise = duration * 0.15
  const fall = duration * 0.55
  if (t < rise) return t / rise
  if (t < fall) return 1
  const tail = duration - fall
  return Math.max(0, 1 - (t - fall) / tail)
}

export function groundAccel(t, freq, soilAmp, duration = Infinity) {
  const env = Number.isFinite(duration) ? envelope(t, duration) : 1
  const omega = 2 * Math.PI * freq
  return 0.35 * soilAmp * env * Math.sin(omega * t)
}

export function integrateSeries({ floors, excitationFreq, system, soilAmp = 1, duration = 12, dt = 0.01 }) {
  const sys = buildShearSystem({ floors, system })
  let state = { u: Array(sys.dof).fill(0), v: Array(sys.dof).fill(0) }
  const points = []
  let maxRoof = 0
  let maxAccel = 0
  let ug = 0
  let ugv = 0

  for (let t = 0; t <= duration; t += dt) {
    const ugddot = groundAccel(t, excitationFreq, soilAmp, duration)
    ugv += ugddot * dt
    ug += ugv * dt
    const sub = Math.max(1, Math.ceil(dt / 0.004))
    const h = dt / sub
    for (let s = 0; s < sub; s++) {
      state = stepShear(sys, state, ugddot, h)
    }
    const roof = state.u[sys.dof - 1]
    const roofAbs = roof
    maxRoof = Math.max(maxRoof, Math.abs(roofAbs))
    maxAccel = Math.max(maxAccel, Math.abs(state.a[sys.dof - 1]))
    points.push({
      t: Number(t.toFixed(2)),
      displacement: Number((roofAbs * 100).toFixed(3)),
    })
  }

  return {
    points,
    maxDisplacementCm: maxRoof * 100,
    maxAccelerationMs2: maxAccel,
    naturalFreq: 1 / sys.T1,
    dampingRatio: sys.zeta,
    frequencyRatio: excitationFreq * sys.T1,
  }
}

export function computeStructureMetrics({ floors, excitationFreq, system }) {
  const sys = buildShearSystem({ floors, system })
  const r = excitationFreq * sys.T1
  const z = sys.zeta
  const M = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * z * r) ** 2)
  return {
    naturalFreq: 1 / sys.T1,
    frequencyRatio: r,
    amplification: Math.min(M, 12),
    dampingRatio: z,
    period: sys.T1,
  }
}
