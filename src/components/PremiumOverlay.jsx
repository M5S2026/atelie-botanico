import { createCheckout } from '../lib/stripe.jsx'

const OVERLAY_PRICES = {
  mensal:    { label: 'Acesso Mensal',    price: 'R$ 49,00',  sub: 'por mês',              planId: 'artista' },
  vitalicio: { label: 'Acesso Vitalício', price: 'R$ 497,00', sub: 'à vista ou parcelado', planId: 'pro' },
}

export default function PremiumOverlay({ isOpen, onClose }) {
  if (!isOpen) return null

  function handleSelect(planId) {
    createCheckout(planId, 'BRL')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(2,44,34,0.95)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        maxWidth: 880, width: '100%', maxHeight: '90vh',
        background: 'var(--escuro2)', border: '1px solid var(--borda)',
        borderRadius: 24, overflow: 'hidden',
        display: 'flex', flexDirection: 'row',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }}>

        {/* LEFT: ASPIRATIONAL IMAGE (hidden on mobile) */}
        <div className="overlay-image" style={{
          width: '45%', position: 'relative', flexShrink: 0,
          display: 'none', // toggled via media query in CSS or JS
        }}>
          <img
            src="/assets/botanica/peonia-real.jpg"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Arte Botânica"
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(2,44,34,0.85) 0%, rgba(2,44,34,0.2) 60%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 32, left: 28, right: 28,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: 28, color: '#fff', lineHeight: 1.2, marginBottom: 6,
            }}>
              Domine a Parede
            </h2>
            <p style={{
              fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
              color: 'var(--verde3)', opacity: 0.8,
            }}>
              Do risco ao quadro perfeito
            </p>
          </div>
        </div>

        {/* RIGHT: OFFER */}
        <div style={{
          flex: 1, padding: '36px 28px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
          }}>
            ✕
          </button>

          {/* Header */}
          <header style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
              color: 'var(--verde3)', marginBottom: 10,
            }}>
              Acesso Premium
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
              color: '#fff', marginBottom: 8, lineHeight: 1.2,
            }}>
              Acesso <em style={{ color: 'var(--verde3)', fontStyle: 'italic' }}>Ilimitado</em>
            </h3>
            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)',
              lineHeight: 1.5,
            }}>
              Junte-se a mais de 500 artistas e tenha acesso a todos os riscos
              e atualizações semanais.
            </p>
          </header>

          {/* Plan cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* MONTHLY */}
            <button onClick={() => handleSelect(OVERLAY_PRICES.mensal.planId)} style={{
              padding: '18px 20px', border: '1px solid var(--borda)',
              borderRadius: 16, background: 'rgba(15,110,86,0.1)',
              cursor: 'pointer', textAlign: 'left', color: '#fff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              <div>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)',
                  fontStyle: 'italic', fontSize: 17, color: '#fff',
                }}>
                  {OVERLAY_PRICES.mensal.label}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  Cancele quando quiser
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)',
                  fontSize: 20, color: '#fff', fontWeight: 700,
                }}>
                  {OVERLAY_PRICES.mensal.price}
                </span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  {OVERLAY_PRICES.mensal.sub}
                </span>
              </div>
            </button>

            {/* LIFETIME (featured) */}
            <button onClick={() => handleSelect(OVERLAY_PRICES.vitalicio.planId)} style={{
              padding: '18px 20px',
              border: '2px solid var(--verde2)',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(15,110,86,0.25), rgba(12,68,124,0.2))',
              cursor: 'pointer', textAlign: 'left', color: '#fff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: 'var(--verde2)', color: '#fff',
                fontSize: 8, fontWeight: 700, letterSpacing: 2,
                padding: '4px 12px', borderRadius: '0 14px 0 10px',
                textTransform: 'uppercase',
              }}>
                Mais Popular
              </div>
              <div>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)',
                  fontStyle: 'italic', fontSize: 17, color: '#fff',
                }}>
                  {OVERLAY_PRICES.vitalicio.label}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                  Pague uma vez, use para sempre
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)',
                  fontSize: 20, color: '#fff', fontWeight: 700,
                }}>
                  {OVERLAY_PRICES.vitalicio.price}
                </span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                  {OVERLAY_PRICES.vitalicio.sub}
                </span>
              </div>
            </button>
          </div>

          {/* CTA */}
          <button onClick={() => handleSelect(OVERLAY_PRICES.vitalicio.planId)} style={{
            width: '100%', marginTop: 24,
            background: 'var(--verde2)', color: '#fff',
            padding: '16px', borderRadius: 50, border: 'none',
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s',
          }}>
            Desbloquear Minha Biblioteca
          </button>

          <p style={{
            textAlign: 'center', marginTop: 12,
            fontSize: 10, color: 'rgba(255,255,255,0.35)',
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            Pagamento Seguro via Stripe / Hotmart
          </p>
        </div>
      </div>
    </div>
  )
}
