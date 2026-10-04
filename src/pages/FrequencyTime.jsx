import { useState } from 'react'
import { Panel, Slider, Button, StatChip } from '../components/Panel.jsx'
import { FrequencyTimeLab, SlowWaveSurface } from '../simulations/FrequencyTimeLab.jsx'

export function FrequencyTime() {
  const [frequency, setFrequency] = useState(1)
  const [amplitude, setAmplitude] = useState(42)
  const [running, setRunning] = useState(true)
  const period = 1 / frequency
  return <div className="stack">
    <Panel eyebrow="COMPONENTES FÍSICOS" title="Frecuencia y período de una onda" right={<Button variant="secondary" onClick={() => setRunning(v => !v)}>{running ? 'Pausar' : 'Reanudar'}</Button>}>
      <p className="lead">La frecuencia (f) indica cuántos ciclos ocurren cada segundo. El período (T) es el tiempo que tarda un ciclo completo. Son inversos: <strong>T = 1 / f</strong>.</p>
      <FrequencyTimeLab frequency={frequency} amplitude={amplitude} running={running} />
      <div className="controls"><Slider label="Frecuencia" value={frequency} min={0.25} max={3} step={0.05} unit=" Hz" onChange={setFrequency} accent="amber" /><Slider label="Amplitud visual" value={amplitude} min={12} max={70} onChange={setAmplitude} unit=" px" /></div>
      <div className="stats"><StatChip label="Frecuencia" value={frequency.toFixed(2)} unit=" Hz" accent="amber" /><StatChip label="Período" value={period.toFixed(2)} unit=" s" /><StatChip label="Relación" value="T = 1/f" /></div>
    </Panel>
    <Panel eyebrow="EFECTO EN SUPERFICIE" title="¿Por qué una onda lenta puede ser más dañina?">
      <p className="lead">Las ondas de período largo pueden mantener el empuje durante más tiempo. Si ese período se parece al período natural de un edificio, aparece resonancia y la respuesta puede crecer. No es solo la velocidad: importan la amplitud, el período, el suelo y la estructura.</p>
      <SlowWaveSurface frequency={frequency} running={running} />
    </Panel>
    <style>{`.stack{display:flex;flex-direction:column;gap:20px}.lead{color:var(--ink-1);font-size:13.5px;max-width:78ch;margin-bottom:14px}.controls{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px}.stats{display:flex;gap:10px;flex-wrap:wrap}@media(max-width:720px){.controls{grid-template-columns:1fr}}`}</style>
  </div>
}
