import { useState } from 'react'
import { supabase } from '../lib/supabase.jsx'
import { checkRateLimit, recordFailedAttempt, resetAttempts, safeErrorMessage } from '../lib/security.jsx'

export default function AdminLogin({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    const limit = checkRateLimit()
    if (!limit.allowed) {
      setError(limit.error)
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({
      email, password,
    })

    if (authError) {
      recordFailedAttempt()
      setError(safeErrorMessage())
    } else {
      resetAttempts()
    }
    setLoading(false)
  }

  return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <form onSubmit={handleLogin} style={{
        maxWidth: 360, width: '100%', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <header style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
            color: 'var(--verde3)', marginBottom: 10,
          }}>
            Area Restrita
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 24, color: '#fff', marginBottom: 6,
          }}>
            Painel Admin
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Acesso exclusivo para administradores
          </p>
        </header>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{
            width: '100%', padding: '14px 16px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--borda)', borderRadius: 12,
            color: '#fff', fontSize: 14,
            fontFamily: 'var(--font-body)', outline: 'none',
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{
            width: '100%', padding: '14px 16px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--borda)', borderRadius: 12,
            color: '#fff', fontSize: 14,
            fontFamily: 'var(--font-body)', outline: 'none',
          }}
        />

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.3)',
            fontSize: 12, color: '#fca5a5', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 50,
          background: loading ? 'rgba(255,255,255,0.1)' : 'var(--verde2)',
          color: '#fff', border: 'none',
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 15, fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer',
        }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <button type="button" onClick={onBack} style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.35)', fontSize: 12,
          fontStyle: 'italic', fontFamily: 'var(--font-display)',
          cursor: 'pointer', padding: 8,
        }}>
          Voltar para o Atelie
        </button>
      </form>
    </div>
  )
}
