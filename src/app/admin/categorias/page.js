"use client";

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ROSE = '#D47792';
const ROSE_LIGHT = '#FFF0F3';
const ROSE_BORDER = '#F5C6D0';

export default function CategoriasPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data || []);
    setLoading(false);
  }

  const handleOpenEdit = (category = null) => {
    setEditingCategory(category || { name: '', slug: '', description: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (!editingCategory.slug) {
      editingCategory.slug = editingCategory.name.toLowerCase().trim().replace(/\s+/g, '-');
    }
    const isNew = !editingCategory.id;
    const { error } = isNew
      ? await supabase.from('categories').insert([editingCategory])
      : await supabase.from('categories').update(editingCategory).eq('id', editingCategory.id);
    if (error) alert('Error: ' + error.message);
    else { setIsModalOpen(false); fetchCategories(); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Segura? Se borrará la categoría.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchCategories();
  };

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    const slugVal = nameVal.toLowerCase().trim().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]/g, '');
    setEditingCategory({ ...editingCategory, name: nameVal, slug: slugVal });
  };

  const inputStyle = { width: '100%', padding: '14px 16px', background: '#F9FAFB', border: '1px solid #eee', borderRadius: 12, fontWeight: 500, color: '#333', outline: 'none', fontSize: 14 };

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '28px 32px', borderRadius: 24, border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ROSE_LIGHT, color: ROSE, padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
            <Tag size={12} /> <span>Organización</span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>Categorías del Catálogo</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Organizá tus productos en categorías para que tus clientes los encuentren fácil.</p>
        </div>
        <button onClick={() => handleOpenEdit()} style={{ background: '#1a1a1a', color: '#fff', padding: '14px 24px', borderRadius: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, border: 'none', cursor: 'pointer', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Loader2 size={40} style={{ color: ROSE, animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#aaa', marginTop: 16, fontWeight: 600 }}>Cargando categorías...</p>
        </div>
      ) : categories.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ background: '#fff', borderRadius: 20, border: `2px solid ${ROSE_BORDER}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, transition: 'all 0.3s' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: ROSE_LIGHT, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, color: ROSE, textTransform: 'uppercase' }}>
                  <span style={{ width: 6, height: 6, background: ROSE, borderRadius: '50%', display: 'inline-block' }}></span>
                  Categoría
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleOpenEdit(cat)} title="Editar" style={{ width: 32, height: 32, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#aaa' }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} title="Eliminar" style={{ width: 32, height: 32, background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#DC2626' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', marginBottom: 6 }}>{cat.name}</h3>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{cat.description || 'Sin descripción'}</p>
              </div>

              {/* Card Footer */}
              <div style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                <span style={{ background: ROSE_LIGHT, color: ROSE, padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>/{cat.slug}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 24, border: '2px dashed #ddd' }}>
          <Tag size={48} style={{ color: '#ddd', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', marginBottom: 4 }}>No hay categorías creadas</h3>
          <p style={{ color: '#aaa' }}>Agregá una nueva categoría para organizar tus productos.</p>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 24, maxWidth: 500, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ background: ROSE, color: '#fff', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>{editingCategory?.id ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10, padding: 6, cursor: 'pointer', color: '#fff' }}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} style={{ padding: 28 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'block' }}>Nombre</label>
                  <input type="text" value={editingCategory?.name || ''} onChange={handleNameChange} required placeholder="Ej: Repuestos A4" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'block' }}>Slug (URL)</label>
                  <input type="text" value={editingCategory?.slug || ''} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} required placeholder="ej-repuestos-a4" style={inputStyle} />
                  <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Se autogenera al escribir el nombre.</p>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'block' }}>Descripción</label>
                  <input type="text" value={editingCategory?.description || ''} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} placeholder="Opcional..." style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontWeight: 700, color: '#aaa', cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ background: ROSE, color: '#fff', padding: '12px 24px', borderRadius: 14, fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Guardar Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
