export default function Home({ onNavigate }) {
  const modules = [
    {
      id: 'biblioteca',
      tag: 'Biblioteca',
      icon: '🖼',
      title: 'Biblioteca de Riscos',
      desc: '65 riscos botânicos vetoriais prontos para projetar na parede.',
      features: ['Rosas, folhas, mandalas, sakura', 'Filtro por categoria e nível', 'Preview com SVG vetorial', 'Envio direto ao projetor'],
      cor: '#1D9E75',
    },
    {
      id: 'estudio',
      tag: 'Estúdio',
      icon: '✏️',
      title: 'Estúdio de Riscos',
      desc: 'Crie seus próprios riscos com espelhamento automático em tempo real.',
      features: ['Espelho radial em 8 eixos', 'Desenho livre com dedo', '8 cores + borracha', 'Exportação PNG alta resolução'],
      cor: '#993556',
    },
    {
      id: 'projetor',
      tag: 'Projetor',
      icon: '📱',
      title: 'Projetor Virtual',
      desc: 'A câmera do seu celular vira um projetor profissional na parede.',
      features: ['Câmera frontal e traseira', 'Ajuste de opacidade e escala', 'Filtro Contorno (só as linhas)', 'Zoom com dois dedos'],
      cor: '#534AB7',
    },
    {
      id: 'simulador',
      tag: 'Simulador',
      icon: '🎨',
      title: 'Simulador de Parede',
      desc: 'Teste cores e texturas antes de comprar. Calcule tinta e orçamento.',
      features: ['Cálculo automático de litros', 'Orçamento completo com mão de obra', '4 texturas simuladas', 'Paleta + cor personalizada'],
      cor: '#B45309',
    },
  ]

  const steps = [
    { num: '01', icon: '🌿', title: 'Escolha ou crie o motivo', desc: 'Selecione entre rosas, folhas tropicais, mandalas ou desenhe o seu com espelho automático.' },
    { num: '02', icon: '📱', title: 'Projete na parede', desc: 'Aponte a câmera para a parede. O risco aparece sobreposto. Ajuste tamanho e posição.' },
    { num: '03', icon: '🎨', title: 'Trace e pinte', desc: 'Use o filtro Contorno para ver só as linhas. Trace com lápis e pinte com perfeição.' },
  ]

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '32px 20px 24px' }}>
        <div style={{
          display: 'inline-block', background: 'rgba(29,158,117,0.25)', border: '1px solid var(--verde3)',
          color: 'var(--verde3)', fontSize: 11, letterSpacing: 3, padding: '5px 16px', borderRadius: 30,
          marginBottom: 20, fontFamily: 'var(--font-body)', textTransform: 'uppercase',
        }}>Ateliê Botânico</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 900,
          color: '#fff', marginBottom: 10, lineHeight: 1.15,
        }}>
          Riscos <em style={{ color: 'var(--verde3)', fontStyle: 'italic' }}>perfeitos</em><br />com o seu celular
        </h1>
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
          maxWidth: 340, margin: '0 auto 20px',
        }}>
          Projete flores na parede, crie riscos com espelho automático e calcule sua tinta em segundos.
        </p>
        <button onClick={() => onNavigate('biblioteca')} style={{
          background: 'var(--verde2)', color: '#fff', padding: '14px 32px', borderRadius: 50,
          fontSize: 14, fontWeight: 700, border: 'none', marginBottom: 6,
        }}>Começar agora</button>
      </div>

      {/* Como funciona */}
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{
          fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--verde3)',
          marginBottom: 10, fontFamily: 'var(--font-body)',
        }}>Como funciona</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
          color: '#fff', marginBottom: 16, lineHeight: 1.2,
        }}>
          3 passos para o risco <em style={{ color: 'var(--verde3)', fontStyle: 'italic' }}>perfeito</em>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {steps.map(s => (
            <div key={s.num} style={{
              background: 'rgba(15,110,86,0.12)', border: '1px solid rgba(93,202,165,0.2)',
              borderRadius: 20, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                fontFamily: 'var(--font-accent)', fontSize: 28, fontWeight: 600,
                color: 'rgba(93,202,165,0.2)', lineHeight: 1, minWidth: 36,
              }}>{s.num}</div>
              <div>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Módulos */}
      <div style={{ padding: '16px 16px 100px', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{
          fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--verde3)',
          marginBottom: 10,
        }}>Funcionalidades</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
          color: '#fff', marginBottom: 16, lineHeight: 1.2,
        }}>
          Tudo num <em style={{ color: 'var(--verde3)', fontStyle: 'italic' }}>só lugar</em>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {modules.map(m => (
            <button key={m.id} onClick={() => onNavigate(m.id)} style={{
              background: 'rgba(2,44,34,0.7)', border: '1px solid rgba(93,202,165,0.15)',
              borderRadius: 24, padding: '24px 22px', textAlign: 'left', width: '100%',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Decorative circle */}
              <div style={{
                position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                borderRadius: '50%', background: 'rgba(29,158,117,0.08)',
              }} />
              <span style={{
                display: 'inline-block', background: 'rgba(29,158,117,0.2)', color: 'var(--verde3)',
                padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                marginBottom: 12, position: 'relative',
              }}>{m.tag}</span>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', marginBottom: 8,
                }}>{m.title}</div>
                <div style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 14,
                }}>{m.desc}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {m.features.map((f, i) => (
                    <li key={i} style={{
                      fontSize: 12, color: 'rgba(255,255,255,0.7)', paddingLeft: 18,
                      position: 'relative', lineHeight: 2,
                    }}>
                      <span style={{
                        position: 'absolute', left: 0, color: 'var(--verde3)', fontSize: 9, top: 4,
                      }}>✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
