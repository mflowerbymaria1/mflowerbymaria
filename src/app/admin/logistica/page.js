"use client";

import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Navigation, CheckCircle2, AlertCircle, Loader2, Printer } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const shortId = (id) => id.replace(/-/g, '').slice(0, 6).toUpperCase();
const shippingLabel = (s) => s === 'pending' ? 'Pendiente' : s === 'shipped' ? 'Enviado' : s === 'delivered' ? 'Entregado' : s === 'ready_to_pack' ? 'Listo para empaquetar' : s;
const methodLabel = (m) => m === 'retiro' ? 'Retiro en sucursal' : m === 'envio' ? 'Envío a domicilio' : m || 'No especificado';

const ROSE = '#D47792';
const ROSE_LIGHT = '#FFF0F3';
const ROSE_BORDER = '#F5C6D0';
const AMBER = '#D97706';
const AMBER_BG = '#FEF3C7';
const GREEN = '#059669';
const GREEN_BG = '#D1FAE5';

export default function LogisticaPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLabel, setLoadingLabel] = useState(null);
  const [activeTab, setActiveTab] = useState('pendientes');

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setLoading(false);
  }

  async function handleUpdateStatus(orderId, newStatus) {
    const { error } = await supabase.from('orders').update({ shipping_status: newStatus }).eq('id', orderId);
    if (error) alert('Error al actualizar estado: ' + error.message);
    else fetchOrders();
  }

  async function handleGenerateLabel(order) {
    setLoadingLabel(order.id);
    try {
      const response = await fetch('/api/shipping/label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      
      if (result.success) {
        const trackingNum = result.label.trackingNumber || result.label.tracking_number || '';
        const labelUrl = result.label.labelUrl || result.label.label_url || '';
        
        await supabase
          .from('orders')
          .update({ 
            shipping_status: 'ready_to_pack',
            tracking_number: trackingNum,
            shipping_label_url: labelUrl
          })
          .eq('id', order.id);
        
        if (labelUrl) {
          window.open(labelUrl, '_blank');
        } else {
          alert('Etiqueta generada con éxito, pero no se encontró la URL de descarga.');
        }
        fetchOrders();
      } else {
        alert('Error al generar etiqueta: ' + (result.error || 'No especificado. Verificá los campos de dirección.'));
      }
    } catch (err) {
      alert('Error de conexión al generar etiqueta: ' + err.message);
    } finally {
      setLoadingLabel(null);
    }
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pendientes') return order.shipping_status === 'pending' || order.shipping_status === 'ready_to_pack';
    return order.shipping_status === 'shipped' || order.shipping_status === 'delivered';
  });

  const tabStyle = (active) => ({
    padding: '10px 24px', borderRadius: 12, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    background: active ? ROSE : '#f5f5f5',
    color: active ? '#fff' : '#888',
  });

  const badgeStyle = (bg, color) => ({
    display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color: color, textTransform: 'uppercase'
  });

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '32px 36px', borderRadius: 24, border: '1px solid #eee', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: ROSE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(212,119,146,0.3)' }}>
            <Truck size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>Centro de Despacho</h2>
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Gestioná tus envíos y estados de logística.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, background: '#f5f5f5', padding: 4, borderRadius: 16 }}>
          <button onClick={() => setActiveTab('pendientes')} style={tabStyle(activeTab === 'pendientes')}>Pendientes</button>
          <button onClick={() => setActiveTab('despachados')} style={tabStyle(activeTab === 'despachados')}>Historial</button>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Loader2 size={40} style={{ color: ROSE, animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#aaa', marginTop: 16, fontWeight: 600 }}>Cargando pedidos...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredOrders.map((order) => {
            const isPending = order.shipping_status === 'pending';
            return (
              <div key={order.id} style={{
                background: '#fff', borderRadius: 20, border: `2px solid ${isPending ? ROSE_BORDER : '#e5e5e5'}`,
                overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s'
              }}>
                {/* Card Header */}
                <div style={{
                  background: isPending ? ROSE_LIGHT : '#FAFAFA',
                  borderBottom: `2px solid ${isPending ? ROSE_BORDER : '#eee'}`,
                  padding: '16px 24px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: isPending ? ROSE : GREEN,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 900, fontSize: 18
                    }}>
                      {(order.customer_name || 'C')[0]}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>{order.customer_name}</h3>
                      <span style={{ fontSize: 12, color: ROSE, fontWeight: 800 }}>PEDIDO #{shortId(order.id)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={badgeStyle(
                      order.payment_status === 'approved' ? GREEN_BG : AMBER_BG,
                      order.payment_status === 'approved' ? GREEN : AMBER
                    )}>
                      Pago: {order.payment_status === 'approved' ? 'Aprobado' : 'Pendiente'}
                    </span>
                    <span style={badgeStyle(
                      isPending ? AMBER_BG : GREEN_BG,
                      isPending ? AMBER : GREEN
                    )}>
                      {shippingLabel(order.shipping_status)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 14, border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <MapPin size={14} style={{ color: '#aaa' }} />
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dirección</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#333', margin: 0 }}>{order.shipping_address || 'Retiro en sucursal'}</p>
                    </div>
                    <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 14, border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Navigation size={14} style={{ color: '#aaa' }} />
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Método</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#333', margin: 0 }}>{methodLabel(order.shipping_method)}</p>
                    </div>
                    <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 14, border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Package size={14} style={{ color: '#aaa' }} />
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Productos</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#333', margin: 0 }}>{order.items?.length || 0} producto(s)</p>
                      <p style={{ fontSize: 16, fontWeight: 900, color: ROSE, margin: '4px 0 0' }}>${Number(order.total_amount).toLocaleString('es-AR')}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid #eee' }}>
                    {order.shipping_method === 'envio' && order.shipping_status === 'pending' && (
                      <button
                        onClick={() => handleGenerateLabel(order)}
                        disabled={loadingLabel === order.id}
                        style={{
                          padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 12,
                          fontWeight: 800, fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                          display: 'flex', alignItems: 'center', gap: 6,
                          opacity: loadingLabel === order.id ? 0.7 : 1
                        }}
                      >
                        {loadingLabel === order.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Printer size={16} />}
                        Generar Etiqueta
                      </button>
                    )}

                    {order.shipping_status === 'ready_to_pack' && order.shipping_label_url && (
                      <a
                        href={order.shipping_label_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '10px 20px', background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', borderRadius: 12,
                          fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em',
                          display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none'
                        }}
                      >
                        <Printer size={16} /> Ver Etiqueta
                      </a>
                    )}

                    {(order.shipping_status === 'pending' || order.shipping_status === 'ready_to_pack') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'shipped')}
                        style={{
                          padding: '10px 20px', background: ROSE, color: '#fff', border: 'none', borderRadius: 12,
                          fontWeight: 800, fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                          display: 'flex', alignItems: 'center', gap: 6,
                          boxShadow: '0 4px 12px rgba(212,119,146,0.3)'
                        }}
                      >
                        <CheckCircle2 size={16} /> Marcar como Enviado
                      </button>
                    )}
                    {order.shipping_status === 'shipped' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        style={{
                          padding: '10px 20px', background: GREEN, color: '#fff', border: 'none', borderRadius: 12,
                          fontWeight: 800, fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                          display: 'flex', alignItems: 'center', gap: 6
                        }}
                      >
                        <CheckCircle2 size={16} /> Marcar como Entregado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 24, border: '2px dashed #ddd' }}>
          <Truck size={48} style={{ color: '#ddd', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', marginBottom: 8 }}>No hay envíos {activeTab}</h3>
          <p style={{ color: '#aaa' }}>¡Buen trabajo! Todo está bajo control.</p>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
