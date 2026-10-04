import { useEffect, useRef } from 'react'

export function FrequencyTimeLab({ frequency, amplitude, running = true, height = 230 }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf; let time = 0; let last = performance.now()
    const resize = () => { const w = canvas.parentElement.getBoundingClientRect().width; canvas.width = w * devicePixelRatio; canvas.height = height * devicePixelRatio; canvas.style.width = `${w}px`; canvas.style.height = `${height}px`; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0) }
    resize(); window.addEventListener('resize', resize)
    const draw = (now) => {
      const dt = Math.min(.04, (now - last) / 1000); last = now; if (running) time += dt
      const w = canvas.width / devicePixelRatio; const h = height; const mid = h * .54; const chartLeft = 24; const chartRight = w - 20
      ctx.fillStyle = '#141a20'; ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#34414a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(chartLeft, mid); ctx.lineTo(chartRight, mid); ctx.stroke()
      const period = 1 / frequency; const windowS = Math.max(2.5, Math.min(8, period * 4)); const pxPerSec = (chartRight - chartLeft) / windowS
      ctx.strokeStyle = '#c4a574'; ctx.lineWidth = 2.5; ctx.beginPath()
      for (let x = chartLeft; x <= chartRight; x += 2) { const localT = (x - chartLeft) / pxPerSec; const y = mid - amplitude * Math.sin(2 * Math.PI * frequency * (localT - time)); if (x === chartLeft) ctx.moveTo(x, y); else ctx.lineTo(x, y) }
      ctx.stroke()
      const arrowY = h - 38; const pWidth = period * pxPerSec; const x0 = chartLeft + 14
      ctx.strokeStyle = '#8fb6b2'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, arrowY); ctx.lineTo(Math.min(chartRight - 8, x0 + pWidth), arrowY); ctx.stroke()
      ctx.fillStyle = '#8fb6b2'; ctx.font = '11px "JetBrains Mono", monospace'; ctx.fillText(`T = ${period.toFixed(2)} s`, x0, arrowY - 8)
      ctx.fillStyle = '#8e98a1'; ctx.fillText(`ventana: ${windowS.toFixed(1)} s`, chartRight - 130, 22)
      ctx.fillText('tiempo →', chartRight - 58, h - 12)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw); return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [frequency, amplitude, running, height])
  return <canvas ref={ref} style={{ display: 'block', width: '100%', borderRadius: 8 }} />
}

export function SlowWaveSurface({ frequency, running = true, height = 210 }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current; const ctx = canvas.getContext('2d'); let raf; let time = 0; let last = performance.now()
    const resize = () => { const w = canvas.parentElement.getBoundingClientRect().width; canvas.width = w * devicePixelRatio; canvas.height = height * devicePixelRatio; canvas.style.width = `${w}px`; canvas.style.height = `${height}px`; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0) }
    resize(); window.addEventListener('resize', resize)
    const draw = (now) => { const dt = Math.min(.04, (now-last)/1000); last=now; if(running) time+=dt; const w=canvas.width/devicePixelRatio; const h=height; const slow = Math.max(.3, Math.min(2.8, frequency)); const longWave = 2.9 - slow * .45
      ctx.fillStyle='#141a20';ctx.fillRect(0,0,w,h);ctx.fillStyle='#252f34';ctx.fillRect(0,h*.64,w,h*.36)
      for(let x=0;x<w;x+=4){ const phase=(x/w)*Math.PI*2*longWave-time*slow*2; const y=h*.62+Math.sin(phase)*22; if(x===0){ctx.beginPath();ctx.moveTo(x,y)}else ctx.lineTo(x,y) } ctx.strokeStyle='#c4a574';ctx.lineWidth=3;ctx.stroke()
      for(let x=44;x<w-30;x+=56){const phase=(x/w)*Math.PI*2*longWave-time*slow*2; const y=h*.62+Math.sin(phase)*22; ctx.fillStyle='#7d8f7a';ctx.fillRect(x-13,y-30,26,30);ctx.fillStyle='#9ba9b1';ctx.fillRect(x-16,y-34,32,5)}
      ctx.fillStyle='#edf1f3';ctx.font='600 12px "JetBrains Mono", monospace';ctx.fillText(slow < 1.2 ? 'ONDA LENTA: periodo largo, empuja por más tiempo' : 'ONDA MÁS RÁPIDA: ciclos más cortos',16,25);ctx.fillStyle='#8e98a1';ctx.font='11px "JetBrains Mono", monospace';ctx.fillText('La vulnerabilidad depende también de la resonancia con la estructura.',16,44)
      raf=requestAnimationFrame(draw) }
    raf=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)}
  },[frequency,running,height])
  return <canvas ref={ref} style={{ display:'block',width:'100%',borderRadius:8 }} />
}
