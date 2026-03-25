import { loadStripe } from '@stripe/stripe-js'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
if (!stripeKey) {
  console.warn('[Stripe] VITE_STRIPE_PUBLISHABLE_KEY not set — payments disabled')
}
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

// ---------------------------------------------------------------
// Stripe Dashboard → Products → Create product for each plan:
//
// 1. "Artista" (recurring/month):
//    - BRL: R$49,00/mês → copy price ID → paste below
//    - JPY: ¥1.500/月   → copy price ID → paste below
//
// 2. "Ateliê Pro" (recurring/year):
//    - BRL: R$497,00/ano → copy price ID → paste below
//    - JPY: ¥15.000/年   → copy price ID → paste below
//
// Price IDs look like: price_1ABC123def456...
// ---------------------------------------------------------------
const PRICES = {
  artista: {
    BRL: null,
    JPY: null,
  },
  pro: {
    BRL: null,
    JPY: null,
  },
}

export function detectCurrency() {
  const lang = navigator.language || 'pt-BR'
  if (lang.startsWith('ja')) return 'JPY'
  return 'BRL'
}

export function formatPrice(amount, currency) {
  return new Intl.NumberFormat(currency === 'JPY' ? 'ja-JP' : 'pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount)
}

export const PLANS = {
  florzinha: {
    id: 'florzinha',
    name: 'Florzinha',
    icon: '🌱',
    prices: { BRL: 0, JPY: 0 },
    period: 'para sempre grátis',
    features: [
      { text: '5 motivos botânicos', included: true },
      { text: 'Projetor virtual (com marca d\'água)', included: true },
      { text: 'Espelho vertical e horizontal', included: true },
      { text: 'Simulador de parede (1 textura)', included: true },
      { text: 'Exportação em alta resolução', included: false },
      { text: 'Upload de foto de referência', included: false },
      { text: 'Novos riscos mensais', included: false },
    ],
  },
  artista: {
    id: 'artista',
    name: 'Artista',
    icon: '🌸',
    popular: true,
    prices: { BRL: 49, JPY: 1500 },
    period: { BRL: 'por mês', JPY: '月額' },
    features: [
      { text: 'Biblioteca completa (50+ motivos)', included: true },
      { text: 'Projetor sem marca d\'água em HD', included: true },
      { text: 'Todos os 5 modos de espelho', included: true },
      { text: 'Todas as 4 texturas de parede', included: true },
      { text: 'Exportação PNG até 3000px', included: true },
      { text: 'Upload de foto de referência', included: true },
      { text: '4 riscos novos por mês', included: true },
    ],
  },
  pro: {
    id: 'pro',
    name: 'Ateliê Pro',
    icon: '🦜',
    prices: { BRL: 497, JPY: 15000 },
    period: { BRL: 'por ano', JPY: '年額' },
    features: [
      { text: 'Tudo do plano Artista', included: true },
      { text: 'Exportação SVG + PNG até 6000px', included: true },
      { text: 'Orçamento exportável em PDF', included: true },
      { text: 'Novos riscos mensais vitalícios', included: true },
      { text: 'Paletas de cores premium', included: true },
      { text: 'Suporte via WhatsApp prioritário', included: true },
      { text: 'Economia de 15% vs mensal', included: true },
    ],
  },
}

export async function createCheckout(planId, currency = 'BRL') {
  const priceId = PRICES[planId]?.[currency]

  if (!priceId) {
    alert('Produto ainda não configurado no Stripe. Configure os Price IDs no Dashboard.')
    return
  }

  if (!stripePromise) {
    alert('Stripe não configurado. Verifique VITE_STRIPE_PUBLISHABLE_KEY no .env')
    return
  }

  const stripe = await stripePromise
  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    successUrl: window.location.origin + '/?payment=success',
    cancelUrl: window.location.origin + '/?payment=cancel',
  })

  if (error) {
    console.error('Stripe checkout error:', error)
    alert('Erro ao processar pagamento. Tente novamente.')
  }
}

export { stripePromise }
