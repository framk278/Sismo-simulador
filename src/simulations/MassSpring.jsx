import { useEffect, useRef } from 'react'

// Oscilación libre amortiguada a partir de un desplazamiento inicial (fuerza aplicada
// convertida a desplazamiento estático x0 = F/k y luego liberada):
//   x(t) = x0 * e^(-ζ·ωn·t) · [cos(ωd·t) + (ζ/√(1-ζ²))·sin(ωd·t)]
// con ωn = √(k/m), ζ = c / (2√(k·m)), ωd = ωn·√(1-ζ²)
export function computeDynamics({ mass, stiffness, damping, force }) {
  const wn = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  const x0 = force / stiffness
  const period = zeta < 1 ? (2 * Math.PI) / (wn * Math.sqrt(1 - zeta * zeta)) : Infinity
  const freq = zeta < 1 ? 1 / period : 0
  return { wn, zeta, x0, period, freq }
}

export function displacementAt(t, { mass, stiffness, damping, force }) {
  const { wn, zeta, x0 } = computeDynamics({ mass, stiffness, damping, force })
  if (zeta >= 1) {
    // sobreamortiguado: decaimiento exponencial simple (aproximación educativa)
    return x0 * Math.exp(-wn * t)
  }
  const wd = wn * Math.sqrt(1 - zeta * zeta)
  return (
    x0 *
    Math.exp(-zeta * wn * t) *
    (Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t))
  )
}

export function MassSpring({ mass, stiffness, damping, force, running = true, height = 260, onSample }) {
  const canvasRef = useRef(null)
  const startRef = useRef(performance.now())

  useEffect(() => {
    startRef.current = performance.now()
  }, [mass, stiffness, damping, force])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    function draw(now) {
      const t = running ? (now - startRef.current) / 1000 : 0
      const w = canvas.width / devicePixelRatio
      const h = height

      const x = displacementAt(t, { mass, stiffness, damping, force })
      const { x0 } = computeDynamics({ mass, stiffness, damping, force })
      const scale = x0 !== 0 ? Math.min(70, 55 / Math.abs(x0)) : 40
      const pxOffset = x * scale

      ctx.clearRect(0, 0, w, h)

      const anchorY = 20
      const restY = h * 0.42
      const centerX = w / 2
      const massY = restY + pxOffset
      const massSize = 46

      ctx.fillStyle = '#323a46'
      ctx.fillRect(centerX - 70, anchorY - 8, 140, 8)

      const coils = 12
      const springTop = anchorY
      const springBottom = massY - massSize / 2
      const segH = (springBottom - springTop) / coils
      ctx.strokeStyle = '#8a8490'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX - 18, springTop)
      for (let i = 1; i < coils; i++) {
        const y = springTop + i * segH
        const dir = i % 2 === 0 ? 1 : -1
        ctx.lineTo(centerX - 18 + dir * 14, y)
      }
      ctx.lineTo(centerX - 18, springBottom)
      ctx.stroke()

      ctx.strokeStyle = '#5a6168'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX + 18, springTop)
      ctx.lineTo(centerX + 18, springBottom)
      ctx.stroke()
      ctx.fillStyle = '#3a4048'
      ctx.fillRect(centerX + 12, (springTop + springBottom) / 2 - 10, 12, 20)

      ctx.fillStyle = '#6a6258'
      ctx.strokeStyle = '#8a8074'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(centerX - massSize / 2, massY - massSize / 2, massSize, massSize, 4)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#e8e6e1'
      ctx.font = '600 11px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('m', centerX, massY + 4)
      ctx.textAlign = 'left'

      ctx.strokeStyle = '#3c4450'
      ctx.setLineDash([3, 4])
      ctx.beginPath()
      ctx.moveTo(centerX - 90, restY)
      ctx.lineTo(centerX + 90, restY)
      ctx.stroke()
      ctx.setLineDash([])

      if (onSample) onSample({ t, x })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [mass, stiffness, damping, force, running, height, onSample])

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', borderRadius: 8, background: 'var(--bg-1)' }} />
}
