"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Search, Eye, Printer, Loader2, Package, CheckCircle2, X, MapPin, CreditCard, Truck, Phone, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const shortId = (id) => id.replace(/-/g, '').slice(0, 6).toUpperCase();
const paymentLabel = (s) => s === 'approved' ? 'Aprobado' : s === 'pending' ? 'Pendiente' : 'Rechazado';
const shippingLabel = (s) => s === 'pending' ? 'Pendiente' : s === 'shipped' ? 'Enviado' : s === 'delivered' ? 'Entregado' : s;
const methodLabel = (m) => m === 'retiro' ? 'Retiro en sucursal' : m === 'envio' ? 'Envío a domicilio' : m || 'No especificado';

export default function VentasPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setLoading(false);
  }

  async function handleUpdatePaymentStatus(id, newStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('id', id);
    if (error) {
      alert('Error al actualizar el estado de pago: ' + error.message);
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status: newStatus } : o));
      setSelectedOrder(prev => prev && prev.id === id ? { ...prev, payment_status: newStatus } : prev);
    }
  }

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => window.print(), 100);
  };

  const filteredOrders = orders.filter(order =>
    shortId(order.id).includes(searchTerm.toUpperCase()) ||
    (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ROSE = '#D47792';
  const ROSE_LIGHT = '#FFF0F3';
  const ROSE_BORDER = '#F5C6D0';
  const AMBER = '#D97706';
  const AMBER_BG = '#FEF3C7';
  const GREEN = '#059669';
  const GREEN_BG = '#D1FAE5';
  const RED = '#DC2626';
  const RED_BG = '#FEE2E2';

  const badgeStyle = (bg, color) => ({
    display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color: color, textTransform: 'uppercase', letterSpacing: '0.05em'
  });

  const thBase = { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', background: ROSE };

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif' }} className="print:hidden">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', marginBottom: 4 }}>Gestión de Ventas</h2>
        <p style={{ fontSize: 13, color: '#888' }}>Todos los pedidos de tu tienda, organizados y claros.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input
            type="text"
            placeholder="Buscar por nombre o N° de pedido..."
            style={{ width: '100%', padding: '12px 16px 12px 40px', border: `2px solid ${ROSE_BORDER}`, borderRadius: 12, fontSize: 14, outline: 'none', background: '#fff' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Loader2 size={40} style={{ color: ROSE, animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#aaa', marginTop: 16, fontWeight: 600 }}>Cargando pedidos...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
            <thead>
              <tr>
                <th style={{ ...thBase, borderRadius: '12px 0 0 12px' }}>N° Pedido</th>
                <th style={thBase}>Cliente</th>
                <th style={thBase}>Total</th>
                <th style={thBase}>Pago</th>
                <th style={thBase}>Envío</th>
                <th style={thBase}>Método</th>
                <th style={thBase}>Fecha</th>
                <th style={{ ...thBase, borderRadius: '0 12px 12px 0', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isPending = order.payment_status === 'pending';
                const rowBg = isPending ? ROSE_LIGHT : '#fff';
                const rowBorder = isPending ? ROSE_BORDER : '#eee';
                const tdBase = { padding: '16px', fontSize: 14, background: rowBg, borderTop: `2px solid ${rowBorder}`, borderBottom: `2px solid ${rowBorder}` };
                return (
                  <tr key={order.id}>
                    <td style={{ ...tdBase, borderLeft: `2px solid ${rowBorder}`, borderRadius: '12px 0 0 12px' }}>
                      <span style={{ fontWeight: 900, color: ROSE, fontSize: 16 }}>#{shortId(order.id)}</span>
                    </td>
                    <td style={tdBase}>
                      <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{order.customer_name || 'Desconocido'}</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{order.customer_phone || ''}</div>
                    </td>
                    <td style={tdBase}>
                      <span style={{ fontWeight: 900, color: '#1a1a1a', fontSize: 18 }}>${Number(order.total_amount).toLocaleString('es-AR')}</span>
                    </td>
                    <td style={tdBase}>
                      <span style={badgeStyle(
                        order.payment_status === 'approved' ? GREEN_BG : order.payment_status === 'pending' ? AMBER_BG : RED_BG,
                        order.payment_status === 'approved' ? GREEN : order.payment_status === 'pending' ? AMBER : RED
                      )}>{paymentLabel(order.payment_status)}</span>
                    </td>
                    <td style={tdBase}>
                      <span style={badgeStyle(
                        order.shipping_status === 'pending' ? AMBER_BG : GREEN_BG,
                        order.shipping_status === 'pending' ? AMBER : GREEN
                      )}>{shippingLabel(order.shipping_status)}</span>
                    </td>
                    <td style={tdBase}>
                      <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>{methodLabel(order.shipping_method)}</span>
                    </td>
                    <td style={tdBase}>
                      <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>{new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      <div style={{ fontSize: 11, color: '#aaa' }}>{new Date(order.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td style={{ ...tdBase, borderRight: `2px solid ${rowBorder}`, borderRadius: '0 12px 12px 0', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                        {order.payment_status === 'pending' && (
                          <button
                            style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', cursor: 'pointer', padding: '6px 10px', borderRadius: 8, color: '#2E7D32', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}
                            onClick={() => handleUpdatePaymentStatus(order.id, 'approved')}
                            title="Confirmar Pago (Marcar como Pagado)"
                          >
                            <CheckCircle2 size={14} /> Pagado
                          </button>
                        )}
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, color: ROSE }} onClick={() => setSelectedOrder(order)} title="Ver detalle">
                          <Eye size={20} />
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, color: '#555' }} onClick={() => handlePrint(order)} title="Imprimir">
                          <Printer size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 60, background: '#f9f9f9', borderRadius: 16, border: '2px dashed #ddd' }}>
          <p style={{ color: '#aaa', fontWeight: 700 }}>No hay ventas que coincidan.</p>
        </div>
      )}

      {/* MODAL DETALLE */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} className="print:hidden">
          <div style={{ background: '#fff', borderRadius: 24, maxWidth: 640, width: '100%', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ background: ROSE, color: '#fff', padding: '24px 32px', borderRadius: '24px 24px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Pedido #{shortId(selectedOrder.id)}</h3>
                <p style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{new Date(selectedOrder.created_at).toLocaleString('es-AR')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer', color: '#fff' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
                <div style={{ background: ROSE_LIGHT, padding: 20, borderRadius: 16, borderLeft: `4px solid ${ROSE}` }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: ROSE, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Cliente</p>
                  <p style={{ fontWeight: 800, fontSize: 16, color: '#1a1a1a' }}>{selectedOrder.customer_name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 13, color: '#666' }}>
                    <Phone size={14} /> {selectedOrder.customer_phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 13, color: '#666' }}>
                    <Mail size={14} /> {selectedOrder.customer_email}
                  </div>
                </div>
                <div style={{ background: '#F0FDF4', padding: 20, borderRadius: 16, borderLeft: '4px solid #22C55E' }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Envío</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>
                    <MapPin size={16} /> {selectedOrder.shipping_address || 'Retiro en sucursal'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, color: '#666' }}>
                    <Truck size={14} /> {methodLabel(selectedOrder.shipping_method)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ ...badgeStyle(selectedOrder.payment_status === 'approved' ? GREEN_BG : AMBER_BG, selectedOrder.payment_status === 'approved' ? GREEN : AMBER), padding: '8px 16px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <CreditCard size={14} /> Pago: {paymentLabel(selectedOrder.payment_status)}
                </span>
                {selectedOrder.payment_status === 'pending' && (
                  <button
                    onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'approved')}
                    style={{
                      background: '#22C55E', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s'
                    }}
                  >
                    <CheckCircle2 size={14} /> Confirmar Pago
                  </button>
                )}
                <span style={{ ...badgeStyle(selectedOrder.shipping_status === 'pending' ? AMBER_BG : GREEN_BG, selectedOrder.shipping_status === 'pending' ? AMBER : GREEN), padding: '8px 16px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Package size={14} /> Envío: {shippingLabel(selectedOrder.shipping_status)}
                </span>
              </div>

              <p style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Productos</p>
              <div style={{ marginBottom: 20 }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: idx % 2 === 0 ? '#FAFAFA' : '#fff', borderRadius: 12, marginBottom: 6, border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ background: ROSE_LIGHT, color: ROSE, fontWeight: 900, width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, border: `1px solid ${ROSE_BORDER}` }}>{item.quantity}</span>
                      <span style={{ fontWeight: 700, color: '#333' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 900, color: '#1a1a1a' }}>${Number(item.price || item.unit_price || 0).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: ROSE_LIGHT, borderRadius: 16, border: `2px solid ${ROSE_BORDER}` }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase' }}>Total</span>
                <span style={{ fontSize: 28, fontWeight: 900, color: ROSE }}>$ {Number(selectedOrder.total_amount).toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div style={{ padding: '20px 32px', borderTop: '1px solid #eee', display: 'flex', gap: 12 }}>
              <button onClick={() => handlePrint(selectedOrder)} style={{ flex: 1, padding: '14px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textTransform: 'uppercase' }}>
                <Printer size={16} /> Imprimir Remito
              </button>
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '14px 24px', background: '#f5f5f5', color: '#888', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 13, cursor: 'pointer', textTransform: 'uppercase' }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT VIEW */}
      {selectedOrder && (
        <div className="hidden print:block" style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 9999, padding: 40, fontFamily: 'Arial, sans-serif', color: '#333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ddd', paddingBottom: 24, marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: ROSE }}>M•flower</h1>
              <p style={{ fontSize: 12, color: '#888' }}>Hoja de Ruta / Remito</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 18, fontWeight: 700 }}>Pedido #{shortId(selectedOrder.id)}</p>
              <p style={{ fontSize: 13, color: '#888' }}>{new Date(selectedOrder.created_at).toLocaleDateString('es-AR')}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 12 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', marginBottom: 10 }}>Cliente</h2>
              <p style={{ fontSize: 16, fontWeight: 900 }}>{selectedOrder.customer_name}</p>
              <p style={{ fontSize: 13 }}>{selectedOrder.customer_email}</p>
              <p style={{ fontSize: 13 }}>{selectedOrder.customer_phone}</p>
            </div>
            <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 12, borderLeft: `4px solid ${ROSE}` }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', marginBottom: 10 }}>Envío</h2>
              <p style={{ fontSize: 14, fontWeight: 700 }}>{selectedOrder.shipping_address}</p>
              <p style={{ fontSize: 13, color: ROSE, marginTop: 8 }}>Método: {methodLabel(selectedOrder.shipping_method)}</p>
            </div>
          </div>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>Productos</h2>
          {selectedOrder.items?.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 32, height: 32, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#888' }}>{item.quantity}x</span>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{item.name}</span>
              </div>
              <div style={{ width: 24, height: 24, border: '2px solid #ddd', borderRadius: 4 }}></div>
            </div>
          ))}
          <div style={{ marginTop: 80, paddingTop: 32, borderTop: '1px dashed #ccc', textAlign: 'center', fontSize: 12, color: '#aaa' }}>
            M•flower by Maria - Control de Empaquetado
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
