"use client";

import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CategoriasPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }

  const handleOpenEdit = (category = null) => {
    setEditingCategory(category || { name: '', slug: '', description: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Auto-slugify if empty
    if (!editingCategory.slug) {
        editingCategory.slug = editingCategory.name.toLowerCase().trim().replace(/\s+/g, '-');
    }

    const isNew = !editingCategory.id;
    const { error } = isNew 
        ? await supabase.from('categories').insert([editingCategory])
        : await supabase.from('categories').update(editingCategory).eq('id', editingCategory.id);

    if (error) {
        alert('Error: ' + error.message);
    } else {
        setIsModalOpen(false);
        fetchCategories();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
      if (!confirm('¿Segura? Se borrará la categoría pero los productos quedarán sin asignar.')) return;
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) alert('Error: ' + error.message);
      else fetchCategories();
  };

  const handleNameChange = (e) => {
      const nameVal = e.target.value;
      const slugVal = nameVal
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, "") // remove accents
          .replace(/[^a-z0-9-]/g, '');
          
      setEditingCategory({
          ...editingCategory,
          name: nameVal,
          slug: slugVal
      });
  };

  return (
    <div className="admin-page-centered">
      <div className="categories-layout animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="admin-header-card">
          <div className="header-info">
            <div className="badge-tag">
              <Tag size={12} />
              <span>Organización</span>
            </div>
            <h2 className="title-lg">Categorías del Catálogo</h2>
            <p className="subtitle">Definí las estanterías de tu tienda para ordenar tus cuadernos, repuestos y planners.</p>
          </div>
          <button onClick={() => handleOpenEdit()} className="primary-btn">
            <Plus size={20} />
            <span>Nueva Categoría</span>
          </button>
        </div>

        {/* Categories Grid/Table */}
        {loading ? (
            <div className="loading-state">
                <Loader2 className="spinner" size={40} />
                <p>Sincronizando categorías...</p>
            </div>
        ) : categories.length > 0 ? (
            <div className="categories-grid">
                {categories.map((cat) => (
                    <div key={cat.id} className="category-card">
                        <div className="card-header">
                            <div className="category-tag">
                                <span className="dot"></span>
                                <span>Categoría</span>
                            </div>
                            <div className="actions">
                                <button onClick={() => handleOpenEdit(cat)} className="icon-action-btn" title="Editar"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(cat.id)} className="icon-action-btn delete" title="Eliminar"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="card-body">
                            <h3 className="category-title-text">{cat.name}</h3>
                            <p className="category-desc-text">{cat.description || 'Sin descripción'}</p>
                        </div>
                        <div className="card-footer">
                            <span className="slug-badge">/{cat.slug}</span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="empty-state">
                <Tag size={48} />
                <h3>No hay categorías creadas</h3>
                <p>Comenzá agregando una nueva categoría para organizar tus productos.</p>
            </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
          <div className="modal-overlay">
              <div className="modal-content animate-in zoom-in duration-300">
                  <div className="modal-header">
                      <h3 className="text-xl font-black text-gray-900">{editingCategory.id ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
                  </div>
                  <form onSubmit={handleSave} className="modal-body">
                      <div className="space-y-6">
                          <div className="form-group">
                              <label>Nombre</label>
                              <input 
                                type="text" 
                                value={editingCategory.name}
                                onChange={handleNameChange}
                                required
                                placeholder="Ej: Repuestos A4"
                              />
                          </div>
                          <div className="form-group">
                              <label>Slug (URL)</label>
                              <input 
                                type="text" 
                                value={editingCategory.slug}
                                onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})}
                                placeholder="ej-repuestos-a4"
                                required
                              />
                              <p className="text-[10px] text-gray-400">Se autogenera al escribir el nombre, pero podés cambiarlo.</p>
                          </div>
                          <div className="form-group">
                              <label>Descripción</label>
                              <input 
                                type="text" 
                                value={editingCategory.description || ''}
                                onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                                placeholder="Opcional..."
                              />
                          </div>
                      </div>
                      <div className="modal-footer">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="btn-link">Cancelar</button>
                          <button type="submit" disabled={saving} className="primary-btn">
                              {saving ? <Loader2 className="animate-spin" size={18} /> : 'Guardar Categoría'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      <style jsx>{`
        .admin-page-centered { 
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px 0;
        }
        .categories-layout { display: flex; flex-direction: column; gap: 32px; }
        
        .admin-header-card {
            background: white;
            padding: 32px;
            border-radius: 32px;
            border: 1px solid #F3F4F6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .badge-tag {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #FFF1F2;
            color: #D47792;
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            width: fit-content;
            margin-bottom: 12px;
        }
        .title-lg { font-size: 2.2rem; font-weight: 900; color: #111827; letter-spacing: -1px; }
        .subtitle { color: #6B7280; font-weight: 500; font-size: 0.95rem; }

        .primary-btn {
            background: #111827;
            color: white;
            padding: 16px 28px;
            border-radius: 20px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 10px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .primary-btn:hover { background: #D47792; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(212, 119, 146, 0.2); }

        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 24px;
            padding-bottom: 60px;
        }

        .category-card {
            background: white;
            border-radius: 24px;
            border: 1px solid #F3F4F6;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 12px rgba(0,0,0,0.01);
        }
        .category-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); border-color: #FFE4E6; }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .category-tag {
            display: flex;
            align-items: center;
            gap: 6px;
            background: #F9FAFB;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.65rem;
            font-weight: 800;
            color: #6B7280;
            text-transform: uppercase;
        }
        .category-tag .dot { width: 6px; height: 6px; background: #D47792; border-radius: 50%; }
        .actions { display: flex; gap: 8px; }
        .icon-action-btn {
            background: #F9FAFB;
            border: 1px solid #F3F4F6;
            color: #9CA3AF;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .icon-action-btn:hover { background: #FFE4E6; color: #D47792; border-color: #FFE4E6; }
        .icon-action-btn.delete:hover { background: #FEE2E2; color: #EF4444; border-color: #FEE2E2; }

        .card-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .category-title-text { font-size: 1.25rem; font-weight: 800; color: #111827; }
        .category-desc-text { font-size: 0.85rem; color: #6B7280; line-height: 1.5; font-weight: 500; }

        .card-footer { display: flex; align-items: center; }
        .slug-badge {
            background: #FFF1F2;
            color: #D47792;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            font-mono: monospace;
        }

        .loading-state { padding: 80px; text-align: center; color: #9CA3AF; }
        .spinner { animation: spin 1s linear infinite; margin-bottom: 16px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .empty-state { padding: 80px; text-align: center; color: #D1D5DB; }
        .empty-state h3 { color: #4B5563; margin: 16px 0 4px; }

        /* MODAL STYLES */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(8px);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-content {
            background: white;
            width: 100%;
            max-width: 500px;
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }
        .modal-header {
            padding: 24px 32px;
            background: #F9FAFB;
            border-bottom: 1px solid #F3F4F6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .close-btn { background: none; border: none; font-size: 2rem; color: #9CA3AF; cursor: pointer; }
        
        .modal-body { padding: 32px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.75rem; font-weight: 800; color: #6B7280; text-transform: uppercase; }
        .form-group input {
            padding: 14px 16px;
            background: #F9FAFB;
            border: 1px solid #F3F4F6;
            border-radius: 12px;
            font-weight: 500;
            color: #374151;
            outline: none;
            transition: all 0.2s;
        }
        .form-group input:focus { border-color: #D47792; background: white; box-shadow: 0 0 0 4px #FFF1F2; }

        .modal-footer {
            margin-top: 32px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 16px;
        }
        .btn-link { background: none; border: none; font-weight: 700; color: #9CA3AF; cursor: pointer; }
      `}</style>
    </div>
  );
}
