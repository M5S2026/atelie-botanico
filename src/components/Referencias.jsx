import { useState, useRef } from 'react'
import { REFERENCIAS, CATEGORIAS } from '../data/library.js'

export default function Referencias({ onSelectRef }) {
  const [cat, setCat] = useState('all')
  const [sel, setSel] = useState(null)
  const [userPhotos, setUserPhotos] = useState([])
  const fileRef = useRef()

  const items = [
    ...userPhotos,
    ...REFERENCIAS.filter(r => cat === 'all' || r.cat === cat)
  ]

  function loadPhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const photo = {
      id: 'user-' + Date.now(),
      cat: 'user', nome: file.name.replace(/\.[^.]+$/, ''),
      emoji: '📷', url,
      dicas: ['Foto carregada por você', 'Use no projetor para traçar diretamente na parede'],
      riscoId: null, isUser: true,
    }
    setUserPhotos(p => [photo, ...p])
    setSel(photo)
  }

  const cats = [...new Set(REFERENCIAS.map(r=>r.cat))]

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      {/* Header + Upload */}
      <div style={{ padding:'16px 16px 0', flexShrink:0 }}>
        <div style={{ fontSize:11, letterSpacing:4, textTransform:'uppercase', color:'var(--verde3)', marginBottom:10 }}>Referências</div>
        <button onClick={()=>fileRef.current.click()} style={{
          width:'100%', padding:'12px', fontSize:13, fontWeight:600,
          background:'rgba(29,158,117,0.15)', border:'1px dashed rgba(93,202,165,0.4)',
          color:'#5DCAA5', borderRadius:50, cursor:'pointer',
        }}>
          📷 Carregar minha foto de referência
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={loadPhoto} />
      </div>

      {/* Categories */}
      <div style={{ padding:'10px 14px 0', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
        <CatBtn active={cat==='all'} onClick={()=>setCat('all')}>Todas</CatBtn>
        {cats.map(k => (
          CATEGORIAS[k] &&
          <CatBtn key={k} active={cat===k} cor={CATEGORIAS[k].cor} onClick={()=>setCat(k)}>
            {CATEGORIAS[k].emoji} {CATEGORIAS[k].label.split(' ')[0]}
          </CatBtn>
        ))}
      </div>

      <div style={{ padding:'8px 14px 4px', fontSize:11, color:'rgba(255,255,255,0.4)', flexShrink:0 }}>
        {items.length} referências
      </div>

      {/* Grid */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 14px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {items.map(r => (
            <div key={r.id} onClick={()=>setSel(r === sel ? null : r)} style={{
              borderRadius:14, overflow:'hidden',
              border: sel?.id===r.id ? '2px solid #5DCAA5' : '0.5px solid rgba(93,202,165,0.15)',
              cursor:'pointer', background:'rgba(255,255,255,0.04)',
            }}>
              <div style={{ height:120, overflow:'hidden', background:'rgba(0,0,0,0.3)' }}>
                <img src={r.url} alt={r.nome} loading="lazy" style={{
                  width:'100%', height:'100%', objectFit:'cover', display:'block',
                }} onError={e=>{ e.target.style.display='none' }} />
              </div>
              <div style={{ padding:'8px 10px' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'#fff', lineHeight:1.3 }}>{r.nome}</div>
                {r.isUser && <div style={{ fontSize:10, color:'#5DCAA5', marginTop:2 }}>Sua foto</div>}
                {!r.isUser && CATEGORIAS[r.cat] &&
                  <div style={{ fontSize:10, color: CATEGORIAS[r.cat].cor, marginTop:2 }}>{CATEGORIAS[r.cat].label}</div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {sel && (
        <div style={{
          position:'absolute', bottom:60, left:0, right:0,
          background:'rgba(4,52,44,0.97)', borderTop:'0.5px solid rgba(93,202,165,0.3)',
          backdropFilter:'blur(12px)', padding:'14px 16px',
        }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:10 }}>
            <img src={sel.url} alt={sel.nome} style={{
              width:64, height:64, objectFit:'cover', borderRadius:10, flexShrink:0,
            }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:3 }}>{sel.nome}</div>
              {sel.dicas && (
                <ul style={{ paddingLeft:14, margin:0 }}>
                  {sel.dicas.slice(0,2).map((d,i) => (
                    <li key={i} style={{ fontSize:11, color:'rgba(255,255,255,0.6)', lineHeight:1.5 }}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>onSelectRef(sel)} style={{
              flex:1, padding:'12px', fontSize:13, fontWeight:700,
              background:'var(--azul2)', color:'#fff', border:'none', borderRadius:50,
            }}>
              Usar no projetor
            </button>
            <button onClick={()=>setSel(null)} style={{
              padding:'9px 14px', fontSize:12, background:'transparent',
              color:'rgba(255,255,255,0.5)', border:'0.5px solid rgba(255,255,255,0.2)', borderRadius:8,
            }}>
              ✕
            </button>
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
      background: active ? `rgba(255,255,255,0.1)` : 'transparent',
      color: active ? '#fff' : 'rgba(255,255,255,0.5)',
      cursor:'pointer',
    }}>{children}</button>
  )
}
