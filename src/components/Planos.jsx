import { useState } from 'react'
import { PLANS, createCheckout, detectCurrency, formatPrice } from '../lib/stripe.jsx'

export default function Planos({ onClose }) {
  const [currency, setCurrency] = useState(detectCurrency)
  const [method, setMethod] = useState('stripe') // stripe | paypal

  function handleCheckout(planId) {
    if (planId === 'florzinha') {
      if (onClose) onClose()
      return
    }
    if (method === 'stripe') {
      createCheckout(planId, currency)
    } else {
      alert('PayPal será integrado em breve. Use Stripe por enquanto.')
    }
  }

  const plans = Object.values(PLANS)

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 16px 100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--verde3)',
          marginBottom: 10,
        }}>Planos e preços</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
          color: '#fff', marginBottom: 10, lineHeight: 1.2,
        }}>
          Escolha o plano <em style={{ color: 'var(--verde3)', fontStyle: 'italic' }}>ideal para você</em>
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
          Pagamento 100% seguro. Cancele quando quiser.
        </p>
      </div>

      {/* Currency + Method toggles */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 50, padding: 3 }}>
          {['BRL', 'JPY'].map(c => (
            <button key={c} onClick={() => setCurrency(c)} style={{
              padding: '6px 16px', fontSize: 11, fontWeight: 600, borderRadius: 50, border: 'none',
              background: currency === c ? 'var(--verde2)' : 'transparent',
              color: currency === c ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>{c === 'BRL' ? '🇧🇷 BRL' : '🇯🇵 JPY'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 50, padding: 3 }}>
          {[{ id: 'stripe', label: 'Stripe' }, { id: 'paypal', label: 'PayPal' }].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{
              padding: '6px 14px', fontSize: 11, fontWeight: 600, borderRadius: 50, border: 'none',
              background: method === m.id ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: method === m.id ? '#fff' : 'rgba(255,255,255,0.4)',
            }}>{m.label}</button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400, margin: '0 auto' }}>
        {plans.map(plan => {
          const price = plan.prices[currency]
          const period = typeof plan.period === 'object' ? plan.period[currency] : plan.period
          const isFree = plan.id === 'florzinha'
          const isPro = plan.id === 'pro'

          const cardBg = isFree
            ? 'rgba(255,255,255,0.05)'
            : isPro
              ? 'linear-gradient(135deg, rgba(12,68,124,0.4), rgba(180,83,9,0.2))'
              : 'rgba(15,110,86,0.18)'
          const cardBorder = isFree
            ? '1px solid rgba(255,255,255,0.12)'
            : isPro
              ? '1px solid rgba(217,119,6,0.4)'
              : '2px solid var(--verde2)'
          const btnClass = isFree
            ? { bg: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }
            : isPro
              ? { bg: 'linear-gradient(135deg, var(--ouro2), var(--ouro))', color: '#fff', border: 'none' }
              : { bg: 'var(--verde2)', color: '#fff', border: 'none' }

          return (
            <div key={plan.id} style={{
              background: cardBg, border: cardBorder,
              borderRadius: 28, padding: '28px 24px', position: 'relative',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'var(--verde2)', color: '#fff', fontSize: 10, fontWeight: 700,
                  letterSpacing: 2, padding: '4px 14px', borderRadius: 20,
                }}>MAIS POPULAR</div>
              )}
              <div style={{ fontSize: 32, marginBottom: 8 }}>{plan.icon}</div>
              <div style={{
                fontFamily: 'var(--font-accent)', fontSize: 13, letterSpacing: 3,
                color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase',
              }}>{plan.name}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 900,
                color: '#fff', lineHeight: 1,
              }}>
                {formatPrice(price, currency)}
              </div>
              <div style={{
                fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '6px 0 20px', fontStyle: 'italic',
              }}>{period}</div>

              <hr style={{ border: 'none', borderTop: '0.5px solid rgba(255,255,255,0.1)', margin: '0 0 16px' }} />

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{
                    fontSize: 13, paddingLeft: 22, position: 'relative', lineHeight: 1.5,
                    marginBottom: 6,
                    color: f.included ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)',
                  }}>
                    <span style={{
                      position: 'absolute', left: 0, top: 1,
                      color: f.included ? 'var(--verde3)' : 'rgba(255,255,255,0.25)',
                    }}>{f.included ? '✓' : '✗'}</span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button onClick={() => handleCheckout(plan.id)} style={{
                display: 'block', width: '100%', padding: '14px', borderRadius: 50,
                fontSize: 14, fontWeight: 700, border: btnClass.border,
                background: btnClass.bg, color: btnClass.color,
                cursor: 'pointer',
              }}>
                {isFree ? 'Acessar grátis' : isPro ? 'Garantir Ateliê Pro' : `Assinar com ${method === 'stripe' ? 'Stripe' : 'PayPal'}`}
              </button>
              <div style={{
                marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center',
              }}>
                {isFree ? 'sem cartão necessário' : isPro ? 'plano anual · garantia 7 dias' : `pagamento seguro via ${method === 'stripe' ? 'Stripe' : 'PayPal'}`}
              </div>
            </div>
          )
        })}
      </div>

      {/* Payment info */}
      <div style={{
        maxWidth: 400, margin: '24px auto 0',
        background: 'rgba(12,68,124,0.2)', border: '1px solid rgba(24,95,165,0.3)',
        borderRadius: 20, padding: '24px 28px',
      }}>
        <h4 style={{
          fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', marginBottom: 14,
        }}>Como funciona o pagamento</h4>
        {[
          { n: '1', text: 'Clique no botão do plano escolhido.' },
          { n: '2', text: 'Pague com cartão de crédito, débito, Pix ou PayPal.' },
          { n: '3', text: 'Acesso imediato após confirmação.' },
          { n: '4', text: 'Garantia de 7 dias: devolvemos 100% sem perguntas.' },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{
              minWidth: 26, height: 26, borderRadius: '50%', background: 'var(--azul2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>{s.n}</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
