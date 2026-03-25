// Stripe Payment Links — substitua pelos seus links reais
const STRIPE_LINKS = {
  mensal: 'https://buy.stripe.com/SEU_LINK_MENSAL',
  anual:  'https://buy.stripe.com/SEU_LINK_ANUAL',
}

const OVERLAY_PRICES = {
  mensal: { label: 'Acesso Mensal', price: '49',  cents: ',00', sub: '/mês' },
  anual:  { label: 'Acesso Anual',  price: '497', cents: ',00', sub: '/ano' },
}

function StripeLogo() {
  return (
    <svg viewBox="0 0 60 25" fill="none" style={{ height: 16 }}>
      <path d="M5 10.2c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1V6.7c-1.4-.6-2.9-.8-4.3-.8C3.2 5.9.8 7.8.8 10.4c0 4.1 5.6 3.4 5.6 5.2 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v3.6c1.7.7 3.3 1 4.9 1 3.4 0 5.7-1.7 5.7-4.4 0-4.4-5.4-3.6-5.4-5.3zM15.4 2.3l-4 .8v14.6c0 2.7 2 4.2 4.2 4.2 1.3 0 2.3-.2 2.9-.5v-3.3c-.5.2-3 .9-3-1.4V9.3h3V6.1h-3l-.1-3.8zM22.7 8.2l-.3-2.1h-3.5v13.6h4.1v-9.2c1-1.3 2.6-1 3.1-.8V6.1c-.6-.2-2.6-.6-3.4 2.1zM27.7 6.1h4.1v13.6h-4.1V6.1zm0-4.1l4.1-.9v3.3l-4.1.9V2zM38.7 5.9c-1.6 0-2.7.8-3.2 1.3l-.2-1h-3.6v18l4.1-.9v-4.3c.6.4 1.4 1 2.8 1 2.8 0 5.4-2.3 5.4-7.2-.1-4.6-2.7-6.9-5.3-6.9zm-.9 10.6c-.9 0-1.5-.3-1.9-.8v-6.2c.4-.5 1-.9 1.9-.9 1.5 0 2.5 1.6 2.5 4 0 2.3-1 3.9-2.5 3.9zM54.5 12.8c0-4.4-2.1-7-4.9-7-2.7 0-5.2 2.6-5.2 7 0 4.6 2.3 6.9 5.6 6.9 1.6 0 2.8-.4 3.8-1v-3.1c-1 .5-2.1.8-3.5.8-1.4 0-2.6-.5-2.8-2.1h6.9c0-.2.1-1 .1-1.5zm-7-1.4c0-1.6 1-2.3 1.9-2.3.9 0 1.8.7 1.8 2.3h-3.7z"
        fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

function SecureBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 16, marginTop: 16, paddingTop: 16,
      borderTop: '0.5px solid rgba(255,255,255,0.08)',
    }}>
      {/* SSL lock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg viewBox="0 0 16 16" fill="rgba(255,255,255,0.35)" style={{ width: 12, height: 12 }}>
          <path d="M8 1a4 4 0 0 0-4 4v2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4zm2.5 6h-5V5a2.5 2.5 0 1 1 5 0v2z" />
        </svg>
        <span style={{
          fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
        }}>
          SSL Secure
        </span>
      </div>

      <div style={{
        width: 1, height: 14, background: 'rgba(255,255,255,0.1)',
      }} />

      {/* Stripe powered */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          fontSize: 9, letterSpacing: 1, color: 'rgba(255,255,255,0.3)',
        }}>
          Powered by
        </span>
        <StripeLogo />
      </div>
    </div>
  )
}

function PriceTag({ price, cents, sub, featured }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 2 }}>
        <span style={{
          fontSize: 12, color: featured ? 'var(--verde3)' : 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-body)',
        }}>
          R$
        </span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900,
          color: '#fff', lineHeight: 1,
        }}>
          {price}
        </span>
        <span style={{
          fontSize: 14, color: 'rgba(255,255,255,0.5)',
          fontFamily: 'var(--font-display)', fontWeight: 400,
        }}>
          {cents}
        </span>
      </div>
      <span style={{
        fontSize: 10, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic',
      }}>
        {sub}
      </span>
    </div>
  )
}

export default function PremiumOverlay({ isOpen, onClose }) {
  if (!isOpen) return null

  function handlePayment(plan) {
    window.open(STRIPE_LINKS[plan], '_blank')
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
          display: 'none',
        }}>
          <img
            src="/assets/botanica/peonia-real.jpg"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Arte Botanica"
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(2,44,34,0.85) 0%, rgba(2,44,34,0.2) 60%)',
          }} />
          <div style={{ position: 'absolute', bottom: 32, left: 28, right: 28 }}>
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
          {/* Close */}
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
              e atualizacoes semanais.
            </p>
          </header>

          {/* Plan cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* MONTHLY */}
            <button onClick={() => handlePayment('mensal')} style={{
              padding: '20px', border: '1px solid var(--borda)',
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
              <PriceTag {...OVERLAY_PRICES.mensal} />
            </button>

            {/* LIFETIME (featured) */}
            <button onClick={() => handlePayment('anual')} style={{
              padding: '20px',
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
                  {OVERLAY_PRICES.anual.label}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                  Economize 15% no plano anual
                </span>
              </div>
              <PriceTag {...OVERLAY_PRICES.anual} featured />
            </button>
          </div>

          {/* CTA */}
          <button onClick={() => handlePayment('anual')} style={{
            width: '100%', marginTop: 24,
            background: 'var(--verde2)', color: '#fff',
            padding: '16px 24px', borderRadius: 50, border: 'none',
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg viewBox="0 0 16 16" fill="#fff" style={{ width: 16, height: 16 }}>
              <path d="M1 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1H1V4zm0 3v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H1zm3 2h2a.5.5 0 0 1 0 1H4a.5.5 0 0 1 0-1zm0 2h4a.5.5 0 0 1 0 1H4a.5.5 0 0 1 0-1z" />
            </svg>
            Pagar com Cartao ou Pix
          </button>

          {/* Secure footer */}
          <SecureBadge />
        </div>
      </div>
    </div>
  )
}
