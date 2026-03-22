import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem('pwa-dismissed')) {
      setDismissed(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Hide if already installed
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    if (mediaQuery.matches) setDismissed(true)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setDeferredPrompt(null)
      setDismissed(true)
    }
  }

  function dismiss() {
    setDismissed(true)
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  if (dismissed || !deferredPrompt) return null

  return (
    <div style={{
      position: 'fixed', bottom: 70, left: 12, right: 12, zIndex: 1000,
      background: 'rgba(4,52,44,0.97)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(93,202,165,0.3)', borderRadius: 14,
      padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ fontSize: 28, flexShrink: 0 }}>🌿</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
          Adicionar à tela inicial
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
          Acesse o Ateliê direto do celular, funciona offline
        </div>
      </div>
      <button onClick={install} style={{
        padding: '8px 14px', fontSize: 12, fontWeight: 700,
        background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8,
        flexShrink: 0,
      }}>Instalar</button>
      <button onClick={dismiss} style={{
        padding: '8px', fontSize: 14, background: 'transparent',
        color: 'rgba(255,255,255,0.4)', border: 'none', flexShrink: 0,
      }}>✕</button>
    </div>
  )
}
