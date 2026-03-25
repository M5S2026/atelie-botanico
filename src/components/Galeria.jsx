import { useState, useEffect } from 'react'
import { Layers, Sun, Contrast, Lock, Unlock, Eye, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../lib/supabase.jsx'

export default function Galeria() {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlant, setSelectedPlant] = useState(null)

  useEffect(() => {
    supabase
      .from('plantas')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPlants(data)
        setLoading(false)
      })
  }, [])
  const [opacity, setOpacity] = useState(50)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [isLocked, setIsLocked] = useState(false)
  const [isInverted, setIsInverted] = useState(false)

  // === GALERIA ===
  if (!selectedPlant) {
    return (
      <div style={{
        height: '100%', overflowY: 'auto', background: '#FDFCF8',
      }}>
        <div style={{ padding: '32px 24px 100px', maxWidth: 520, margin: '0 auto' }}>
          {/* Header */}
          <header style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 8vw, 42px)',
              color: '#2C3E50', fontStyle: 'italic', fontWeight: 700, marginBottom: 8,
            }}>Ateliê Botânico</h1>
            <p style={{
              color: '#7F8C8D', fontWeight: 300, textTransform: 'uppercase',
              letterSpacing: 5, fontSize: 10,
            }}>Referência & Projeção Artística</p>
          </header>

          {/* Cards */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  background: '#fff', overflow: 'hidden',
                  border: '1px solid #E5E2D9',
                }}>
                  <div className="skeleton" style={{ height: 360, width: '100%' }} />
                  <div style={{
                    padding: '14px 18px', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div className="skeleton" style={{
                      height: 18, width: 140, borderRadius: 4,
                    }} />
                    <div className="skeleton" style={{
                      height: 10, width: 50, borderRadius: 4,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {plants.map(plant => (
              <div key={plant.id} onClick={() => setSelectedPlant(plant)} style={{
                cursor: 'pointer', background: '#fff', overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #E5E2D9', transition: 'box-shadow 0.5s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
              >
                <div style={{ position: 'relative', height: 360, overflow: 'hidden' }}>
                  <img src={plant.real} alt={plant.name} loading="lazy" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'grayscale(20%)', transition: 'filter 0.7s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'grayscale(0%)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'grayscale(20%)'}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.05)', transition: 'background 0.5s',
                  }} />
                  {plant.sketch && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                      padding: '4px 12px', fontSize: 9, letterSpacing: 3,
                      textTransform: 'uppercase', color: '#7F8C8D',
                    }}>Foto + Risco</div>
                  )}
                </div>
                <div style={{
                  padding: '14px 18px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                    fontSize: 18, color: '#2C3E50',
                  }}>{plant.name}</span>
                  <span style={{
                    fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
                    color: '#B0ADA5',
                  }}>{plant.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // === VISUALIZADOR / PROJETOR ===
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      overflow: isLocked ? 'hidden' : 'auto', background: '#000',
    }}>
      {/* Header do Projetor */}
      <div style={{
        height: 52, background: '#1A1A1A', borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', flexShrink: 0, zIndex: 50,
      }}>
        <button onClick={() => { setSelectedPlant(null); setOpacity(50); setBrightness(100); setContrast(100); setIsInverted(false); setIsLocked(false) }}
          style={{
            fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.6)',
            background: 'none', border: 'none', fontStyle: 'italic',
            fontFamily: "'Playfair Display', serif",
          }}>← Voltar Galeria</button>

        <span style={{
          fontFamily: "'Playfair Display', serif", fontSize: 15, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.7)', position: 'absolute', left: '50%',
          transform: 'translateX(-50%)',
        }}>{selectedPlant.name}</span>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setIsInverted(!isInverted)} style={{
            padding: 8, borderRadius: 8, border: 'none',
            background: isInverted ? '#fff' : 'transparent',
            color: isInverted ? '#000' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} title="Inverter para Projeção">
            <Layers size={18} />
          </button>
          <button onClick={() => setIsLocked(!isLocked)} style={{
            padding: 8, background: 'none', border: 'none',
            color: isLocked ? '#C5A572' : 'rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
          </button>
        </div>
      </div>

      {/* Area de Projecao — Container Mestre 4:5 */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', padding: 12, position: 'relative',
      }}>
        <div style={{
          position: 'relative', width: '100%', maxWidth: 800,
          aspectRatio: '4/5', background: '#111',
          boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          filter: `brightness(${brightness}%) contrast(${contrast}%)${isInverted ? ' invert(1)' : ''}`,
          pointerEvents: isLocked ? 'none' : 'auto',
        }}>
          {/* Camada 1: Foto Real (Fundo) — alinhamento central absoluto */}
          <img src={selectedPlant.real} alt="Referencia Real" style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%', height: '100%',
            objectFit: 'contain',
          }} />

          {/* Camada 2: Risco (Sobreposicao) — mesmo pivot central */}
          {selectedPlant.sketch && (
            <img src={selectedPlant.sketch} alt="Risco Tecnico" style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%', height: '100%',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              opacity: opacity / 100,
              transition: 'opacity 0.15s ease-out',
            }} />
          )}
        </div>
      </div>

      {/* Painel de Controle */}
      <div style={{
        background: 'rgba(26,26,26,0.92)', backdropFilter: 'blur(12px)',
        padding: '18px 20px 14px', borderTop: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        {selectedPlant.sketch ? (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20,
            maxWidth: 800, margin: '0 auto',
          }}>
            {/* Opacidade */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 9, textTransform: 'uppercase', letterSpacing: 3,
                color: 'rgba(255,255,255,0.5)', marginBottom: 10,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ImageIcon size={11} /> Foto
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  Risco <Eye size={11} />
                </span>
              </div>
              <input type="range" min={0} max={100} value={opacity}
                onChange={e => setOpacity(parseInt(e.target.value))}
                style={{ width: '100%' }} />
            </div>

            {/* Brilho */}
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 9, textTransform: 'uppercase', letterSpacing: 3,
                color: 'rgba(255,255,255,0.5)', marginBottom: 10,
              }}>
                <Sun size={11} /> Brilho Projeção
              </div>
              <input type="range" min={50} max={200} value={brightness}
                onChange={e => setBrightness(parseInt(e.target.value))}
                style={{ width: '100%' }} />
            </div>

            {/* Contraste */}
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 9, textTransform: 'uppercase', letterSpacing: 3,
                color: 'rgba(255,255,255,0.5)', marginBottom: 10,
              }}>
                <Contrast size={11} /> Nitidez do Risco
              </div>
              <input type="range" min={50} max={300} value={contrast}
                onChange={e => setContrast(parseInt(e.target.value))}
                style={{ width: '100%' }} />
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '8px 0',
            fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic',
            fontFamily: "'Playfair Display', serif",
          }}>
            Risco artístico em breve — em fase de finalização.
          </div>
        )}
      </div>
    </div>
  )
}
