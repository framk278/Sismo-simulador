import { useEffect, useRef } from 'react'
import { buildShearSystem, computeStructureMetrics, groundAccel, stepShear } from './mdof.js'

export { computeStructureMetrics }

export function StructureAnimation({
  floors = 5,
  excitationFreq = 1.5,
  system = 'convencional',
  running = true,
  height = 320,
  soilAmplification = 1,
  active = true,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let t = 0
    let last = performance.now()
    const sys = buildShearSystem({ floors, system })
    let state = { u: Array(sys.dof).fill(0), v: Array(sys.dof).fill(0) }
    let ug = 0
    let ugv = 0

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
      const dt = Math.min((now - last) / 1000, 0.04)
      last = now
      const w = canvas.width / devicePixelRatio
      const h = height

      if (running && active) {
        t += dt
        const ugddot = groundAccel(t, excitationFreq, soilAmplification)
        const steps = Math.max(1, Math.ceil(dt / 0.004))
        const hstep = dt / steps
        for (let s = 0; s < steps; s++) {
            const aG = groundAccel(t - dt + (s + 1) * hstep, excitationFreq, soilAmplification)
            ugv += aG * hstep
            ug += ugv * hstep
            state = stepShear(sys, state, aG, hstep)
          }
          if (!Number.isFinite(state.u[0])) {
            state = { u: Array(sys.dof).fill(0), v: Array(sys.dof).fill(0) }
            ug = 0
            ugv = 0
          }
      }

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#161a20'
      ctx.fillRect(0, 0, w, h)

      const groundY = h - 36
      const scale = 42
      const gpx = ug * scale
      const n = sys.n
      const floorH = Math.min(28, (groundY - 48) / n)
      const bay = 52
      const left0 = w / 2 - bay
      const right0 = w / 2 + bay
      const slabW = bay * 2 + 28

      ctx.fillStyle = '#1a1f25'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#1d2429'
      ctx.fillRect(0, groundY, w, h - groundY)
      ctx.strokeStyle = '#3b444d'
      ctx.lineWidth = 1
      for (let x = ((gpx % 18) + 18) % 18; x < w; x += 18) {
        ctx.beginPath()
        ctx.moveTo(x, groundY)
        ctx.lineTo(x - 10, h)
        ctx.stroke()
      }
      ctx.strokeStyle = '#4b5862'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(w, groundY)
      ctx.stroke()

      const floorDisp = []
      if (sys.isolated) {
        floorDisp.push(state.u[0])
        for (let i = 1; i < sys.dof; i++) floorDisp.push(state.u[i])
      } else {
        for (let i = 0; i < n; i++) floorDisp.push(state.u[i])
      }

      const baseLift = sys.isolated ? 12 : 0
      const isolatorTop = groundY - baseLift

      if (sys.isolated) {
        const pads = 5
        for (let p = 0; p < pads; p++) {
          const px = w / 2 - slabW / 2 + 16 + p * ((slabW - 32) / (pads - 1)) + gpx * 0.15
          ctx.fillStyle = '#383f46'
          ctx.fillRect(px - 7, isolatorTop, 14, 12)
          ctx.fillStyle = '#6d7b86'
          for (let r = 0; r < 4; r++) {
            ctx.fillRect(px - 8, isolatorTop + 2 + r * 2.2, 16, 1.5)
          }
        }
      }

      const colW = 7
      for (let i = 0; i < n; i++) {
        const uThis = sys.isolated ? floorDisp[i + 1] : floorDisp[i]
        const uBelow = i === 0 ? (sys.isolated ? floorDisp[0] : 0) : (sys.isolated ? floorDisp[i] : floorDisp[i - 1])
        const xTop = gpx + uThis * scale
        const xBot = gpx + uBelow * scale
        const yTop = isolatorTop - (i + 1) * floorH
        const yBot = isolatorTop - i * floorH
        const drift = Math.abs(uThis - uBelow)
        const driftTint = Math.min(1, drift * 7)

        ctx.strokeStyle = mix('#55606a', '#b7815f', driftTint)
        ctx.lineWidth = colW
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(left0 + xBot, yBot)
        ctx.lineTo(left0 + xTop, yTop)
        ctx.moveTo(right0 + xBot, yBot)
        ctx.lineTo(right0 + xTop, yTop)
        ctx.stroke()

        if (system === 'disipadores' && i < n) {
          ctx.strokeStyle = '#7d8b77'
          ctx.lineWidth = 1.8
          ctx.beginPath()
          ctx.moveTo(left0 + xBot + 6, yBot - 4)
          ctx.lineTo(left0 + xTop + 16, yTop + 5)
          ctx.moveTo(right0 + xBot - 6, yBot - 4)
          ctx.lineTo(right0 + xTop - 16, yTop + 5)
          ctx.stroke()
          ctx.fillStyle = '#586157'
          ctx.fillRect(left0 + (xBot + xTop) / 2 + 4, (yBot + yTop) / 2 - 4, 18, 8)
          ctx.fillRect(right0 + (xBot + xTop) / 2 - 22, (yBot + yTop) / 2 - 4, 18, 8)
        }

        ctx.fillStyle = '#202931'
        ctx.strokeStyle = '#3d4853'
        ctx.lineWidth = 1.2
        roundRect(ctx, w / 2 - slabW / 2 + xTop, yTop - 5, slabW, 10, 2)
        ctx.fill()
        ctx.stroke()

        const winY = yTop + floorH * 0.28
        ctx.fillStyle = '#12191f'
        for (let k = 0; k < 3; k++) {
          ctx.fillRect(w / 2 - 36 + k * 24 + xTop, winY - floorH * 0.55, 14, Math.max(8, floorH * 0.42))
        }
      }

      ctx.fillStyle = '#98a4ac'
      ctx.font = '11px "JetBrains Mono", monospace'
      ctx.fillText(sys.isolated ? 'Base aislada · MDOF' : 'Pórtico de cortante MDOF', 12, 18)
      const roof = (sys.isolated ? floorDisp[n] : floorDisp[n - 1]) || 0
      ctx.fillText(`u techo ${(roof * 100).toFixed(1)} cm`, 12, 34)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [floors, excitationFreq, system, running, height, soilAmplification, active])

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', borderRadius: 8, background: 'var(--bg-1)' }} />
}

function mix(a, b, t) {
  const pa = hex(a)
  const pb = hex(b)
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t)
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t)
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t)
  return `rgb(${r},${g},${bl})`
}
function hex(c) {
  const n = c.replace('#', '')
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}
