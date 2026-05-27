"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  Ticket,
  Percent,
  Banknote,
  Truck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CuponesPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    // Fetch only products that are COUPONs
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'COUPON')
      .order('created_at', { ascending: false });
      
    if (error) console.error("Error fetching coupons:", error);
    setCoupons(data || []);
    setLoading(false);
  }

  const handleOpenEdit = (coupon = null) => {
    setEditingCoupon(coupon || { 
        name: '', // Code
        price: 0, // Discount value
        stock: 100, // Uses remaining
        category: 'COUPON', 
        short_description: 'percentage', // Type
        description: 'Cupón de descuento'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
        ...editingCoupon,
        name: editingCoupon.name.toUpperCase().trim()
    };

    const isNew = !editingCoupon.id;
    const { data, error } = isNew 
        ? await supabase.from('products').insert([payload])
        : await supabase.from('products').update(payload).eq('id', editingCoupon.id);

    if (error) {
        alert('Error al guardar: ' + error.message);
    } else {
        setIsModalOpen(false);
        fetchCoupons();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
      if (!confirm('¿Estás segura de eliminar este cupón?')) return;
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert('Error: ' + error.message);
      else fetchCoupons();
  };

  const filteredCoupons = coupons.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCouponIcon = (type) => {
      if (type === 'percentage') return <Percent size={18} />;
      if (type === 'fixed') return <Banknote size={18} />;
      if (type === 'free_shipping') return <Truck size={18} />;
      return <Ticket size={18} />;
  };

  const getCouponTypeLabel = (type) => {
    if (type === 'percentage') return 'Porcentaje';
    if (type === 'fixed') return 'Monto Fijo';
    if (type === 'free_shipping') return 'Envío Gratis';
    return 'Descuento';
  };

  const getCouponValueDisplay = (coupon) => {
      if (coupon.short_description === 'percentage') return `${coupon.price}% OFF`;
      if (coupon.short_description === 'fixed') return `$${coupon.price} OFF`;
      if (coupon.short_description === 'free_shipping') return `ENVÍO BONIFICADO`;
      return `${coupon.price}`;
  };

  return (
    <div className="admin-page-centered">
      <div className="products-layout">
        {/* Header Section */}
        <div className="admin-header-card">
          <div className="header-info">
            <div className="badge-tag">
              <Ticket size={12} />
              <span>Marketing</span>
            </div>
            <h2 className="title-lg">Cupones de Descuento</h2>
            <p className="subtitle">Creá códigos promocionales para tus clientes.</p>
          </div>
          <button onClick={() => handleOpenEdit()} className="primary-btn">
            <Plus size={20} />
            <span>Crear Cupón</span>
          </button>
        </div>

        {/* Control Bar */}
        <div className="control-bar">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Layout */}
        {loading ? (
            <div className="loading-state">
                <Loader2 className="spinner" size={40} />
                <p>Cargando cupones...</p>
            </div>
        ) : (
            <div className="products-grid">
              {filteredCoupons.map((coupon) => (
                <div key={coupon.id} className="product-card">
                  
                  {/* Contenido */}
                  <div className="product-info">
                      <div className="info-header">
                          <div>
                            <span className="category-label flex items-center gap-1">
                                {getCouponIcon(coupon.short_description)} 
                                {getCouponTypeLabel(coupon.short_description)}
                            </span>
                            <h3 className="product-name" style={{ fontSize: '1.5rem', marginTop: '8px', letterSpacing: '2px', color: '#D47792' }}>
                              {coupon.name}
                            </h3>
                          </div>
                          <button onClick={() => handleDelete(coupon.id)} className="more-btn text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>

                      {/* Recuadro de Datos */}
                      <div className="data-box" style={{ marginTop: '10px' }}>
                          <div className="data-item" style={{ background: '#FFF1F2' }}>
                              <span className="label" style={{ color: '#D47792' }}>Descuento</span>
                              <span className="value" style={{ color: '#9F1239' }}>{getCouponValueDisplay(coupon)}</span>
                          </div>
                          <div className="data-item border-left">
                              <span className="label">Usos Restantes</span>
                              <span className={`value ${coupon.stock <= 0 ? 'text-red' : ''}`}>{coupon.stock}</span>
                          </div>
                      </div>

                      {/* Acciones */}
                      <div className="action-row" style={{ marginTop: 'auto' }}>
                          <button onClick={() => handleOpenEdit(coupon)} className="secondary-btn-sm" style={{ gridColumn: 'span 2' }}><Edit2 size={14} /> Editar Cupón</button>
                      </div>
                  </div>
                </div>
              ))}
            </div>
        )}

        {filteredCoupons.length === 0 && !loading && (
            <div className="empty-state">
                <Ticket size={48} />
                <h3>No hay cupones activos</h3>
                <p>Creá un código de descuento para atraer más ventas.</p>
            </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN / ALTA */}
      {isModalOpen && (
          <div className="modal-overlay">
              <div className="modal-content animate-in zoom-in duration-300">
                  <div className="modal-header">
                      <h3 className="text-xl font-black text-gray-900">{editingCoupon.id ? 'Editar Cupón' : 'Nuevo Cupón'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
                  </div>
                  
                  <form onSubmit={handleSave} className="modal-body">
                      <div className="form-grid">
                          <div className="form-group span-2">
                              <label>Código del Cupón (ej: MAMA20)</label>
                              <input 
                                type="text" 
                                value={editingCoupon.name}
                                onChange={(e) => setEditingCoupon({...editingCoupon, name: e.target.value.toUpperCase()})}
                                required
                                style={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}
                              />
                          </div>
                          <div className="form-group span-2">
                              <label>Tipo de Descuento</label>
                              <select 
                                value={editingCoupon.short_description}
                                onChange={(e) => setEditingCoupon({...editingCoupon, short_description: e.target.value, price: e.target.value === 'free_shipping' ? 0 : editingCoupon.price})}
                                required
                                className="styled-input-select"
                              >
                                  <option value="percentage">Porcentaje (%)</option>
                                  <option value="fixed">Monto Fijo ($)</option>
                                  <option value="free_shipping">Envío Gratis</option>
                              </select>
                          </div>
                          
                          {editingCoupon.short_description !== 'free_shipping' && (
                              <div className="form-group span-2">
                                  <label>{editingCoupon.short_description === 'percentage' ? 'Porcentaje de descuento (%)' : 'Monto de descuento ($)'}</label>
                                  <input 
                                    type="number" 
                                    value={editingCoupon.price}
                                    onChange={(e) => setEditingCoupon({...editingCoupon, price: parseFloat(e.target.value)})}
                                    required
                                    min="0"
                                    max={editingCoupon.short_description === 'percentage' ? "100" : undefined}
                                  />
                              </div>
                          )}

                          <div className="form-group span-2">
                              <label>Límite de usos totales (Stock del cupón)</label>
                              <input 
                                type="number" 
                                value={editingCoupon.stock}
                                onChange={(e) => setEditingCoupon({...editingCoupon, stock: parseInt(e.target.value)})}
                                required
                                min="0"
                              />
                              <small style={{ color: '#888', marginTop: '4px' }}>Una vez llegue a 0, el cupón dejará de funcionar. También validaremos que un cliente no lo use 2 veces.</small>
                          </div>
                      </div>

                      <div className="modal-footer">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="btn-link">Cancelar</button>
                          <button type="submit" disabled={saving} className="primary-btn">
                              {saving ? <Loader2 className="animate-spin" size={18} /> : (editingCoupon.id ? 'Guardar Cambios' : 'Crear Cupón')}
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

        .product-info { padding: 24px; display: flex; flex-direction: column; gap: 20px; flex: 1; }
        .info-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .category-label { font-size: 0.7rem; font-weight: 800; color: #D47792; text-transform: uppercase; letter-spacing: 1px; }
        .product-name { font-size: 1.1rem; font-weight: 900; color: #111827; margin-top: 4px; line-height: 1.3; }
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
        .text-red { color: #EF4444; }

        .action-row { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .secondary-btn-sm {
            background: #F9FAFB; color: #4B5563; border: 1px solid #F3F4F6; padding: 12px; border-radius: 14px;
            font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
            gap: 8px; cursor: pointer; transition: all 0.3s;
        }
        .secondary-btn-sm:hover { background: #111827; color: white; border-color: #111827; }

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
