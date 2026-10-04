import { useEffect, useRef } from 'react'

export function WaveTypeAnimation({ type = 'p', color = '#7a8b9a', running = true, height = 190 }) {
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

    function draw(now) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (running) t += dt * 2.2

      const w = canvas.width / devicePixelRatio
      const h = height
      ctx.clearRect(0, 0, w, h)

      const cols = Math.floor(w / 18)
      const rows = type === 'love' ? 6 : type === 'p' ? 5 : 4
      const gx = w / (cols + 1)
      const gy = h / (rows + 1.6)
      const amp = 11
      const k = 0.085

      ctx.strokeStyle = '#232830'
      ctx.setLineDash([3, 4])
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()
      ctx.setLineDash([])

      if (type === 'love') {
        const bands = 7
        const lines = 21
        const top = 32
        const bandH = (h - 72) / bands
        ctx.fillStyle = '#160b20'
        ctx.fillRect(0, 0, w, h)
        for (let row = 0; row <= bands; row++) {
          ctx.beginPath()
          for (let col = 0; col <= lines; col++) {
            const x = col * w / lines
            const phase = x * .05 - t * 2.1
            const y = top + row * bandH + Math.sin(phase) * 12 * (1 - row / (bands + 2))
            if (col === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
          }
          ctx.strokeStyle = '#d33ee8'; ctx.lineWidth = 1.25; ctx.stroke()
        }
        for (let col = 0; col <= lines; col++) {
          ctx.beginPath()
          for (let row = 0; row <= bands; row++) {
            const x0 = col * w / lines
            const phase = x0 * .05 - t * 2.1
            const x = x0 + Math.sin(phase) * 7 * (1 - row / (bands + 2))
            const y = top + row * bandH + Math.sin(phase) * 12 * (1 - row / (bands + 2))
            if (row === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
          }
          ctx.strokeStyle = '#9621b8'; ctx.lineWidth = 1; ctx.stroke()
        }
        ctx.fillStyle = '#f0b7ff'; ctx.font = '11px "JetBrains Mono", monospace'
        ctx.fillText('onda Love · corte horizontal transversal · sin componente vertical', 10, 18)
        ctx.fillText('propagación →', 10, h - 12)
        raf = requestAnimationFrame(draw)
        return
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const restX = (c + 1) * gx
          const restY = (r + 0.9) * gy
          const phase = k * restX - t
          let px = restX
          let py = restY

          if (type === 'p') {
            px = restX + amp * Math.sin(phase)
          } else if (type === 's') {
            py = restY + amp * Math.sin(phase)
          } else if (type === 'love') {
            // Love: corte HORIZONTAL transversal. En esta vista superior la
            // propagación va de izquierda a derecha y las partículas se mueven
            // norte-sur (arriba-abajo en pantalla), nunca verticalmente.
            const depth = r / Math.max(1, rows - 1)
            py = restY + amp * (1 - depth * 0.72) * Math.sin(phase)
          } else {
            const depth = r / (rows - 1)
            px = restX + amp * 0.55 * (1 - depth * 0.45) * Math.cos(phase)
            py = restY + amp * (1 - depth * 0.55) * Math.sin(phase)
          }

          ctx.strokeStyle = color + '40'
          ctx.beginPath()
          ctx.moveTo(restX, restY)
          ctx.lineTo(px, py)
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(px, py, 3.1, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        }
      }

      ctx.fillStyle = '#6f6b64'
      ctx.font = '11px "JetBrains Mono", monospace'
      ctx.fillText('dirección de propagación →', 10, h - 12)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [type, color, running, height])

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', borderRadius: 8, background: 'var(--bg-1)' }} />
}
