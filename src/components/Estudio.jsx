import { useRef, useState, useEffect, useCallback } from 'react'
import { SVG_RISCOS } from '../data/svgRiscos.js'
import { RISCOS } from '../data/library.js'

const MIRROR_MODES = [
  { id: 'none',     label: 'Sem espelho', axes: 0 },
  { id: 'vertical', label: 'Vertical',    axes: 1 },
  { id: 'horizontal', label: 'Horizontal', axes: 1 },
  { id: 'quad',     label: '4 eixos',     axes: 2 },
  { id: 'radial6',  label: 'Radial 6x',   axes: 6 },
  { id: 'radial8',  label: 'Radial 8x',   axes: 8 },
]

const STROKE_COLORS = ['#FFFFFF', '#000000', '#5DCAA5', '#E24B4A', '#3C3489', '#B45309', '#993556', '#639922']
const MAX_HISTORY = 30

export default function Estudio({ onUseInProjetor }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const pointsRef = useRef([])
  const historyRef = useRef([])
  const redoRef = useRef([])

  const [mirror, setMirror] = useState('none')
  const [strokeColor, setStrokeColor] = useState('#FFFFFF')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [isEraser, setIsEraser] = useState(false)
  const [exportScale, setExportScale] = useState(100)
  const [historyLen, setHistoryLen] = useState(0)
  const [redoLen, setRedoLen] = useState(0)
  const [showMotifs, setShowMotifs] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = rect.width
      const h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      ctxRef.current = ctx
      setCanvasSize({ w, h })
      // Redraw from history
      if (historyRef.current.length > 0) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, w, h)
        }
        img.src = historyRef.current[historyRef.current.length - 1]
      }
    }
    resize()
    window.addEventListener('resize', resize)
    // Save initial blank state
    saveState()
    return () => window.removeEventListener('resize', resize)
  }, [])

  function saveState() {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = canvas.toDataURL()
    historyRef.current.push(data)
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift()
    redoRef.current = []
    setHistoryLen(historyRef.current.length)
    setRedoLen(0)
  }

  function undo() {
    if (historyRef.current.length <= 1) return
    const current = historyRef.current.pop()
    redoRef.current.push(current)
    const prev = historyRef.current[historyRef.current.length - 1]
    restoreState(prev)
    setHistoryLen(historyRef.current.length)
    setRedoLen(redoRef.current.length)
  }

  function redo() {
    if (redoRef.current.length === 0) return
    const next = redoRef.current.pop()
    historyRef.current.push(next)
    restoreState(next)
    setHistoryLen(historyRef.current.length)
    setRedoLen(redoRef.current.length)
  }

  function restoreState(dataUrl) {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.h)
      ctx.drawImage(img, 0, 0, canvasSize.w, canvasSize.h)
    }
    img.src = dataUrl
  }

  function clearCanvas() {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h)
    saveState()
  }

  // Mirror transformation: returns array of transform functions
  const getMirrorTransforms = useCallback((cx, cy) => {
    const mode = MIRROR_MODES.find(m => m.id === mirror)
    if (!mode || mode.id === 'none') return [p => p]

    const transforms = [p => p] // original always included

    if (mode.id === 'vertical') {
      transforms.push(p => ({ x: 2 * cx - p.x, y: p.y }))
    } else if (mode.id === 'horizontal') {
      transforms.push(p => ({ x: p.x, y: 2 * cy - p.y }))
    } else if (mode.id === 'quad') {
      transforms.push(p => ({ x: 2 * cx - p.x, y: p.y }))
      transforms.push(p => ({ x: p.x, y: 2 * cy - p.y }))
      transforms.push(p => ({ x: 2 * cx - p.x, y: 2 * cy - p.y }))
    } else if (mode.id === 'radial6' || mode.id === 'radial8') {
      const n = mode.id === 'radial6' ? 6 : 8
      for (let i = 1; i < n; i++) {
        const angle = (2 * Math.PI * i) / n
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        transforms.push(p => {
          const dx = p.x - cx
          const dy = p.y - cy
          return {
            x: cx + dx * cos - dy * sin,
            y: cy + dx * sin + dy * cos,
          }
        })
      }
    }
    return transforms
  }, [mirror])

  function getPos(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
  }

  function startDraw(e) {
    e.preventDefault()
    drawingRef.current = true
    pointsRef.current = [getPos(e)]
  }

  function moveDraw(e) {
    e.preventDefault()
    if (!drawingRef.current) return
    const pos = getPos(e)
    pointsRef.current.push(pos)
    drawStroke(pointsRef.current)
  }

  function endDraw(e) {
    if (e) e.preventDefault()
    if (!drawingRef.current) return
    drawingRef.current = false
    if (pointsRef.current.length > 0) {
      saveState()
    }
    pointsRef.current = []
  }

  function drawStroke(points) {
    const ctx = ctxRef.current
    if (!ctx || points.length < 2) return

    const cx = canvasSize.w / 2
    const cy = canvasSize.h / 2
    const transforms = getMirrorTransforms(cx, cy)

    // Only draw the latest segment for performance
    const len = points.length
    const p0 = points[len - 2]
    const p1 = points[len - 1]
    // Smoothing: midpoint for quadratic curve
    const mid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 }

    ctx.save()
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = strokeColor
    }
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (const transform of transforms) {
      const tp0 = transform(p0)
      const tmid = transform(mid)
      ctx.beginPath()
      ctx.moveTo(tp0.x, tp0.y)
      ctx.quadraticCurveTo(tp0.x, tp0.y, tmid.x, tmid.y)
      ctx.stroke()
    }
    ctx.restore()
  }

  // Draw mirror guide lines
  function drawGuides() {
    const ctx = ctxRef.current
    if (!ctx || mirror === 'none') return null

    const cx = canvasSize.w / 2
    const cy = canvasSize.h / 2
    const mode = MIRROR_MODES.find(m => m.id === mirror)
    const lines = []

    if (mode.id === 'vertical' || mode.id === 'quad') {
      lines.push({ x1: cx, y1: 0, x2: cx, y2: canvasSize.h })
    }
    if (mode.id === 'horizontal' || mode.id === 'quad') {
      lines.push({ x1: 0, y1: cy, x2: canvasSize.w, y2: cy })
    }
    if (mode.id === 'radial6' || mode.id === 'radial8') {
      const n = mode.id === 'radial6' ? 6 : 8
      const r = Math.max(canvasSize.w, canvasSize.h)
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * i) / n
        lines.push({
          x1: cx - r * Math.cos(angle),
          y1: cy - r * Math.sin(angle),
          x2: cx + r * Math.cos(angle),
          y2: cy + r * Math.sin(angle),
        })
      }
    }

    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="rgba(93,202,165,0.25)" strokeWidth="1" strokeDasharray="6 4" />
        ))}
        <circle cx={cx} cy={cy} r="4" fill="rgba(93,202,165,0.4)" />
      </svg>
    )
  }

  function loadMotif(risco) {
    const svgContent = SVG_RISCOS[risco.id]
    if (!svgContent) return
    const ctx = ctxRef.current
    if (!ctx) return

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">${svgContent}</svg>`
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(canvasSize.w * 0.5 / img.width, canvasSize.h * 0.5 / img.height)
      const w = img.width * scale
      const h = img.height * scale
      ctx.drawImage(img, (canvasSize.w - w) / 2, (canvasSize.h - h) / 2, w, h)
      URL.revokeObjectURL(url)
      saveState()
    }
    img.src = url
    setShowMotifs(false)
  }

  function exportPNG() {
    const canvas = canvasRef.current
    if (!canvas) return
    const scale = exportScale / 100
    const baseW = 800 // free tier
    const w = Math.round(baseW * scale)
    const h = Math.round(baseW * (canvasSize.h / canvasSize.w) * scale)

    const tmp = document.createElement('canvas')
    tmp.width = w
    tmp.height = h
    const tc = tmp.getContext('2d')
    tc.fillStyle = '#FFFFFF'
    tc.fillRect(0, 0, w, h)
    tc.drawImage(canvas, 0, 0, w, h)

    const a = document.createElement('a')
    a.download = `risco-atelie-${Date.now()}.png`
    a.href = tmp.toDataURL('image/png')
    a.click()
  }

  function sendToProjetor() {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    if (onUseInProjetor) {
      onUseInProjetor({
        id: 'custom-' + Date.now(),
        nome: 'Risco personalizado',
        url: dataUrl,
        isCustom: true,
      })
    }
  }

  // Motif quick picks (first 6 from library)
  const motifPicks = RISCOS.filter(r => ['rosa-choux-01', 'monstera-simples', 'folha-bananeira', 'lavanda-cacho', 'sakura-flor', 'passiflora-completa'].includes(r.id))

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Canvas area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
          style={{ display: 'block', touchAction: 'none', cursor: isEraser ? 'cell' : 'crosshair' }}
        />
        {drawGuides()}

        {/* Mirror badge */}
        {mirror !== 'none' && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: 'rgba(93,202,165,0.2)', border: '1px solid rgba(93,202,165,0.4)',
            borderRadius: 20, padding: '3px 10px', fontSize: 10, color: '#5DCAA5', fontWeight: 600,
          }}>
            {MIRROR_MODES.find(m => m.id === mirror)?.label}
          </div>
        )}

        {/* Motif picker overlay */}
        {showMotifs && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 700, marginBottom: 14 }}>Escolha um motivo base</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 320 }}>
              {motifPicks.map(r => (
                <button key={r.id} onClick={() => loadMotif(r)} style={{
                  background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(93,202,165,0.2)',
                  borderRadius: 12, padding: 10, cursor: 'pointer',
                }}>
                  <svg viewBox="0 0 100 100" width="100%" xmlns="http://www.w3.org/2000/svg"
                    dangerouslySetInnerHTML={{ __html: SVG_RISCOS[r.id] || '' }} />
                  <div style={{ fontSize: 10, color: '#fff', marginTop: 4 }}>{r.nome.split(' ')[0]}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowMotifs(false)} style={{
              marginTop: 14, padding: '8px 24px', fontSize: 12, color: 'rgba(255,255,255,0.5)',
              background: 'transparent', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 8,
            }}>Cancelar</button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ background: 'rgba(2,44,34,0.97)', padding: '8px 12px 6px', flexShrink: 0 }}>
        {/* Row 1: Mirror modes */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8, overflowX: 'auto' }}>
          {MIRROR_MODES.map(m => (
            <button key={m.id} onClick={() => setMirror(m.id)} style={{
              padding: '4px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6, whiteSpace: 'nowrap',
              border: mirror === m.id ? '1px solid #5DCAA5' : '0.5px solid rgba(255,255,255,0.15)',
              background: mirror === m.id ? 'rgba(93,202,165,0.2)' : 'transparent',
              color: mirror === m.id ? '#5DCAA5' : 'rgba(255,255,255,0.5)',
            }}>{m.label}</button>
          ))}
        </div>

        {/* Row 2: Colors + eraser + clear */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          {STROKE_COLORS.map(c => (
            <div key={c} onClick={() => { setStrokeColor(c); setIsEraser(false) }} style={{
              width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer',
              border: strokeColor === c && !isEraser ? '2px solid #5DCAA5' : '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }} />
          ))}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
          <button onClick={() => setIsEraser(!isEraser)} style={{
            padding: '4px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6,
            border: isEraser ? '1px solid #E24B4A' : '0.5px solid rgba(255,255,255,0.15)',
            background: isEraser ? 'rgba(226,75,74,0.2)' : 'transparent',
            color: isEraser ? '#E24B4A' : 'rgba(255,255,255,0.5)',
          }}>Borracha</button>
          <button onClick={clearCanvas} style={{
            padding: '4px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6,
            border: '0.5px solid rgba(255,255,255,0.15)', background: 'transparent',
            color: 'rgba(255,255,255,0.5)',
          }}>Limpar</button>
        </div>

        {/* Row 3: Stroke width + undo/redo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', minWidth: 52 }}>Espessura</span>
          <input type="range" min={1} max={10} value={strokeWidth} step={1}
            onChange={e => setStrokeWidth(parseInt(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: '#fff', minWidth: 22, textAlign: 'right' }}>{strokeWidth}px</span>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
          <button onClick={undo} disabled={historyLen <= 1} style={{
            padding: '4px 8px', fontSize: 11, borderRadius: 6, background: 'transparent',
            border: '0.5px solid rgba(255,255,255,0.15)',
            color: historyLen <= 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
          }}>Desfazer</button>
          <button onClick={redo} disabled={redoLen === 0} style={{
            padding: '4px 8px', fontSize: 11, borderRadius: 6, background: 'transparent',
            border: '0.5px solid rgba(255,255,255,0.15)',
            color: redoLen === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
          }}>Refazer</button>
        </div>

        {/* Row 4: Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setShowMotifs(true)} style={{
            flex: 1, padding: '10px', fontSize: 11, fontWeight: 600, borderRadius: 50,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
          }}>Motivo base</button>
          <button onClick={exportPNG} style={{
            flex: 1, padding: '10px', fontSize: 11, fontWeight: 600, borderRadius: 50,
            background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(93,202,165,0.3)',
            color: '#5DCAA5',
          }}>Exportar PNG</button>
          <button onClick={sendToProjetor} style={{
            flex: 1, padding: '10px', fontSize: 11, fontWeight: 700, borderRadius: 50,
            background: 'var(--verde2)', border: 'none', color: '#fff',
          }}>Usar no Projetor</button>
        </div>

        {/* Export scale */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', minWidth: 52 }}>Escala exp.</span>
          <input type="range" min={50} max={200} value={exportScale} step={10}
            onChange={e => setExportScale(parseInt(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: '#fff', minWidth: 30, textAlign: 'right' }}>{exportScale}%</span>
        </div>
      </div>
    </div>
  )
}
