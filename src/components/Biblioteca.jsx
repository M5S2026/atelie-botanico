import { useState } from 'react'
import { RISCOS, CATEGORIAS } from '../data/library.js'
import { SVG_RISCOS } from '../data/svgRiscos.js'

const NIVEIS = { iniciante:'#1D9E75', intermediário:'#BA7517', avançado:'#E24B4A' }

export default function Biblioteca({ onSelectRisco }) {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)

  const items = RISCOS.filter(r =>
    (cat === 'all' || r.cat === cat) &&
    (!q || r.nome.toLowerCase().includes(q.toLowerCase()))
  )

  function select(r) { setSel(r === sel ? null : r) }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      {/* Search */}
      <div style={{ padding:'12px 14px 0', flexShrink:0 }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar risco..." style={{
          width:'100%', padding:'8px 12px', fontSize:13, borderRadius:10,
          border:'0.5px solid rgba(93,202,165,0.3)', background:'rgba(255,255,255,0.06)',
          color:'#fff', outline:'none',
        }} />
      </div>

      {/* Categories */}
      <div style={{ padding:'10px 14px 0', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
        <CatBtn active={cat==='all'} onClick={()=>setCat('all')}>Todos</CatBtn>
        {Object.entries(CATEGORIAS).map(([k,v]) => (
          RISCOS.some(r=>r.cat===k) &&
          <CatBtn key={k} active={cat===k} cor={v.cor} onClick={()=>setCat(k)}>
            {v.emoji} {v.label.split(' ')[0]}
          </CatBtn>
        ))}
      </div>

      {/* Count */}
      <div style={{ padding:'8px 14px 4px', fontSize:11, color:'rgba(255,255,255,0.4)', flexShrink:0 }}>
        {items.length} riscos
      </div>

      {/* Grid */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 14px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {items.map(r => {
            const svgContent = SVG_RISCOS[r.id]
            const isSelected = sel?.id === r.id
            return (
              <div key={r.id} onClick={()=>select(r)} style={{
                borderRadius:12,
                border: isSelected ? '2px solid #5DCAA5' : '0.5px solid rgba(93,202,165,0.15)',
                background: isSelected ? 'rgba(93,202,165,0.1)' : 'rgba(255,255,255,0.04)',
                padding:8, cursor:'pointer', transition:'all 0.15s',
              }}>
                <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, marginBottom:6, overflow:'hidden' }}>
                  <svg viewBox="0 0 100 100" width="100%" xmlns="http://www.w3.org/2000/svg"
                    dangerouslySetInnerHTML={{ __html: svgContent || `<text x="50" y="55" text-anchor="middle" fill="#5DCAA5" font-size="8">${r.emoji}</text>` }} />
                </div>
                <div style={{ fontSize:10, fontWeight:600, color:'#fff', lineHeight:1.3, marginBottom:2 }}>{r.nome}</div>
                <div style={{ fontSize:9, color: NIVEIS[r.nivel] || '#fff' }}>{r.nivel}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div style={{
          position:'absolute', bottom:60, left:0, right:0,
          background:'rgba(4,52,44,0.97)', borderTop:'0.5px solid rgba(93,202,165,0.3)',
          backdropFilter:'blur(12px)', padding:'14px 16px',
          display:'flex', gap:12, alignItems:'center',
        }}>
          <div style={{ background:'rgba(0,0,0,0.4)', borderRadius:10, padding:6, flexShrink:0 }}>
            <svg viewBox="0 0 100 100" width={64} height={64} xmlns="http://www.w3.org/2000/svg"
              dangerouslySetInnerHTML={{ __html: SVG_RISCOS[sel.id] || '' }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:3 }}>{sel.nome}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>
              {CATEGORIAS[sel.cat]?.label} · {sel.nivel}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>onSelectRisco(sel)} style={{
                flex:1, padding:'8px', fontSize:12, fontWeight:700,
                background:'#1D9E75', color:'#fff', border:'none', borderRadius:8,
              }}>
                Usar no projetor
              </button>
              <button onClick={()=>setSel(null)} style={{
                padding:'8px 12px', fontSize:12, background:'transparent',
                color:'rgba(255,255,255,0.5)', border:'0.5px solid rgba(255,255,255,0.2)', borderRadius:8,
              }}>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CatBtn({ active, cor, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding:'5px 12px', fontSize:11, fontWeight:600, whiteSpace:'nowrap',
      borderRadius:20, border: active ? `1px solid ${cor||'#5DCAA5'}` : '0.5px solid rgba(255,255,255,0.15)',
      background: active ? `rgba(${hexRgb(cor||'#5DCAA5')},0.2)` : 'transparent',
      color: active ? (cor||'#5DCAA5') : 'rgba(255,255,255,0.5)',
      cursor:'pointer',
    }}>{children}</button>
  )
}
function hexRgb(hex) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}
