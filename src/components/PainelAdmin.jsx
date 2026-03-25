import { useState, useEffect } from 'react'
import { Plus, Trash2, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase.jsx'

export default function PainelAdmin() {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPlant, setNewPlant] = useState({
    name: '',
    category: 'Flores',
    real: '',
    sketch: '',
  })

  useEffect(() => { fetchPlants() }, [])

  async function fetchPlants() {
    const { data, error } = await supabase
      .from('plantas')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setPlants(data)
    setLoading(false)
  }

  async function handleSubmit() {
    if (!newPlant.name.trim()) return
    setSaving(true)
    const { error } = await supabase.from('plantas').insert([{
      name: newPlant.name,
      category: newPlant.category,
      real: newPlant.real || null,
      sketch: newPlant.sketch || null,
    }])
    if (error) {
      alert('Erro ao salvar: ' + error.message)
    } else {
      setNewPlant({ name: '', category: 'Flores', real: '', sketch: '' })
      await fetchPlants()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('plantas').delete().eq('id', id)
    if (!error) setPlants(prev => prev.filter(p => p.id !== id))
  }

  function handleField(field, value) {
    setNewPlant(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={{
      height: '100%', overflowY: 'auto', padding: '24px 16px 100px',
    }}>
      {/* Header */}
      <header style={{
        marginBottom: 24, paddingBottom: 16,
        borderBottom: '0.5px solid rgba(93,202,165,0.15)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 24, color: '#fff', marginBottom: 6,
        }}>
          Gestao de Acervo
        </h2>
        <p style={{
          fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}>
          Adicione novas referencias botanicas
        </p>
      </header>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr',
        gap: 24, maxWidth: 800, margin: '0 auto',
      }}>
        {/* FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Plant name */}
          <div>
            <label style={{
              display: 'block', fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 2,
              color: 'rgba(255,255,255,0.5)', marginBottom: 6,
            }}>
              Nome da Planta/Arte
            </label>
            <input
              type="text"
              placeholder="Ex: Peonia Rosa de Outono"
              value={newPlant.name}
              onChange={e => handleField('name', e.target.value)}
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--borda)', borderRadius: 12,
                color: '#fff', fontSize: 14,
                fontFamily: 'var(--font-body)', outline: 'none',
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{
              display: 'block', fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 2,
              color: 'rgba(255,255,255,0.5)', marginBottom: 6,
            }}>
              Categoria
            </label>
            <select
              value={newPlant.category}
              onChange={e => handleField('category', e.target.value)}
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--borda)', borderRadius: 12,
                color: '#fff', fontSize: 14,
                fontFamily: 'var(--font-body)', outline: 'none',
              }}
            >
              <option value="Flores">Flores</option>
              <option value="Folhagens">Folhagens</option>
              <option value="Fauna">Fauna</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {/* Upload zones */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{
              border: '2px dashed var(--borda)', borderRadius: 16,
              padding: '24px 12px', textAlign: 'center', cursor: 'pointer',
              background: 'rgba(15,110,86,0.06)',
              transition: 'border-color 0.2s',
            }}>
              <Upload size={22} color="rgba(255,255,255,0.35)" style={{ margin: '0 auto 8px' }} />
              <span style={{
                display: 'block', fontSize: 10, textTransform: 'uppercase',
                letterSpacing: 2, color: 'rgba(255,255,255,0.4)',
              }}>
                Subir Foto Real
              </span>
            </div>
            <div style={{
              border: '2px dashed var(--borda)', borderRadius: 16,
              padding: '24px 12px', textAlign: 'center', cursor: 'pointer',
              background: 'rgba(15,110,86,0.06)',
              transition: 'border-color 0.2s',
            }}>
              <Upload size={22} color="rgba(255,255,255,0.35)" style={{ margin: '0 auto 8px' }} />
              <span style={{
                display: 'block', fontSize: 10, textTransform: 'uppercase',
                letterSpacing: 2, color: 'rgba(255,255,255,0.4)',
              }}>
                Subir Risco
              </span>
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={saving} style={{
            width: '100%', padding: '16px', borderRadius: 50,
            background: saving ? 'rgba(255,255,255,0.1)' : 'var(--verde2)',
            color: '#fff', border: 'none',
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 15, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Plus size={18} /> {saving ? 'Salvando...' : 'Publicar no Atelie'}
          </button>
        </div>

        {/* EXISTING LIST */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--borda)', borderRadius: 20,
          padding: '20px 18px', maxHeight: 400, overflowY: 'auto',
        }}>
          <h3 style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 14,
          }}>
            Acervo Atual ({plants.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading && [1, 2, 3].map(i => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(93,202,165,0.1)', borderRadius: 12,
              }}>
                <div className="skeleton-dark" style={{
                  width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton-dark" style={{ height: 14, width: '60%', borderRadius: 4 }} />
                  <div className="skeleton-dark" style={{ height: 10, width: '30%', borderRadius: 4 }} />
                </div>
              </div>
            ))}
            {!loading && plants.length === 0 && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                Nenhuma planta cadastrada ainda.
              </p>
            )}
            {plants.map(plant => (
              <div key={plant.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(93,202,165,0.1)', borderRadius: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {plant.real ? (
                    <img
                      src={plant.real}
                      alt={plant.name}
                      style={{
                        width: 40, height: 40, objectFit: 'cover', borderRadius: 8,
                        border: '1px solid var(--borda)',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--borda)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18,
                    }}>
                      🌿
                    </div>
                  )}
                  <div>
                    <span style={{
                      display: 'block', fontFamily: 'var(--font-display)', fontStyle: 'italic',
                      fontSize: 14, color: '#fff',
                    }}>
                      {plant.name}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                      {plant.category}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(plant.id)} style={{
                  background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                  padding: 6, borderRadius: 8,
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
