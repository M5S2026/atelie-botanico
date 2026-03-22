import { useState } from 'react'
import Home from './components/Home.jsx'
import Biblioteca from './components/Biblioteca.jsx'
import Estudio from './components/Estudio.jsx'
import Referencias from './components/Referencias.jsx'
import Projetor from './components/Projetor.jsx'
import Simulador from './components/Simulador.jsx'

const TABS = [
  { id: 'home',       icon: '🌿', label: 'Início'     },
  { id: 'biblioteca', icon: '🖼',  label: 'Riscos'     },
  { id: 'estudio',    icon: '✏️',  label: 'Estúdio'    },
  { id: 'referencias',icon: '📸',  label: 'Fotos'      },
  { id: 'projetor',   icon: '📱',  label: 'Projetor'   },
  { id: 'simulador',  icon: '🎨',  label: 'Parede'     },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [selectedRisco, setSelectedRisco] = useState(null)
  const [selectedRef, setSelectedRef] = useState(null)

  function goToProjetor(risco) {
    setSelectedRisco(risco)
    setSelectedRef(null)
    setTab('projetor')
  }

  function goToProjetorRef(ref) {
    setSelectedRef(ref)
    setSelectedRisco(null)
    setTab('projetor')
  }

  function goToProjetorCustom(customRisco) {
    setSelectedRef(customRisco)
    setSelectedRisco(null)
    setTab('projetor')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'home'        && <Home onNavigate={setTab} />}
        {tab === 'biblioteca'  && <Biblioteca onSelectRisco={goToProjetor} />}
        {tab === 'estudio'     && <Estudio onUseInProjetor={goToProjetorCustom} />}
        {tab === 'referencias' && <Referencias onSelectRef={goToProjetorRef} />}
        {tab === 'projetor'    && <Projetor risco={selectedRisco} referencia={selectedRef} />}
        {tab === 'simulador'   && <Simulador />}
      </main>

      <nav style={{
        display: 'flex', borderTop: '0.5px solid rgba(93,202,165,0.2)',
        background: 'rgba(2,44,34,0.97)', backdropFilter: 'blur(10px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        flexShrink: 0,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '8px 4px 10px', border: 'none',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            opacity: tab === t.id ? 1 : 0.45,
            transition: 'opacity 0.2s',
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{
              fontSize: 10, color: tab === t.id ? '#5DCAA5' : '#fff',
              fontFamily: 'var(--font-body)', fontWeight: tab === t.id ? 700 : 400,
            }}>{t.label}</span>
            {tab === t.id && (
              <div style={{ width: 20, height: 2, background: '#5DCAA5', borderRadius: 1, marginTop: 1 }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
