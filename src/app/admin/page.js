"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, AlertTriangle, Loader2, Calendar,
  ShoppingBag, CreditCard, Truck, Package, Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const shortId = (id) => id.replace(/-/g, '').slice(0, 6).toUpperCase();
const paymentLabel = (s) => s === 'approved' ? 'Aprobado' : s === 'pending' ? 'Pendiente' : 'Rechazado';
const shippingLabel = (s) => s === 'pending' ? 'Pendiente' : s === 'shipped' ? 'Enviado' : s === 'delivered' ? 'Entregado' : s;

const ROSE = '#D47792';
const ROSE_LIGHT = '#FFF0F3';
const ROSE_BORDER = '#F5C6D0';
const AMBER = '#D97706';
const AMBER_BG = '#FEF3C7';
const GREEN = '#059669';
const GREEN_BG = '#D1FAE5';

export default function DashboardPage() {
  const [stats, setStats] = useState({ monthlySales: 0, pendingOrders: 0, lowStock: 0, abandonedCarts: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: salesData } = await supabase.from('orders').select('total_amount').eq('payment_status', 'approved');
        const totalSales = salesData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

        const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('shipping_status', 'pending');
        const { count: lowStockCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock', 3);

        let abandonedCount = 0;
        try {
          const result = await supabase.from('abandoned_carts').select('*', { count: 'exact', head: true });
          abandonedCount = result.count || 0;
        } catch(e) {}

        const { data: recentSalesData } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8);

        setStats({ monthlySales: totalSales, pendingOrders: pendingCount || 0, lowStock: lowStockCount || 0, abandonedCarts: abandonedCount });
        setRecentSales(recentSalesData || []);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Ventas Totales', value: `$${stats.monthlySales.toLocaleString('es-AR')}`, icon: CreditCard, bg: GREEN_BG, color: GREEN },
    { title: 'Pedidos Pendientes', value: stats.pendingOrders, icon: ShoppingBag, bg: AMBER_BG, color: AMBER },
    { title: 'Stock Crítico', value: stats.lowStock, icon: AlertTriangle, bg: '#FEE2E2', color: '#DC2626' },
    { title: 'Carritos Activos', value: stats.abandonedCarts, icon: Package, bg: '#E0E7FF', color: '#4F46E5' },
  ];

  const badgeStyle = (bg, color) => ({
    display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color: color, textTransform: 'uppercase'
  });

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: 24, padding: '40px 44px', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>¡Hola, Maria! 👋</h2>
          <p style={{ color: '#9CA3AF', fontWeight: 500, maxWidth: 400 }}>Tenés {stats.pendingOrders} pedidos pendientes de procesar.</p>
        </div>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 300, height: 300, background: 'rgba(212,119,146,0.15)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
        {statCards.map((card, i) => (
          <div key={i} style={{ background: '#fff', padding: 28, borderRadius: 20, border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <card.icon size={24} style={{ color: card.color }} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{card.title}</p>
            {loading ? (
              <div style={{ height: 36, width: 100, background: '#f5f5f5', borderRadius: 8 }} />
            ) : (
              <p style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a' }}>{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a' }}>Últimos Pedidos</h2>
              <p style={{ fontSize: 11, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sincronizado ahora</p>
            </div>
            <Link href="/admin/ventas" style={{ padding: '10px 20px', background: ROSE_LIGHT, color: ROSE, borderRadius: 14, fontSize: 12, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ver Todo</Link>
          </div>

          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ height: 72, background: '#f8f8f8', borderRadius: 14, marginBottom: 10 }} />
            ))
          ) : recentSales.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr>
                  <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Pedido</th>
                  <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Cliente</th>
                  <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Total</th>
                  <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((order) => (
                  <tr key={order.id} style={{ background: order.payment_status === 'pending' ? ROSE_LIGHT : '#FAFAFA', borderRadius: 12 }}>
                    <td style={{ padding: '14px 12px', borderRadius: '12px 0 0 12px', border: `1px solid ${order.payment_status === 'pending' ? ROSE_BORDER : '#eee'}`, borderRight: 'none' }}>
                      <span style={{ fontWeight: 900, color: ROSE, fontSize: 14 }}>#{shortId(order.id)}</span>
                      <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>
                        {new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', border: `1px solid ${order.payment_status === 'pending' ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', borderRight: 'none' }}>
                      <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{order.customer_name || 'Cliente'}</span>
                    </td>
                    <td style={{ padding: '14px 12px', border: `1px solid ${order.payment_status === 'pending' ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', borderRight: 'none' }}>
                      <span style={{ fontWeight: 900, color: '#1a1a1a', fontSize: 16 }}>${Number(order.total_amount).toLocaleString('es-AR')}</span>
                    </td>
                    <td style={{ padding: '14px 12px', borderRadius: '0 12px 12px 0', border: `1px solid ${order.payment_status === 'pending' ? ROSE_BORDER : '#eee'}`, borderLeft: 'none' }}>
                      <span style={badgeStyle(
                        order.payment_status === 'approved' ? GREEN_BG : AMBER_BG,
                        order.payment_status === 'approved' ? GREEN : AMBER
                      )}>{paymentLabel(order.payment_status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, background: '#f9f9f9', borderRadius: 16 }}>
              <p style={{ color: '#aaa', fontWeight: 700 }}>No hay ventas registradas aún.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: `linear-gradient(135deg, ${ROSE} 0%, #C2667F 100%)`, padding: 28, borderRadius: 24, color: '#fff' }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Logística</h3>
            <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 20 }}>Tenés {stats.pendingOrders} pedidos listos para despachar.</p>
            <Link href="/admin/logistica" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', background: '#fff', color: ROSE, borderRadius: 16, fontWeight: 800, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Truck size={18} /> Ir a Despacho
            </Link>
          </div>

          <div style={{ background: '#fff', padding: 28, borderRadius: 24, border: '1px solid #eee' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a', marginBottom: 16 }}>Alertas de Stock</h3>
            {stats.lowStock > 0 ? (
              <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: 20, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#DC2626', marginBottom: 8 }}>
                  <AlertTriangle size={18} />
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{stats.lowStock} productos críticos</span>
                </div>
                <p style={{ fontSize: 12, color: '#B91C1C', lineHeight: 1.5 }}>Hay productos con menos de 3 unidades.</p>
                <Link href="/admin/productos" style={{ display: 'block', textAlign: 'center', padding: '10px 16px', background: '#fff', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 12, fontSize: 11, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', marginTop: 12 }}>Gestionar Stock</Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 32, background: GREEN_BG, borderRadius: 16 }}>
                <TrendingUp size={24} style={{ color: GREEN, margin: '0 auto 8px' }} />
                <p style={{ color: GREEN, fontWeight: 700, fontSize: 14 }}>Stock saludable</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
