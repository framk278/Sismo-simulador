import { useEffect, useRef } from 'react'
import { buildShearSystem, computeStructureMetrics, groundAccel, stepShear } from './mdof.js'

export { computeStructureMetrics }

export function StructureAnimation({
  floors = 5,
  excitationFreq = 1.5,
  system = 'convencional',
  running = true,
  height = 360,
  soilAmplification = 1,
  excitationIntensity = 1,
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
    const roofTrail = []

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
        const steps = Math.max(1, Math.ceil(dt / 0.004))
        const hstep = dt / steps
        for (let s = 0; s < steps; s++) {
            const aG = groundAccel(t - dt + (s + 1) * hstep, excitationFreq, soilAmplification * excitationIntensity)
            state = stepShear(sys, state, aG, hstep)
          }
          if (!Number.isFinite(state.u[0])) {
            state = { u: Array(sys.dof).fill(0), v: Array(sys.dof).fill(0) }
          }
      }

      ctx.clearRect(0, 0, w, h)
      const groundY = h - 42
      const sky = ctx.createLinearGradient(0, 0, 0, groundY)
      sky.addColorStop(0, '#101821')
      sky.addColorStop(0.65, '#172633')
      sky.addColorStop(1, '#27333b')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)

      // La animación representa desplazamientos RELATIVOS de la estructura.
      // El suelo se comunica con las ondas del fondo, pero no arrastra el edificio
      // con una integración acumulada que produciría desplazamientos ficticios.
      const scale = 2400
      const gpx = 0
      const n = sys.n
      const floorH = Math.min(31, (groundY - 62) / n)
      const bay = 52
      const buildingCx = w > 650 ? w * 0.63 : w / 2
      const left0 = buildingCx - bay
      const right0 = buildingCx + bay
      const slabW = bay * 2 + 28

      const systemInfo = system === 'disipadores'
        ? { name: 'DISIPADORES VISCOSOS', color: '#c4a574', hint: 'disipan energía en cada entrepiso' }
        : sys.isolated
          ? { name: 'AISLAMIENTO SÍSMICO', color: '#8fb6b2', hint: 'desacopla la base del terreno' }
          : { name: 'PÓRTICO CONVENCIONAL', color: '#8e98a1', hint: 'la estructura recibe el movimiento' }

      // Horizonte urbano tenue: da escala al edificio sin competir con la simulación.
      ctx.fillStyle = 'rgba(9, 15, 20, .42)'
      const skyline = [42, 72, 50, 89, 62, 44, 76, 53, 68, 38, 58, 82]
      skyline.forEach((buildingH, index) => {
        const buildingW = 28 + (index % 3) * 10
        const x = (index * 97 - 42 + (t * 2) % 97)
        ctx.fillRect(x, groundY - buildingH, buildingW, buildingH)
        ctx.fillStyle = 'rgba(126, 158, 174, .14)'
        for (let row = 10; row < buildingH - 8; row += 12) {
          ctx.fillRect(x + 7, groundY - row, 3, 4)
          ctx.fillRect(x + buildingW - 10, groundY - row, 3, 4)
        }
        ctx.fillStyle = 'rgba(9, 15, 20, .42)'
      })

      // Cabecera y registro de la señal: la entrada sísmica se ve antes de llegar al edificio.
      ctx.fillStyle = 'rgba(31, 38, 45, 0.84)'
      roundRect(ctx, 12, 12, Math.min(242, w - 24), 47, 7)
      ctx.fill()
      ctx.fillStyle = systemInfo.color
      ctx.font = '600 11px "JetBrains Mono", monospace'
      ctx.fillText(systemInfo.name, 24, 31)
      ctx.fillStyle = '#98a4ac'
      ctx.font = '11px "Space Grotesk", sans-serif'
      ctx.fillText(systemInfo.hint, 24, 47)

      if (w > 500) {
        const chartX = 20
        const chartY = 76
        const chartW = Math.min(185, w * 0.27)
        const chartH = 48
        ctx.fillStyle = 'rgba(18, 25, 31, 0.84)'
        roundRect(ctx, chartX, chartY, chartW, chartH, 6)
        ctx.fill()
        ctx.strokeStyle = '#36414a'
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(chartX + 10, chartY + chartH / 2); ctx.lineTo(chartX + chartW - 10, chartY + chartH / 2); ctx.stroke()
        ctx.strokeStyle = '#c4a574'
        ctx.lineWidth = 1.8
        ctx.beginPath()
        for (let px = 0; px <= chartW - 20; px += 3) {
          const x = chartX + 10 + px
          const phase = t * excitationFreq * Math.PI * 2 + px * 0.13
          const y = chartY + chartH / 2 + Math.sin(phase) * (6 + soilAmplification * excitationIntensity * 3) * (0.72 + 0.28 * Math.sin(phase * .37))
          if (px === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.fillStyle = '#8e98a1'
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.fillText('MOVIMIENTO DEL TERRENO', chartX + 10, chartY + chartH + 15)
      }

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

      // Ondas que entran desde el suelo hacia la estructura.
      ctx.strokeStyle = 'rgba(196, 165, 116, .68)'
      ctx.lineWidth = 2
      for (let wave = 0; wave < 3; wave++) {
        const y = groundY - 17 - wave * 9
        ctx.beginPath()
        for (let x = 18; x < buildingCx - slabW / 2 - 24; x += 5) {
          const yy = y + Math.sin((x * .075) - t * excitationFreq * 4) * (3 + wave)
          if (x === 18) ctx.moveTo(x, yy)
          else ctx.lineTo(x, yy)
        }
        ctx.stroke()
      }

      const floorDisp = []
      if (sys.isolated) {
        floorDisp.push(state.u[0])
        for (let i = 1; i < sys.dof; i++) floorDisp.push(state.u[i])
      } else {
        for (let i = 0; i < n; i++) floorDisp.push(state.u[i])
      }

      const baseLift = sys.isolated ? 12 : 0
      const isolatorTop = groundY - baseLift
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

      // Se dibuja una deformada continua: cada piso hereda la posición del de abajo
      // y solo puede tener una deriva razonable respecto a él. Así se conserva la
      // lectura de un pórtico flexible en vez de estirar las columnas sin límite.
      const displayOffsets = []
      let previousOffset = sys.isolated ? clamp(floorDisp[0] * scale, -26, 26) : 0
      displayOffsets.push(previousOffset)
      for (let i = 0; i < n; i++) {
        const uThis = sys.isolated ? floorDisp[i + 1] : floorDisp[i]
        const uBelow = i === 0 ? (sys.isolated ? floorDisp[0] : 0) : (sys.isolated ? floorDisp[i] : floorDisp[i - 1])
        const visualDrift = clamp((uThis - uBelow) * scale, -floorH * 0.3, floorH * 0.3)
        previousOffset += visualDrift
        displayOffsets.push(previousOffset)
      }

      // Contorno en reposo: hace evidente cuánto se está deformando realmente el pórtico.
      ctx.save()
      ctx.strokeStyle = 'rgba(157, 173, 184, .23)'
      ctx.lineWidth = 1.2
      ctx.setLineDash([5, 5])
      for (let i = 0; i < n; i++) {
        const yTop = isolatorTop - (i + 1) * floorH
        const yBot = isolatorTop - i * floorH
        ctx.strokeRect(left0, yTop, bay * 2, yBot - yTop)
      }
      ctx.setLineDash([])
      ctx.restore()

      if (sys.isolated) {
        const pads = 5
        for (let p = 0; p < pads; p++) {
          const px = buildingCx - slabW / 2 + 16 + p * ((slabW - 32) / (pads - 1)) + displayOffsets[0]
          ctx.fillStyle = '#303b41'
          ctx.fillRect(px - 10, isolatorTop + 9, 20, 4)
          ctx.fillStyle = '#8fb6b2'
          for (let r = 0; r < 4; r++) {
            ctx.fillRect(px - 8, isolatorTop + 1 + r * 2.2, 16, 1.6)
          }
        }
        ctx.fillStyle = '#8fb6b2'
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.fillText('AISLADORES', buildingCx - 34, isolatorTop + 29)
      }

      const colW = 7
      for (let i = 0; i < n; i++) {
        const uThis = sys.isolated ? floorDisp[i + 1] : floorDisp[i]
        const uBelow = i === 0 ? (sys.isolated ? floorDisp[0] : 0) : (sys.isolated ? floorDisp[i] : floorDisp[i - 1])
        const xTop = displayOffsets[i + 1]
        const xBot = displayOffsets[i]
        const yTop = isolatorTop - (i + 1) * floorH
        const yBot = isolatorTop - i * floorH
        const drift = Math.abs(uThis - uBelow)
        const driftTint = Math.min(1, drift * 7)

        // Fachada acristalada, deformada con el marco estructural.
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(left0 + xBot + 5, yBot - 5)
        ctx.lineTo(right0 + xBot - 5, yBot - 5)
        ctx.lineTo(right0 + xTop - 5, yTop + 5)
        ctx.lineTo(left0 + xTop + 5, yTop + 5)
        ctx.closePath()
        const glass = ctx.createLinearGradient(0, yTop, 0, yBot)
        glass.addColorStop(0, `rgba(79, 113, 132, ${0.54 + driftTint * 0.12})`)
        glass.addColorStop(1, 'rgba(22, 37, 48, .82)')
        ctx.fillStyle = glass
        ctx.fill()
        ctx.strokeStyle = 'rgba(150, 192, 210, .25)'
        ctx.lineWidth = 1
        ctx.stroke()
        // Montantes centrales y reflejos del vidrio.
        for (let bayIndex = 1; bayIndex < 3; bayIndex++) {
          const fraction = bayIndex / 3
          const xBottom = left0 + xBot + fraction * bay * 2
          const xTopFacade = left0 + xTop + fraction * bay * 2
          ctx.beginPath(); ctx.moveTo(xBottom, yBot - 5); ctx.lineTo(xTopFacade, yTop + 5); ctx.stroke()
        }
        ctx.strokeStyle = 'rgba(202, 228, 235, .14)'
        ctx.beginPath(); ctx.moveTo(left0 + xBot + 12, yBot - 9); ctx.lineTo(left0 + xTop + 30, yTop + 9); ctx.stroke()
        ctx.restore()

        ctx.strokeStyle = mix('#55606a', '#b7815f', driftTint)
        ctx.lineWidth = colW
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(left0 + xBot, yBot)
        ctx.lineTo(left0 + xTop, yTop)
        ctx.moveTo(right0 + xBot, yBot)
        ctx.lineTo(right0 + xTop, yTop)
        ctx.stroke()

        // Columna central para que se lea como una estructura real de tres vanos.
        ctx.strokeStyle = mix('#47545f', '#ad765b', driftTint)
        ctx.lineWidth = 4.5
        ctx.beginPath()
        ctx.moveTo(buildingCx + xBot, yBot)
        ctx.lineTo(buildingCx + xTop, yTop)
        ctx.stroke()

        if (system === 'disipadores' && i < n) {
          ctx.strokeStyle = '#c4a574'
          ctx.lineWidth = 2.2
          ctx.beginPath()
          ctx.moveTo(left0 + xBot + 6, yBot - 4)
          ctx.lineTo(left0 + xTop + 16, yTop + 5)
          ctx.moveTo(right0 + xBot - 6, yBot - 4)
          ctx.lineTo(right0 + xTop - 16, yTop + 5)
          ctx.stroke()
          ctx.fillStyle = '#6f5139'
          const damperY = (yBot + yTop) / 2 - 4
          ctx.fillRect(left0 + (xBot + xTop) / 2 + 4, damperY, 20, 8)
          ctx.fillRect(right0 + (xBot + xTop) / 2 - 24, damperY, 20, 8)
          ctx.fillStyle = '#e2bc80'
          ctx.fillRect(left0 + (xBot + xTop) / 2 + 10, damperY + 2, 10, 4)
          ctx.fillRect(right0 + (xBot + xTop) / 2 - 20, damperY + 2, 10, 4)
        }

        ctx.fillStyle = '#28353e'
        ctx.strokeStyle = '#66808d'
        ctx.lineWidth = 1.2
        roundRect(ctx, buildingCx - slabW / 2 + xTop, yTop - 6, slabW, 12, 2)
        ctx.fill()
        ctx.stroke()

        const winY = yTop + floorH * 0.28
        ctx.fillStyle = '#172632'
        for (let k = 0; k < 3; k++) {
          ctx.fillRect(buildingCx - 36 + k * 24 + xTop, winY - floorH * 0.55, 15, Math.max(8, floorH * 0.42))
        }
      }

      const roof = (sys.isolated ? floorDisp[n] : floorDisp[n - 1]) || 0
      roofTrail.push(roof * scale)
      if (roofTrail.length > 96) roofTrail.shift()
      if (w > 500) {
        const traceX = w - 164
        const traceY = 18
        ctx.fillStyle = 'rgba(18, 25, 31, .84)'
        roundRect(ctx, traceX, traceY, 150, 52, 6); ctx.fill()
        ctx.strokeStyle = systemInfo.color; ctx.lineWidth = 1.6
        ctx.beginPath()
        roofTrail.forEach((value, index) => {
          const x = traceX + 7 + index * 1.42
          const y = traceY + 27 + Math.max(-17, Math.min(17, value * .62))
          if (index === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
        ctx.fillStyle = '#8e98a1'; ctx.font = '10px "JetBrains Mono", monospace'
        ctx.fillText('RESPUESTA DEL TECHO', traceX + 8, traceY + 45)
      }

      ctx.fillStyle = '#98a4ac'
      ctx.font = '11px "JetBrains Mono", monospace'
      ctx.fillText(`${n} niveles · ${sys.isolated ? 'base aislada' : 'pórtico MDOF'}`, 14, h - 14)
      ctx.fillStyle = systemInfo.color
      ctx.fillText(`u techo ${(roof * 100).toFixed(1)} cm`, w - 118, h - 14)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [floors, excitationFreq, system, running, height, soilAmplification, excitationIntensity, active])

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
