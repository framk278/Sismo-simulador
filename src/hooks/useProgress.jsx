import { createContext, useContext, useMemo, useState, useCallback } from 'react'

const SECTIONS = [
  'inicio',
  'tectonica',
  'suelo',
  'mitigacion',
  'laboratorio',
  'simulador',
  'propuesta',
  'conclusiones',
  'referencias',
]

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [visited, setVisited] = useState(new Set(['inicio']))

  const markVisited = useCallback((id) => {
    setVisited((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const stats = useMemo(() => ({
    sectionProgress: Math.round((visited.size / SECTIONS.length) * 100),
  }), [visited])

  const value = useMemo(
    () => ({ visited, markVisited, stats, SECTIONS }),
    [visited, markVisited, stats]
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress debe usarse dentro de ProgressProvider')
  return ctx
}
