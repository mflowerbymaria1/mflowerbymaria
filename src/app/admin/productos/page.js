"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter, 
  Loader2, 
  AlertTriangle,
  MoreVertical,
  ExternalLink,
  Tag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]); // Categorías desde la tabla
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // Fetch Productos
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(pData || []);

    // Fetch Categorías Reales
    const { data: cData } = await supabase.from('categories').select('*').order('name', { ascending: true });
    setDbCategories(cData || []);

    setLoading(false);
  }

  const fetchProducts = fetchData; // Mantener alias para compatibilidad

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const allImages = [editingProduct.image_url, ...(editingProduct.gallery || [])].filter(Boolean);
    const updatedImages = [...allImages];
    
    // Move item
    const [movedImage] = updatedImages.splice(sourceIndex, 1);
    updatedImages.splice(targetIndex, 0, movedImage);

    // Re-assign main image (first one) and gallery (rest)
    const newMain = updatedImages[0] || '';
    const newGallery = updatedImages.slice(1);
    
    setEditingProduct({
      ...editingProduct,
      image_url: newMain,
      gallery: newGallery
    });
  };

  const handleOpenEdit = (product = null) => {
    setEditingProduct(product || { name: '', price: 0, stock: 0, category: '', image_url: '', description: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const isNew = !editingProduct.id;
    const { data, error } = isNew 
        ? await supabase.from('products').insert([editingProduct])
        : await supabase.from('products').update(editingProduct).eq('id', editingProduct.id);

    if (error) {
        alert('Error al guardar: ' + error.message);
    } else {
        setIsModalOpen(false);
        fetchProducts();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
      if (!confirm('¿Estás segura de eliminar este producto?')) return;
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert('Error: ' + error.message);
      else fetchProducts();
  };

  const categories = ['Todos', ...dbCategories.map(c => c.name)];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-page-centered">
      <div className="products-layout">
        {/* Header Section */}
        <div className="admin-header-card">
          <div className="header-info">
            <div className="badge-tag">
              <Tag size={12} />
              <span>Inventario Real</span>
            </div>
            <h2 className="title-lg">Gestión de Productos</h2>
            <p className="subtitle">Visualizá, editá y controlá el stock de toda tu tienda.</p>
          </div>
          <button onClick={() => handleOpenEdit()} className="primary-btn">
            <Plus size={20} />
            <span>Añadir Producto</span>
          </button>
        </div>

        {/* Control Bar */}
        <div className="control-bar">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters-wrapper">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="styled-select"
            >
              {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="icon-btn-outline">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        {loading ? (
            <div className="loading-state">
                <Loader2 className="spinner" size={40} />
                <p>Sincronizando catálogo...</p>
            </div>
        ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Imagen */}
                  <div 
                    className="product-image cursor-pointer"
                    onClick={() => window.open(`/productos/${product.id}`, '_blank')}
                  >
                      {product.image_url ? (
                          <img src={product.image_url} alt={product.name} />
                      ) : (
                          <div className="image-placeholder">M•F</div>
                      )}
                      {product.stock < 3 && <div className="low-stock-badge">¡Stock Bajo!</div>}
                  </div>

                  {/* Contenido */}
                  <div className="product-info">
                      <div className="info-header">
                          <div>
                            <span className="category-label">{product.category || 'Varios'}</span>
                            <h3 
                              className="product-name cursor-pointer hover:text-pink-500 transition-colors"
                              onClick={() => window.open(`/productos/${product.id}`, '_blank')}
                            >
                              {product.name}
                            </h3>
                          </div>
                          <button onClick={() => handleDelete(product.id)} className="more-btn text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>

                      {/* Recuadro de Datos */}
                      <div className="data-box">
                          <div className="data-item">
                              <span className="label">Precio</span>
                              <span className="value">${Number(product.price).toLocaleString('es-AR')}</span>
                          </div>
                          <div className="data-item border-left">
                              <span className="label">Stock</span>
                              <span className={`value ${product.stock < 3 ? 'text-red' : ''}`}>{product.stock} <small>u.</small></span>
                          </div>
                      </div>

                      {/* Acciones */}
                      <div className="action-row">
                          <button onClick={() => handleOpenEdit(product)} className="secondary-btn-sm"><Edit2 size={14} /> Editar</button>
                          <button onClick={() => window.open(`/productos/${product.id}`, '_blank')} className="secondary-btn-sm"><ExternalLink size={14} /> Ver</button>
                      </div>
                  </div>
                </div>
              ))}
            </div>
        )}

        {filteredProducts.length === 0 && !loading && (
            <div className="empty-state">
                <Search size={48} />
                <h3>No hay resultados</h3>
                <p>Probá cambiando los filtros o la búsqueda.</p>
            </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN / ALTA */}
      {isModalOpen && (
          <div className="modal-overlay">
              <div className="modal-content animate-in zoom-in duration-300">
                  <div className="modal-header">
                      <h3 className="text-xl font-black text-gray-900">{editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
                  </div>
                  
                  <form onSubmit={handleSave} className="modal-body">
                      <div className="form-grid">
                          <div className="form-group span-2">
                              <label>Nombre del Producto</label>
                              <input 
                                type="text" 
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                required
                              />
                          </div>
                          <div className="form-group">
                              <label>Precio ($)</label>
                              <input 
                                type="number" 
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                required
                              />
                          </div>
                          <div className="form-group">
                              <label>Stock (Unidades)</label>
                              <input 
                                type="number" 
                                value={editingProduct.stock}
                                onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                                required
                              />
                          </div>
                          <div className="form-group span-2">
                              <label>Categoría</label>
                              <select 
                                value={editingProduct.category}
                                onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                required
                                className="styled-input-select"
                              >
                                  <option value="">Seleccionar categoría...</option>
                                  {dbCategories.map(cat => (
                                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                                  ))}
                              </select>
                          </div>
                          <div className="form-group span-2">
                              <label>Imágenes del Producto (La primera será la principal)</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  multiple
                                  onChange={async (e) => {
                                      const files = Array.from(e.target.files);
                                      if (files.length === 0) return;
                                      
                                      setSaving(true);
                                      let newUrls = [];
                                      for (let file of files) {
                                          const formData = new FormData();
                                          formData.append('file', file);
                                          try {
                                              const res = await fetch('/api/upload', {
                                                  method: 'POST',
                                                  body: formData
                                              });
                                              const data = await res.json();
                                              if (res.ok) {
                                                  newUrls.push(data.url);
                                              } else {
                                                  alert('Error al subir: ' + data.error);
                                              }
                                          } catch (err) {
                                              console.error('Error al subir', err);
                                          }
                                      }
                                      
                                      let updatedProduct = { ...editingProduct };
                                      if (!updatedProduct.image_url && newUrls.length > 0) {
                                          updatedProduct.image_url = newUrls[0];
                                          newUrls.shift();
                                      }
                                      updatedProduct.gallery = [...(updatedProduct.gallery || []), ...newUrls];
                                      setEditingProduct(updatedProduct);
                                      setSaving(false);
                                  }}
                                  className="styled-input-file"
                                />
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px', padding: '10px 0' }}>
                                  {(() => {
                                    const allImages = [editingProduct.image_url, ...(editingProduct.gallery || [])].filter(Boolean);
                                    if (allImages.length === 0) return null;
                                    return allImages.map((url, idx) => {
                                      const isMain = url === editingProduct.image_url && idx === 0;
                                      return (
                                        <div 
                                          key={url + '-' + idx} 
                                          draggable
                                          onDragStart={(e) => handleDragStart(e, idx)}
                                          onDragOver={handleDragOver}
                                          onDrop={(e) => handleDrop(e, idx)}
                                          style={{ 
                                            position: 'relative', 
                                            padding: 4, 
                                            border: isMain ? '3px solid #D47792' : '1px solid #ddd', 
                                            borderRadius: 12,
                                            cursor: 'grab',
                                            transition: 'all 0.2s ease',
                                            background: '#fff',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                            userSelect: 'none'
                                          }}
                                          onDragEnd={(e) => { e.currentTarget.style.opacity = '1'; }}
                                          onDragLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                          onDragEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                        >
                                          <img src={url} alt={`Imagen ${idx}`} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', pointerEvents: 'none' }} />
                                          {isMain ? (
                                            <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', background: '#D47792', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(212,119,146,0.2)' }}>Principal</div>
                                          ) : (
                                            <button 
                                              type="button" 
                                              title="Hacer Principal"
                                              onClick={() => {
                                                const oldMain = editingProduct.image_url;
                                                const newGallery = allImages.filter((_, i) => i !== idx);
                                                if (oldMain) newGallery.unshift(oldMain);
                                                setEditingProduct({...editingProduct, image_url: url, gallery: newGallery});
                                              }}
                                              style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', background: '#4B5563', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                            >
                                              Hacer Principal
                                            </button>
                                          )}
                                          <button 
                                            type="button" 
                                            title="Eliminar"
                                            onClick={() => {
                                              const newImages = allImages.filter((_, i) => i !== idx);
                                              const newMain = newImages[0] || '';
                                              const newGallery = newImages.slice(1);
                                              setEditingProduct({...editingProduct, image_url: newMain, gallery: newGallery});
                                            }}
                                            style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: 22, height: 22, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                          >
                                            &times;
                                          </button>
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>
                          </div>
                      </div>

                      <div className="modal-footer">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="btn-link">Cancelar</button>
                          <button type="submit" disabled={saving} className="primary-btn">
                              {saving ? <Loader2 className="animate-spin" size={18} /> : (editingProduct.id ? 'Guardar Cambios' : 'Crear Producto')}
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
        .products-layout { display: flex; flex-direction: column; gap: 32px; }
        
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

        .control-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
        }
        .search-wrapper {
            position: relative;
            background: white;
            border: 1px solid #F3F4F6;
            border-radius: 20px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            flex: 1;
            max-width: 500px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.01);
        }
        .search-icon { color: #9CA3AF; margin-right: 12px; }
        .search-wrapper input {
            width: 100%;
            padding: 18px 0;
            border: none;
            outline: none;
            font-weight: 600;
            color: #374151;
            font-size: 0.95rem;
        }
        .filters-wrapper { display: flex; gap: 12px; }
        .styled-select {
            background: white;
            border: 1px solid #F3F4F6;
            padding: 0 24px;
            border-radius: 16px;
            font-weight: 700;
            color: #4B5563;
            cursor: pointer;
            outline: none;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 32px;
            padding-bottom: 60px;
        }

        .product-card {
            background: white;
            border-radius: 32px;
            border: 1px solid #F3F4F6;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        }
        .product-card:hover { transform: translateY(-12px); box-shadow: 0 30px 60px rgba(0,0,0,0.08); border-color: #FFE4E6; }

        .product-image {
            height: 240px;
            background: #F9FAFB;
            position: relative;
            overflow: hidden;
        }
        .product-image img { width: 100%; height: 100%; object-fit: contain; padding: 12px; background: white; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .product-card:hover .product-image img { transform: scale(1.15); }
        .image-placeholder {
            width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
            font-weight: 900; font-size: 3rem; color: #FFE4E6; background: #FFF5F7;
        }
        .low-stock-badge {
            position: absolute; top: 16px; left: 16px; background: #EF4444; color: white;
            padding: 6px 14px; border-radius: 12px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase;
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
            z-index: 10;
        }

        .product-info { padding: 24px; display: flex; flex-direction: column; gap: 20px; flex: 1; }
        .info-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .category-label { font-size: 0.7rem; font-weight: 800; color: #D47792; text-transform: uppercase; letter-spacing: 1px; }
        .product-name { font-size: 1.1rem; font-weight: 800; color: #111827; margin-top: 4px; line-height: 1.3; }
        .more-btn { background: none; border: none; padding: 8px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
        .more-btn:hover { background: #FEF2F2; }

        .data-box {
            background: #F9FAFB;
            border: 1px solid #F3F4F6;
            border-radius: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            overflow: hidden;
        }
        .data-item { padding: 16px; display: flex; flex-direction: column; gap: 2px; }
        .border-left { border-left: 1px solid #F3F4F6; background: white; }
        .label { font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; }
        .value { font-weight: 900; color: #111827; font-size: 1.1rem; }
        .value small { font-size: 0.75rem; color: #9CA3AF; margin-left: 2px; }
        .text-red { color: #EF4444; }

        .action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .secondary-btn-sm {
            background: #F9FAFB; color: #4B5563; border: 1px solid #F3F4F6; padding: 12px; border-radius: 14px;
            font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
            gap: 8px; cursor: pointer; transition: all 0.3s;
        }
        .secondary-btn-sm:hover { background: #111827; color: white; border-color: #111827; }
        .secondary-btn-sm:nth-child(1):hover { background: #D47792; border-color: #D47792; }

        .loading-state { padding: 80px; text-align: center; color: #9CA3AF; }
        .spinner { animation: spin 1s linear infinite; margin-bottom: 16px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .empty-state { padding: 80px; text-align: center; color: #D1D5DB; }
        .empty-state h3 { color: #4B5563; margin: 16px 0 4px; }

        @media (max-width: 768px) {
            .admin-header-card { flex-direction: column; align-items: flex-start; }
            .control-bar { grid-template-columns: 1fr; }
        }

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
            max-width: 600px;
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
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .span-2 { grid-column: span 2; }
        
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.75rem; font-weight: 800; color: #6B7280; text-transform: uppercase; }
        .form-group input, .styled-input-select {
            padding: 14px 16px;
            background: #F9FAFB;
            border: 1px solid #F3F4F6;
            border-radius: 12px;
            font-weight: 500;
            color: #374151;
            outline: none;
            transition: all 0.2s;
            appearance: none;
        }
        .styled-input-select {
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 18px;
        }
        .form-group input:focus, .styled-input-select:focus { border-color: #D47792; background: white; box-shadow: 0 0 0 4px #FFF1F2; }

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
