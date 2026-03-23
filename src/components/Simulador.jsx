import { useState, useRef, useEffect } from 'react'

const CORES = ['#F5F0EB','#D4C5B0','#B8CFD4','#C8D8B4','#E8C4C0','#DCCFE0','#F2D9B0','#2D3748','#C4B4A0','#FFFFFF']
const TEXTURAS = [
  { id:'liso',     label:'Liso'         },
  { id:'grafiato', label:'Grafiato'     },
  { id:'massa',    label:'Massa dec.'   },
  { id:'cimento',  label:'Cimento'      },
]
const TINTAS = [
  { id:'acrilica',    label:'Acrílica',     rend:12, preco:65,  un:'L' },
  { id:'latex',       label:'Látex PVA',    rend:10, preco:55,  un:'L' },
  { id:'premium',     label:'Premium',      rend:14, preco:90,  un:'L' },
  { id:'texturizada', label:'Texturizada',  rend:6,  preco:45,  un:'kg' },
]

export default function Simulador() {
  const canvasRef = useRef()
  const [cor, setCor] = useState('#F5F0EB')
  const [textura, setTextura] = useState('liso')
  const [tinta, setTinta] = useState('acrilica')
  const [larg, setLarg] = useState('4')
  const [alt, setAlt] = useState('2.8')
  const [sub, setSub] = useState('2')
  const [demaos, setDemaos] = useState('2')
  const [resultado, setResultado] = useState(null)

  useEffect(() => { renderWall() }, [cor, textura])

  function renderWall() {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const w = c.width, h = c.height

    ctx.fillStyle = '#C8BFB5'
    ctx.fillRect(0, 0, w, h)

    const wx = 30, wy = 25, ww = w - 60, wh = h - 50
    ctx.fillStyle = cor
    ctx.fillRect(wx, wy, ww, wh)

    if (textura === 'grafiato') {
      ctx.globalAlpha = 0.12
      for (let i = 0; i < 800; i++) {
        const gx = wx + Math.random() * ww, gy = wy + Math.random() * wh
        ctx.beginPath(); ctx.arc(gx, gy, Math.random() * 2, 0, Math.PI * 2)
        ctx.fillStyle = '#000'; ctx.fill()
      }
      ctx.globalAlpha = 1
    } else if (textura === 'massa') {
      ctx.globalAlpha = 0.07
      for (let i = 0; i < 40; i++) {
        const mx = wx + Math.random() * ww, my = wy + Math.random() * wh
        const mw = 15 + Math.random() * 40, mh = 2 + Math.random() * 6
        ctx.save(); ctx.translate(mx, my); ctx.rotate((Math.random() - 0.5) * 0.3)
        ctx.fillStyle = '#000'; ctx.fillRect(-mw/2, -mh/2, mw, mh)
        ctx.restore()
      }
      ctx.globalAlpha = 1
    } else if (textura === 'cimento') {
      ctx.globalAlpha = 0.05
      for (let i = 0; i < 500; i++) {
        const cx2 = wx + Math.random() * ww, cy2 = wy + Math.random() * wh
        ctx.strokeStyle = Math.random() > 0.5 ? '#fff' : '#000'
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(cx2, cy2)
        ctx.lineTo(cx2 + (Math.random() - 0.5) * 10, cy2 + (Math.random() - 0.5) * 10)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    // Door
    ctx.fillStyle = '#C8B89A'
    ctx.fillRect(wx + ww - 70, wy + wh - 80, 45, 80)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1
    ctx.strokeRect(wx + ww - 70, wy + wh - 80, 45, 80)

    // Window
    ctx.fillStyle = 'rgba(184,212,232,0.7)'
    ctx.fillRect(wx + 45, wy + 30, 65, 55)
    ctx.strokeRect(wx + 45, wy + 30, 65, 55)
    ctx.beginPath()
    ctx.moveTo(wx + 45 + 32, wy + 30); ctx.lineTo(wx + 45 + 32, wy + 85)
    ctx.moveTo(wx + 45, wy + 57); ctx.lineTo(wx + 110, wy + 57)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5
    ctx.strokeRect(wx, wy, ww, wh)

    const lw = parseFloat(larg) || 4, lh = parseFloat(alt) || 2.8
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText(lw + 'm', wx + ww / 2, wy + wh + 16)
    ctx.save(); ctx.translate(wx - 12, wy + wh / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText(lh + 'm', 0, 0); ctx.restore()
  }

  function calcular() {
    const lw = parseFloat(larg) || 4
    const lh = parseFloat(alt) || 2.8
    const s = parseFloat(sub) || 0
    const d = parseInt(demaos) || 2
    const t = TINTAS.find(x => x.id === tinta)

    const areaTotal = lw * lh
    const areaLiq = Math.max(0, areaTotal - s)
    const qtd = (areaLiq / t.rend) * d
    const qtdArr = Math.ceil(qtd * 10) / 10
    const latas36 = Math.ceil(qtdArr / 3.6)
    const custoTinta = qtdArr * t.preco
    const custoMao = areaLiq * 25
    const total = custoTinta + custoMao + 61

    setResultado({ areaLiq: areaLiq.toFixed(1), qtd: qtdArr.toFixed(1), un: t.un, latas36, custoTinta: Math.round(custoTinta), custoMao: Math.round(custoMao), total: Math.round(total), tintaNome: t.label })
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 80px' }}>
      {/* Header */}
      <div style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--verde3)', marginBottom: 12 }}>Simulador</div>
      {/* Canvas */}
      <canvas ref={canvasRef} width={320} height={200}
        style={{ width: '100%', borderRadius: 20, marginBottom: 16, display: 'block' }} />

      {/* Cor */}
      <div style={{ marginBottom: 14 }}>
        <Label>Cor da tinta</Label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {CORES.map(c => (
            <div key={c} onClick={() => setCor(c)} style={{
              width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer',
              border: cor === c ? '3px solid #5DCAA5' : '1px solid rgba(255,255,255,0.2)',
              transition: 'border 0.15s',
            }} />
          ))}
        </div>
        <input type="color" value={cor} onChange={e => setCor(e.target.value)}
          style={{ width: '100%', height: 32, borderRadius: 8, border: '0.5px solid rgba(93,202,165,0.3)', cursor: 'pointer' }} />
      </div>

      {/* Textura */}
      <div style={{ marginBottom: 14 }}>
        <Label>Textura / acabamento</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {TEXTURAS.map(tx => (
            <button key={tx.id} onClick={() => setTextura(tx.id)} style={{
              padding: '7px 4px', fontSize: 11, fontWeight: 600, borderRadius: 8,
              border: textura === tx.id ? '1px solid #5DCAA5' : '0.5px solid rgba(255,255,255,0.15)',
              background: textura === tx.id ? 'rgba(93,202,165,0.15)' : 'rgba(255,255,255,0.04)',
              color: textura === tx.id ? '#5DCAA5' : 'rgba(255,255,255,0.6)',
            }}>{tx.label}</button>
          ))}
        </div>
      </div>

      {/* Dimensões */}
      <div style={{ marginBottom: 14 }}>
        <Label>Dimensões da parede</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <NumInput label="Largura (m)" value={larg} onChange={setLarg} onBlur={renderWall} />
          <NumInput label="Altura (m)" value={alt} onChange={setAlt} onBlur={renderWall} />
          <NumInput label="Janelas (m²)" value={sub} onChange={setSub} onBlur={renderWall} />
        </div>
      </div>

      {/* Tinta */}
      <div style={{ marginBottom: 14 }}>
        <Label>Tipo de tinta</Label>
        <select value={tinta} onChange={e => setTinta(e.target.value)} style={{
          width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 8,
          border: '0.5px solid rgba(93,202,165,0.3)', background: 'rgba(255,255,255,0.06)',
          color: '#fff', outline: 'none',
        }}>
          {TINTAS.map(t => <option key={t.id} value={t.id}>{t.label} — {t.rend} m²/{t.un}</option>)}
        </select>
      </div>

      {/* Demãos */}
      <div style={{ marginBottom: 16 }}>
        <Label>Número de demãos</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['1','2','3'].map(d => (
            <button key={d} onClick={() => setDemaos(d)} style={{
              flex: 1, padding: '7px', fontSize: 13, fontWeight: 700, borderRadius: 8,
              border: demaos === d ? '1px solid #5DCAA5' : '0.5px solid rgba(255,255,255,0.15)',
              background: demaos === d ? 'rgba(93,202,165,0.15)' : 'rgba(255,255,255,0.04)',
              color: demaos === d ? '#5DCAA5' : 'rgba(255,255,255,0.5)',
            }}>{d} demão{d !== '1' ? 's' : ''}</button>
          ))}
        </div>
      </div>

      <button onClick={calcular} style={{
        width: '100%', padding: '14px', fontSize: 15, fontWeight: 700,
        background: 'var(--verde2)', color: '#fff', border: 'none', borderRadius: 50, marginBottom: 16,
      }}>Calcular materiais e orçamento</button>

      {resultado && (
        <div style={{
          background: 'rgba(15,110,86,0.12)', border: '1px solid rgba(93,202,165,0.2)',
          borderRadius: 20, padding: '20px 22px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
            <StatCard label="Área pintável" value={resultado.areaLiq} unit="m²" />
            <StatCard label="Tinta" value={resultado.qtd} unit={resultado.un} />
            <StatCard label="Latas 3,6L" value={resultado.latas36} unit="un" />
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
            <b style={{ color: '#fff' }}>Orçamento completo</b><br />
            {resultado.tintaNome}: <b style={{ color: '#fff' }}>R${resultado.custoTinta.toLocaleString('pt-BR')}</b><br />
            Materiais auxiliares: <b style={{ color: '#fff' }}>R$61</b><br />
            Mão de obra estimada: <b style={{ color: '#fff' }}>R${resultado.custoMao.toLocaleString('pt-BR')}</b><br />
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 8, fontSize: 14 }}>
              Total estimado: <b style={{ color: '#5DCAA5', fontSize: 16 }}>R${resultado.total.toLocaleString('pt-BR')}</b>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Label({ children }) {
  return <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em' }}>{children}</div>
}

function NumInput({ label, value, onChange, onBlur }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</div>
      <input type="number" value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} style={{
        width: '100%', padding: '7px 8px', fontSize: 13, borderRadius: 8,
        border: '0.5px solid rgba(93,202,165,0.3)', background: 'rgba(255,255,255,0.06)',
        color: '#fff', outline: 'none',
      }} />
    </div>
  )
}

function StatCard({ label, value, unit }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{unit}</div>
    </div>
  )
}
