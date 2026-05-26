"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Users, Send, ShoppingBag, Clock, CheckCircle2, Plus, Star, Loader2, TrendingUp, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ROSE = '#D47792';
const ROSE_LIGHT = '#FFF0F3';
const ROSE_BORDER = '#F5C6D0';
const INDIGO = '#4F46E5';
const INDIGO_LIGHT = '#EEF2FF';
const AMBER = '#D97706';
const AMBER_BG = '#FEF3C7';
const GREEN = '#059669';
const GREEN_BG = '#D1FAE5';

export default function MarketingPage() {
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderType, setReminderType] = useState('reminder_1');

  useEffect(() => { fetchCarts(); }, []);

  async function fetchCarts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('abandoned_carts').select('*').order('last_active', { ascending: false });
      if (error) console.error('Error fetching abandoned carts:', error);
      else setAbandonedCarts(data || []);
    } catch (e) {
      console.error('Table may not exist:', e);
      setAbandonedCarts([]);
    }
    setLoading(false);
  }

  const handleSendReminder = (cart) => {
    const messages = {
      reminder_1: `¡Hola! 🌸 Vi que te quedaron productos en el carrito de M•flower. ¡Todavía están esperándote! Completá tu compra antes de que se agoten. 💖`,
      reminder_2: `¡Hey! 👋 Pasaron 24hs y tus productos favoritos siguen en tu carrito. ¡No los dejes escapar! Entrá ahora y completá tu pedido. 🛒✨`
    };
    const message = messages[reminderType] || messages.reminder_1;

    if (cart.customer_phone) {
      const phone = cart.customer_phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (cart.customer_email) {
      window.location.href = `mailto:${cart.customer_email}?subject=¡Tu carrito te espera! 🌸&body=${encodeURIComponent(message)}`;
    }
  };

  const statCards = [
    { title: 'Carritos Abandonados', value: abandonedCarts.length, icon: ShoppingBag, bg: ROSE_LIGHT, color: ROSE, border: ROSE_BORDER },
    { title: 'Suscriptores', value: 0, icon: Users, bg: INDIGO_LIGHT, color: INDIGO, border: '#C7D2FE' },
    { title: 'Campañas Activas', value: 0, icon: Star, bg: AMBER_BG, color: AMBER, border: '#FDE68A' },
  ];

  const tabStyle = (active) => ({
    padding: '10px 20px', borderRadius: 12, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    background: active ? INDIGO : 'transparent', color: active ? '#fff' : '#aaa',
  });

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', borderRadius: 24, padding: '36px 40px', marginBottom: 28, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: 20, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Mail size={30} />
          </div>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Marketing & Fidelización</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Recuperá ventas y comunicate con tus clientes.</p>
          </div>
        </div>
        <button onClick={() => alert('Próximamente: Creá Newsletters y promociones personalizadas.')} style={{ background: '#fff', color: INDIGO, padding: '14px 24px', borderRadius: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, border: 'none', cursor: 'pointer', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'relative', zIndex: 2 }}>
          <Plus size={18} /> Nueva Campaña
        </button>
        <div style={{ position: 'absolute', top: -40, right: -20, width: 250, height: 250, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)' }} />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
        {statCards.map((card, i) => (
          <div key={i} style={{ background: '#fff', padding: 28, borderRadius: 20, border: `2px solid ${card.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <card.icon size={24} style={{ color: card.color }} />
            </div>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{card.title}</p>
            {loading ? (
              <div style={{ height: 36, width: 60, background: '#f5f5f5', borderRadius: 8 }} />
            ) : (
              <p style={{ fontSize: 32, fontWeight: 900, color: '#1a1a1a' }}>{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Abandoned Carts Section */}
      <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>Recuperación de Carritos</h2>
            <p style={{ fontSize: 11, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Clientes que no completaron su compra</p>
          </div>
          <div style={{ display: 'flex', background: '#f5f5f5', padding: 4, borderRadius: 14 }}>
            <button onClick={() => setReminderType('reminder_1')} style={tabStyle(reminderType === 'reminder_1')}>Recordatorio 1 (2h)</button>
            <button onClick={() => setReminderType('reminder_2')} style={tabStyle(reminderType === 'reminder_2')}>Recordatorio 2 (24h)</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Loader2 size={32} style={{ color: INDIGO, animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#aaa', marginTop: 12, fontWeight: 600 }}>Cargando datos...</p>
          </div>
        ) : abandonedCarts.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
            <thead>
              <tr>
                <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Cliente</th>
                <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Contacto</th>
                <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Productos</th>
                <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Última actividad</th>
                <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', padding: '8px 12px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {abandonedCarts.map((cart) => {
                let itemCount = 0;
                try { itemCount = (typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items)?.length || 0; } catch(e) {}
                const hoursAgo = Math.floor((new Date() - new Date(cart.last_active)) / (1000 * 60 * 60));
                return (
                  <tr key={cart.id} style={{ background: hoursAgo < 3 ? ROSE_LIGHT : '#FAFAFA' }}>
                    <td style={{ padding: '14px 12px', borderRadius: '12px 0 0 12px', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderRight: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: INDIGO_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: INDIGO, fontWeight: 900, fontSize: 16 }}>
                          {(cart.customer_email || 'C')[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{cart.customer_email || 'Sin email'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', borderRight: 'none' }}>
                      <div style={{ fontSize: 12, color: '#555' }}>
                        {cart.customer_phone ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MessageCircle size={14} style={{ color: '#25D366' }} />
                            <span>{cart.customer_phone}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#aaa' }}>Solo email</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', borderRight: 'none' }}>
                      <span style={{ fontWeight: 800, color: INDIGO, fontSize: 16 }}>{itemCount}</span>
                      <span style={{ fontSize: 12, color: '#aaa', marginLeft: 4 }}>items</span>
                    </td>
                    <td style={{ padding: '14px 12px', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', borderRight: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' }}>
                        <Clock size={14} style={{ color: hoursAgo < 3 ? ROSE : '#aaa' }} />
                        <span>Hace {hoursAgo < 1 ? 'menos de 1 hora' : `${hoursAgo}h`}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', borderRadius: '0 12px 12px 0', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', textAlign: 'center' }}>
                      <button onClick={() => handleSendReminder(cart)} style={{
                        padding: '10px 16px', background: INDIGO, color: '#fff', border: 'none', borderRadius: 12,
                        fontWeight: 800, fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                        display: 'inline-flex', alignItems: 'center', gap: 6
                      }}>
                        <Send size={14} /> Enviar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: 60, background: GREEN_BG, borderRadius: 20 }}>
            <CheckCircle2 size={48} style={{ color: GREEN, margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', marginBottom: 4 }}>¡Excelente!</h3>
            <p style={{ color: '#059669', fontWeight: 600 }}>No hay carritos abandonados. Todos tus clientes completan sus compras.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
