// --- Input Sanitization (XSS prevention) ---

const HTML_ENTITIES = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;',
  '"': '&quot;', "'": '&#x27;', '/': '&#x2F;',
}

export function sanitize(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/[&<>"'/]/g, char => HTML_ENTITIES[char])
}

export function sanitizePlant(plant) {
  return {
    name: sanitize(plant.name?.trim() || ''),
    category: sanitize(plant.category?.trim() || 'Flores'),
    real: plant.real || null,
    sketch: plant.sketch || null,
  }
}

// --- Upload Validation ---

const ALLOWED_TYPES = ['image/jpeg', 'image/png']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export function validateFile(file) {
  if (!file) return { valid: false, error: 'Nenhum arquivo selecionado.' }

  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Formato invalido. Use apenas JPG ou PNG.' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo invalido. Use apenas JPG ou PNG.' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Arquivo muito grande. Maximo permitido: 2MB.' }
  }

  return { valid: true, error: null }
}

// --- Rate Limiting (login attempts) ---

const RATE_LIMIT_KEY = 'atelie_login_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

function getAttempts() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return { count: 0, lockedUntil: null }
    return JSON.parse(raw)
  } catch {
    return { count: 0, lockedUntil: null }
  }
}

function setAttempts(data) {
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
}

export function checkRateLimit() {
  const attempts = getAttempts()
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const minutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000)
    return { allowed: false, error: `Muitas tentativas. Tente novamente em ${minutes} minuto(s).` }
  }
  if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
    setAttempts({ count: 0, lockedUntil: null })
  }
  return { allowed: true, error: null }
}

export function recordFailedAttempt() {
  const attempts = getAttempts()
  const newCount = attempts.count + 1
  if (newCount >= MAX_ATTEMPTS) {
    setAttempts({ count: newCount, lockedUntil: Date.now() + LOCKOUT_MS })
  } else {
    setAttempts({ count: newCount, lockedUntil: null })
  }
}

export function resetAttempts() {
  sessionStorage.removeItem(RATE_LIMIT_KEY)
}

// --- Generic Error Messages ---

export function safeErrorMessage() {
  return 'Ocorreu um erro. Tente novamente.'
}
