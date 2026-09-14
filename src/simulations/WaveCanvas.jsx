import { useEffect, useRef } from 'react'

export function WaveCanvas({
  amplitude = 40,
  wavelength = 120,
  speed = 90,
  running = true,
  color = '#7a8b9a',
  particleMode = false,
  height = 200,
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const tRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let lastTime = performance.now()

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
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      if (running) tRef.current += dt

      const w = canvas.width / devicePixelRatio
      const h = height
      const midY = h / 2
      const k = (2 * Math.PI) / wavelength
      const omega = k * speed
      const t = tRef.current

      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = '#232830'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, midY)
      ctx.lineTo(w, midY)
      ctx.stroke()

      ctx.beginPath()
      for (let x = 0; x <= w; x += 1.5) {
        const y = midY + amplitude * Math.sin(k * x - omega * t) + amplitude * 0.08 * Math.sin(2 * k * x - omega * t * 1.15)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      if (particleMode) {
        const spacing = 28
        for (let x = spacing / 2; x < w; x += spacing) {
          const y = midY + amplitude * Math.sin(k * x - omega * t)
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.globalAlpha = 0.9
          ctx.fill()
          ctx.beginPath()
          ctx.arc(x, midY, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = '#6f6b64'
          ctx.fill()
          ctx.globalAlpha = 0.35
          ctx.beginPath()
          ctx.moveTo(x, midY)
          ctx.lineTo(x, y)
          ctx.strokeStyle = color
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [amplitude, wavelength, speed, running, color, particleMode, height])

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', borderRadius: 8 }} />
}
