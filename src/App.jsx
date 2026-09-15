import { useEffect, useState } from 'react'
import { ProgressProvider, useProgress } from './hooks/useProgress.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { Topbar } from './components/Topbar.jsx'
import { Home } from './pages/Home.jsx'
import { Tectonics } from './pages/Tectonics.jsx'
import { SiteEffects } from './pages/SiteEffects.jsx'
import { Proposal } from './pages/Proposal.jsx'
import { Mitigation } from './pages/Mitigation.jsx'
import { MassSpringLab } from './pages/MassSpringLab.jsx'
import { SeismicSimulator } from './pages/SeismicSimulator.jsx'
import { Conclusions } from './pages/Conclusions.jsx'
import { References } from './pages/References.jsx'

const PAGE_META = {
  inicio: { title: 'Sismolab', subtitle: 'Laboratorio virtual de ingeniería sísmica' },
  tectonica: { title: 'Contexto tectónico', subtitle: 'De dónde proviene la energía sísmica' },
  suelo: { title: 'Medios y efectos de sitio', subtitle: 'El suelo transforma la señal sísmica' },
  propuesta: { title: 'Propuesta: ladrillo PET', subtitle: 'Alternativa educativa para redistribuir vibraciones' },
  mitigacion: { title: 'Mitigación estructural', subtitle: 'Cómo responde una estructura y cómo controlarla' },
  laboratorio: { title: 'Laboratorio masa-resorte', subtitle: 'Mide período, frecuencia y amortiguamiento' },
  simulador: { title: 'Simulador sísmico', subtitle: 'Integra suelo, estructura y sistema de mitigación' },
  conclusiones: { title: 'Conclusiones', subtitle: 'Síntesis del laboratorio virtual' },
  referencias: { title: 'Referencias', subtitle: 'Fuentes bibliográficas y técnicas' },
}

function Shell() {
  const [page, setPage] = useState('inicio')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited(page)
  }, [page, markVisited])

  function renderPage() {
    switch (page) {
      case 'inicio':
        return <Home onNavigate={setPage} />
      case 'tectonica':
        return <Tectonics />
      case 'suelo':
        return <SiteEffects />
      case 'propuesta':
        return <Proposal />
      case 'mitigacion':
        return <Mitigation />
      case 'laboratorio':
        return <MassSpringLab />
      case 'simulador':
        return <SeismicSimulator />
      case 'conclusiones':
        return <Conclusions onNavigate={setPage} />
      case 'referencias':
        return <References />
      default:
        return <Home onNavigate={setPage} />
    }
  }

  const meta = PAGE_META[page]

  return (
    <div className="shell">
      <Sidebar current={page} onNavigate={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="shell-main">
        <Topbar title={meta.title} subtitle={meta.subtitle} onMenu={() => setSidebarOpen(true)} />
        <main className="shell-content">{renderPage()}</main>
      </div>

      <style>{`
        .shell { display: flex; min-height: 100vh; }
        .shell-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .shell-content { padding: 26px 28px 60px; max-width: 1180px; width: 100%; margin: 0 auto; }
        @media (max-width: 640px) {
          .shell-content { padding: 18px 16px 40px; }
        }
      `}</style>
    </div>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  )
}
