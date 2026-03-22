export default function Home({ onNavigate }) {
  const cards = [
    { id:'biblioteca', emoji:'🖼',  title:'Biblioteca de Riscos',    desc:'65 riscos botânicos vetoriais prontos para projetar', cor:'#1D9E75' },
    { id:'estudio',    emoji:'✏️',  title:'Estúdio de Riscos',       desc:'Crie riscos com espelho radial e desenho livre',      cor:'#993556' },
    { id:'referencias', emoji:'📸', title:'Fotos de Referência',     desc:'Fotos reais de flores e folhas para guiar seu risco', cor:'#185FA5' },
    { id:'projetor',   emoji:'📱',  title:'Projetor Virtual',        desc:'Projete qualquer risco na parede pelo celular',       cor:'#534AB7' },
    { id:'simulador',  emoji:'🎨',  title:'Simulador de Parede',     desc:'Teste cores, texturas e calcule tinta antes de pintar', cor:'#B45309' },
  ]

  return (
    <div style={{ height:'100%', overflowY:'auto', padding:'20px 16px' }}>
      <div style={{ textAlign:'center', marginBottom:28, paddingTop:8 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🌿</div>
        <h1 style={{
          fontFamily:'var(--font-display)', fontSize:32, fontWeight:900,
          color:'#fff', marginBottom:6, letterSpacing:1,
        }}>
          Ateliê Botânico
        </h1>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6, maxWidth:280, margin:'0 auto' }}>
          Riscos perfeitos com o seu celular · Projeção · Pintura
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:420, margin:'0 auto' }}>
        {cards.map(c => (
          <button key={c.id} onClick={() => onNavigate(c.id)} style={{
            background:`rgba(${hexToRgb(c.cor)},0.12)`,
            border:`1px solid rgba(${hexToRgb(c.cor)},0.3)`,
            borderRadius:16, padding:'18px 14px',
            textAlign:'left', cursor:'pointer',
            transition:'transform 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
          >
            <div style={{ fontSize:28, marginBottom:8 }}>{c.emoji}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:4 }}>{c.title}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', lineHeight:1.4 }}>{c.desc}</div>
          </button>
        ))}
      </div>

      <div style={{
        margin:'24px auto 0', maxWidth:420,
        background:'rgba(29,158,117,0.1)', border:'1px solid rgba(93,202,165,0.25)',
        borderRadius:14, padding:'14px 16px',
      }}>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.7 }}>
          <strong style={{color:'#5DCAA5'}}>Como usar:</strong> Escolha um risco na biblioteca ou uma foto de referência,
          toque em <em>Projetor</em>, aponte o celular para a parede e trace com lápis ou carvão.
        </p>
      </div>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}
