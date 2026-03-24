import { useState, useEffect, createContext, useContext } from 'react'

const PlanContext = createContext(null)

const PLAN_LIMITS = {
  florzinha: {
    motifs: 5,
    mirrorModes: ['none', 'vertical', 'horizontal'],
    exportMaxPx: 800,
    textures: ['liso'],
    watermark: true,
    uploadRef: false,
  },
  artista: {
    motifs: Infinity,
    mirrorModes: ['none', 'vertical', 'horizontal', 'quad', 'radial6', 'radial8'],
    exportMaxPx: 3000,
    textures: ['liso', 'grafiato', 'massa', 'cimento'],
    watermark: false,
    uploadRef: true,
  },
  pro: {
    motifs: Infinity,
    mirrorModes: ['none', 'vertical', 'horizontal', 'quad', 'radial6', 'radial8'],
    exportMaxPx: 6000,
    textures: ['liso', 'grafiato', 'massa', 'cimento'],
    watermark: false,
    uploadRef: true,
    exportSVG: true,
    exportPDF: true,
  },
}

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState(() => {
    return localStorage.getItem('atelie-plan') || 'florzinha'
  })

  useEffect(() => {
    localStorage.setItem('atelie-plan', plan)
  }, [plan])

  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.florzinha

  function canUse(feature) {
    return !!limits[feature]
  }

  function isPaid() {
    return plan !== 'florzinha'
  }

  return (
    <PlanContext.Provider value={{ plan, setPlan, limits, canUse, isPaid }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) return { plan: 'florzinha', limits: PLAN_LIMITS.florzinha, canUse: () => false, isPaid: () => false }
  return ctx
}
