"use client";

import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, CheckCircle, Copy, UserCheck, Search, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ROSE = '#D47792';
const ROSE_LIGHT = '#FFF0F3';
const ROSE_BORDER = '#F5C6D0';

export default function MayoristasAdminPage() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeVal, setNewCodeVal] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCodes();
  }, []);

  async function fetchCodes() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*').like('name', 'WHOLESALE_CODE:%');
      if (!error && data && data.length > 0) {
        const parsed = data.map(item => {
          let extra = {};
          try { extra = JSON.parse(item.description || '{}'); } catch(e) {}
          return {
            id: item.id,
            name: extra.name || 'Cliente Mayorista',
            code: item.slug ? item.slug.replace('wholesale-code-', '').toUpperCase() : 'MAY-CODE',
            status: extra.status || 'active',
            created_at: item.created_at
          };
        });
        setCodes(parsed);
      } else {
        const initial = [
          { id: '1', name: 'Cliente Ejemplo 1', code: 'MAY-MARIA-2026', created_at: new Date().toISOString(), status: 'active' },
          { id: '2', name: 'Revendedor N°2', code: 'FLOWER-MAYOR-88', created_at: new Date().toISOString(), status: 'active' }
        ];
        setCodes(initial);
      }
    } catch(e) {
      console.error('Error fetching wholesale codes:', e);
    } finally {
      setLoading(false);
    }
  }

  function generateRandomCode() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = newCodeName ? newCodeName.trim().slice(0, 4).toUpperCase() : 'MAY';
    setNewCodeVal(prefix + '-' + randomNum + '-2026');
  }

  async function handleCreateCode(e) {
    e.preventDefault();
    if (!newCodeVal.trim()) return alert('Por favor ingresá o generá un código de acceso.');
    
    const codeClean = newCodeVal.trim().toUpperCase();
    const clientName = newCodeName.trim() || 'Cliente Sin Nombre';

    const { error } = await supabase.from('categories').insert([{
      name: 'WHOLESALE_CODE:' + codeClean,
      slug: 'wholesale-code-' + codeClean.toLowerCase(),
      description: JSON.stringify({ name: clientName, status: 'active' })
    }]);

    if (error) {
      alert('Error al guardar código: ' + error.message);
      return;
    }

    fetchCodes();
    setNewCodeName('');
    setNewCodeVal('');
    alert('¡Código Mayorista creado exitosamente y sincronizado en la nube!');
  }

  async function handleDeleteCode(id) {
    if (confirm('¿Estás segura de eliminar este código de acceso mayorista?')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCodes();
    }
  }

  async function toggleStatus(id) {
    const item = codes.find(c => c.id === id);
    if (!item) return;
    const newStatus = item.status === 'active' ? 'paused' : 'active';
    await supabase.from('categories').update({
      description: JSON.stringify({ name: item.name, status: newStatus })
    }).eq('id', id);
    fetchCodes();
  }

  function copyToClipboard(text, id) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredCodes = codes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '2px solid ' + ROSE_BORDER, marginBottom: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ROSE_LIGHT, color: ROSE, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
              <Key size={14} /> Gestión de Acceso Restringido
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>Clientes y Códigos Mayoristas</h2>
            <p style={{ fontSize: 13, color: '#777', marginTop: 4 }}>Creá códigos de acceso individuales para tus revendedores y clientes mayoristas.</p>
          </div>
          
          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', padding: '10px 16px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={20} style={{ color: '#D97706' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#92400E' }}>Monto Mínimo Configurado:</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#B45309' }}>$200.000 (Surtido Libre)</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '2px solid ' + ROSE_BORDER, height: 'fit-content' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} style={{ color: ROSE }} /> Crear Nuevo Código
          </h3>

          <form onSubmit={handleCreateCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Cliente / Negocio:</label>
              <input 
                type="text" 
                placeholder="Ej: Librería Papelería San Telmo"
                value={newCodeName}
                onChange={e => setNewCodeName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #ddd', fontSize: 13, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Código de Acceso Único:</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  placeholder="Ej: MAY-STELMO-2026"
                  value={newCodeVal}
                  onChange={e => setNewCodeVal(e.target.value.toUpperCase())}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '2px solid ' + ROSE_BORDER, fontSize: 13, fontWeight: 800, color: ROSE, outline: 'none' }}
                  required
                />
                <button 
                  type="button" 
                  onClick={generateRandomCode}
                  style={{ background: ROSE_LIGHT, border: '1px solid ' + ROSE_BORDER, color: ROSE, padding: '0 12px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Generar al azar"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <button 
              type="submit"
              style={{ background: ROSE, color: '#fff', border: 'none', padding: '12px 18px', borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, transition: 'all 0.2s' }}
            >
              <UserCheck size={18} /> Guardar Código Mayorista
            </button>
          </form>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '2px solid ' + ROSE_BORDER }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Códigos de Acceso Activos ({codes.length})</h3>
            
            <div style={{ position: 'relative', width: 220 }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input 
                type="text"
                placeholder="Buscar cliente o código..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 10, border: '1px solid #ddd', fontSize: 12 }}
              />
            </div>
          </div>

          {filteredCodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#aaa', background: '#fafafa', borderRadius: 14, border: '2px dashed #eee' }}>
              <Key size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 700 }}>No hay códigos mayoristas registrados.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredCodes.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 14, border: '1px solid ' + ROSE_BORDER, background: item.status === 'active' ? '#fff' : '#fafafa', opacity: item.status === 'active' ? 1 : 0.6 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a1a' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 900, background: ROSE_LIGHT, color: ROSE, padding: '2px 8px', borderRadius: 6, fontSize: 13, border: '1px solid ' + ROSE_BORDER }}>
                        {item.code}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(item.code, item.id)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                      >
                        {copiedId === item.id ? <CheckCircle size={14} style={{ color: '#059669' }} /> : <Copy size={14} />}
                        {copiedId === item.id ? '¡Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      style={{ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', background: item.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: item.status === 'active' ? '#059669' : '#DC2626' }}
                    >
                      {item.status === 'active' ? 'ACTIVO' : 'PAUSADO'}
                    </button>
                    <button 
                      onClick={() => handleDeleteCode(item.id)} 
                      style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
