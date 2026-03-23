import { useRef, useEffect, useState, useCallback } from 'react'
import { SVG_RISCOS } from '../data/svgRiscos.js'

export default function Projetor({ risco, referencia }) {
  const videoRef = useRef()
  const canvasRef = useRef()
  const touchRef = useRef()
  const rafRef = useRef()
  const overlayImg = useRef(new Image())
  const stateRef = useRef({
    stream: null, facing: 'environment',
    opacity: 0.6, scale: 1, rotation: 0,
    x: 0, y: 0, filter: 'normal',
    dragging: false, dx0: 0, dy0: 0, ox0: 0, oy0: 0,
    lastPinch: null, camActive: false,
  })
  const [ui, setUi] = useState({
    opacity: 60, scale: 100, rotation: 0, filter: 'normal', camActive: false
  })

  const S = stateRef.current

  // Build overlay image from risco SVG or reference photo URL
  useEffect(() => {
    if (risco) {
      const svgContent = SVG_RISCOS[risco.id] || ''
      const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="800" height="800">${svgContent}</svg>`
      const blob = new Blob([svgStr], { type: 'image/svg+xml' })
      overlayImg.current.src = URL.createObjectURL(blob)
    } else if (referencia) {
      overlayImg.current.src = referencia.url
      overlayImg.current.crossOrigin = 'anonymous'
    }
  }, [risco, referencia])

  const resize = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    c.width = c.offsetWidth || 640
    c.height = c.offsetHeight || 360
    S.x = c.width / 2
    S.y = c.height / 2
  }, [])

  const drawOutline = useCallback((ctx, w, h) => {
    const id = ctx.getImageData(0, 0, w, h)
    const d = id.data
    const out = ctx.createImageData(w, h)
    const o = out.data
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4
        const gx = Math.abs(d[(y * w + x + 1) * 4 + 3] - d[(y * w + x - 1) * 4 + 3])
        const gy = Math.abs(d[((y + 1) * w + x) * 4 + 3] - d[((y - 1) * w + x) * 4 + 3])
        const g = Math.min(255, (gx + gy) * 3)
        o[i] = 255; o[i + 1] = 255; o[i + 2] = 255; o[i + 3] = g > 15 ? 220 : 0
      }
    }
    ctx.putImageData(out, 0, 0)
  }, [])

  const loop = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const w = c.width, h = c.height
    ctx.clearRect(0, 0, w, h)
    const img = overlayImg.current
    if (img.complete && img.naturalWidth > 0) {
      ctx.save()
      ctx.globalAlpha = S.opacity
      ctx.translate(S.x, S.y)
      ctx.rotate(S.rotation * Math.PI / 180)
      const iw = img.naturalWidth * S.scale
      const ih = img.naturalHeight * S.scale
      if (S.filter === 'invert') ctx.filter = 'invert(1)'
      else if (S.filter === 'red') ctx.filter = 'sepia(1) saturate(5) hue-rotate(320deg)'
      else ctx.filter = 'none'
      ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih)
      ctx.restore()

      if (S.filter === 'outline') {
        const tmp = document.createElement('canvas')
        tmp.width = w; tmp.height = h
        const tc = tmp.getContext('2d')
        tc.save()
        tc.translate(S.x, S.y)
        tc.rotate(S.rotation * Math.PI / 180)
        tc.drawImage(img, -iw / 2, -ih / 2, iw, ih)
        tc.restore()
        drawOutline(tc, w, h)
        ctx.clearRect(0, 0, w, h)
        ctx.globalAlpha = S.opacity * 1.5
        ctx.drawImage(tmp, 0, 0)
        ctx.globalAlpha = 1
      }

      // Bounding box
      ctx.save()
      ctx.strokeStyle = 'rgba(93,202,165,0.5)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 4])
      ctx.translate(S.x, S.y)
      ctx.rotate(S.rotation * Math.PI / 180)
      ctx.strokeRect(-iw / 2, -ih / 2, iw, ih)
      ctx.fillStyle = 'rgba(93,202,165,0.8)'
      ctx.fillRect(-5, -5, 10, 10)
      ctx.restore()
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [drawOutline])

  async function startCamera() {
    try {
      if (S.stream) S.stream.getTracks().forEach(t => t.stop())
      S.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: S.facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      videoRef.current.srcObject = S.stream
      videoRef.current.onloadedmetadata = () => {
        resize()
        S.camActive = true
        setUi(u => ({ ...u, camActive: true }))
        loop()
      }
    } catch {
      alert('Câmera bloqueada. Permita o acesso e tente novamente.')
    }
  }

  function flipCamera() {
    S.facing = S.facing === 'environment' ? 'user' : 'environment'
    if (S.stream) startCamera()
  }

  function capture() {
    const tmp = document.createElement('canvas')
    tmp.width = canvasRef.current.width
    tmp.height = canvasRef.current.height
    const tc = tmp.getContext('2d')
    if (S.camActive && videoRef.current) tc.drawImage(videoRef.current, 0, 0, tmp.width, tmp.height)
    tc.drawImage(canvasRef.current, 0, 0)
    const a = document.createElement('a')
    a.download = 'projecao-atelie.png'
    a.href = tmp.toDataURL('image/png')
    a.click()
  }

  useEffect(() => {
    resize()
    loop()
    window.addEventListener('resize', resize)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (S.stream) S.stream.getTracks().forEach(t => t.stop())
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Touch/mouse handlers
  function onPointerDown(e) {
    e.preventDefault()
    S.dragging = true
    const pt = e.touches ? e.touches[0] : e
    S.dx0 = pt.clientX; S.dy0 = pt.clientY
    S.ox0 = S.x; S.oy0 = S.y
    if (e.touches?.length === 2) {
      S.lastPinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
    }
  }

  function onPointerMove(e) {
    e.preventDefault()
    if (!S.dragging) return
    if (e.touches?.length === 2 && S.lastPinch) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      S.scale = Math.max(0.1, Math.min(5, S.scale * (d / S.lastPinch)))
      S.lastPinch = d
      setUi(u => ({ ...u, scale: Math.round(S.scale * 100) }))
      return
    }
    const pt = e.touches ? e.touches[0] : e
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    S.x = S.ox0 + (pt.clientX - S.dx0) * (c.width / r.width)
    S.y = S.oy0 + (pt.clientY - S.dy0) * (c.height / r.height)
  }

  function onPointerUp() {
    S.dragging = false
    S.lastPinch = null
  }

  const label = risco ? risco.nome : referencia ? referencia.nome : 'Nenhum risco'

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>
      {/* Video + Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay playsInline muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <canvas ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div ref={touchRef}
          style={{ position: 'absolute', inset: 0, cursor: 'move' }}
          onMouseDown={onPointerDown} onMouseMove={onPointerMove} onMouseUp={onPointerUp} onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown} onTouchMove={onPointerMove} onTouchEnd={onPointerUp}
        />

        {/* Badges */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(0,0,0,0.65)', color: '#fff',
          fontSize: 11, padding: '3px 10px', borderRadius: 20, backdropFilter: 'blur(4px)'
        }}>{label}</div>
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(0,0,0,0.65)', color: '#fff',
          fontSize: 11, padding: '3px 10px', borderRadius: 20
        }}>{ui.scale}%</div>

        {!ui.camActive && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'rgba(0,0,0,0.7)'
          }}>
            <div style={{ fontSize: 48 }}>📱</div>
            <div style={{ color: '#fff', fontSize: 14 }}>Toque em "Iniciar câmera"</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>e aponte para a parede</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ background: 'rgba(2,44,34,0.97)', padding: '10px 14px 4px', flexShrink: 0 }}>
        <Slider label="Opacidade" value={ui.opacity} min={5} max={95}
          onChange={v => { S.opacity = v / 100; setUi(u => ({ ...u, opacity: v })) }} unit="%" />
        <Slider label="Escala" value={ui.scale} min={10} max={400}
          onChange={v => { S.scale = v / 100; setUi(u => ({ ...u, scale: v })) }} unit="%" />
        <Slider label="Rotação" value={ui.rotation} min={-180} max={180}
          onChange={v => { S.rotation = v; setUi(u => ({ ...u, rotation: v })) }} unit="°" />

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['normal','outline','invert','red'].map(f => (
            <button key={f} onClick={() => { S.filter = f; setUi(u => ({ ...u, filter: f })) }} style={{
              flex: 1, padding: '5px 0', fontSize: 10, fontWeight: 600, borderRadius: 8,
              border: `0.5px solid ${ui.filter === f ? '#5DCAA5' : 'rgba(255,255,255,0.15)'}`,
              background: ui.filter === f ? 'rgba(93,202,165,0.2)' : 'transparent',
              color: ui.filter === f ? '#5DCAA5' : 'rgba(255,255,255,0.5)',
            }}>
              {f === 'normal' ? 'Original' : f === 'outline' ? 'Contorno' : f === 'invert' ? 'Invertido' : 'Vermelho'}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, paddingBottom: 6 }}>
          <button onClick={startCamera} style={{
            flex: 2, padding: '12px', fontSize: 13, fontWeight: 700,
            background: 'var(--verde2)', color: '#fff', border: 'none', borderRadius: 50,
          }}>Iniciar câmera</button>
          <button onClick={flipCamera} style={{
            flex: 1, padding: '12px', fontSize: 12, fontWeight: 600,
            background: 'rgba(255,255,255,0.08)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50,
          }}>Virar</button>
          <button onClick={capture} style={{
            flex: 1, padding: '12px', fontSize: 12, fontWeight: 600,
            background: 'rgba(255,255,255,0.08)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50,
          }}>Capturar</button>
        </div>
      </div>
    </div>
  )
}

function Slider({ label, value, min, max, onChange, unit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', minWidth: 58 }}>{label}</span>
      <input type="range" min={min} max={max} value={value} step={1}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{ flex: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', minWidth: 36, textAlign: 'right' }}>
        {value}{unit}
      </span>
    </div>
  )
}
