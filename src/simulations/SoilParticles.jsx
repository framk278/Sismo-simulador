import { useEffect, useRef } from 'react'

export function SoilParticles({ soil, running = true, height = 150, amplitude = 6 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let t = 0
    let last = performance.now()

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

    function seededRandom(seed) {
      let s = seed
      return () => {
        s = (s * 9301 + 49297) % 233280
        return s / 233280
      }
    }

    function draw(now) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (running) t += dt * 2.4

      const w = canvas.width / devicePixelRatio
      const h = height
      ctx.clearRect(0, 0, w, h)

      const rand = seededRandom(42)
      const spacing = soil.particleSpacing
      const jitter = soil.particleJitter
      const cols = Math.ceil(w / spacing)
      const rows = Math.ceil(h / spacing)
      const pts = []

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = c * spacing + spacing / 2 + (rand() - 0.5) * jitter * 4
          const baseY = r * spacing + spacing / 2 + (rand() - 0.5) * jitter * 4
          const phase = t + baseX * 0.04 + r * 0.12
          const x = baseX + Math.cos(phase) * amplitude * 0.25 * (jitter / 3 + 0.15)
          const y = baseY + Math.sin(phase) * amplitude * (jitter / 3.4 + 0.2)
          pts.push({ x, y, r, c })
        }
      }

      if (jitter < 1.2) {
        ctx.strokeStyle = soil.color + '55'
        ctx.lineWidth = 0.8
        pts.forEach((p, i) => {
          const right = pts[i + 1]
          const down = pts[i + cols]
          if (right && p.r === right.r) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(right.x, right.y)
            ctx.stroke()
          }
          if (down) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(down.x, down.y)
            ctx.stroke()
          }
        })
      }

      pts.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(1.6, 3.3 - jitter * 0.28), 0, Math.PI * 2)
        ctx.fillStyle = soil.color
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [soil, running, height, amplitude])

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', borderRadius: 8, background: 'var(--bg-1)' }} />
}
