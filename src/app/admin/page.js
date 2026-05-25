"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar,
  ShoppingBag,
  CreditCard,
  Truck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, loading }) => {
    const colorVariants = {
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        red: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl border ${colorVariants[color] || colorVariants.rose} transition-all duration-300 group-hover:scale-110`}>
                    <Icon size={28} />
                </div>
                {trend && !loading && (
                    <div className={`flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.1em]">{title}</h3>
                <div className="flex items-baseline space-x-2">
                    {loading ? (
                        <div className="h-10 w-32 bg-gray-50 animate-pulse rounded-lg"></div>
                    ) : (
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    monthlySales: 0,
    pendingOrders: 0,
    lowStock: 0,
    abandonedCarts: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // 1. Monthly Sales
        const { data: salesData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'approved');
        
        const totalSales = salesData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

        // 2. Pending Orders
        const { count: pendingCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('shipping_status', 'pending');

        // 3. Low Stock (Threshold < 3)
        const { count: lowStockCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .lt('stock', 3);

        // 4. Abandoned Carts
        const { count: abandonedCount } = await supabase
          .from('abandoned_carts')
          .select('*', { count: 'exact', head: true });

        // 5. Recent Sales
        const { data: recentSalesData } = await supabase
          .from('orders')
          .select('*, customers(full_name)')
          .order('created_at', { ascending: false })
          .limit(6);

        setStats({
          monthlySales: totalSales,
          pendingOrders: pendingCount || 0,
          lowStock: lowStockCount || 0,
          abandonedCarts: abandonedCount || 0
        });
        setRecentSales(recentSalesData || []);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gray-900 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-gray-200">
          <div className="relative z-10 space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tighter">¡Hola, Maria! 👋</h2>
              <p className="text-gray-400 font-medium max-w-md">Tenés {stats.pendingOrders} pedidos pendientes de procesar en la tienda.</p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-rose-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] right-[10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas Totales" 
          value={`$${stats.monthlySales.toLocaleString('es-AR')}`} 
          icon={CreditCard} 
          color="emerald" 
          loading={loading}
        />
        <StatCard 
          title="Pedidos Pendientes" 
          value={stats.pendingOrders.toString()} 
          icon={ShoppingBag} 
          color="amber" 
          loading={loading}
        />
        <StatCard 
          title="Stock Crítico" 
          value={stats.lowStock.toString()} 
          icon={AlertTriangle} 
          color="red" 
          loading={loading}
        />
        <StatCard 
          title="Carritos Activos" 
          value={stats.abandonedCarts.toString()} 
          icon={Users} 
          color="indigo" 
          loading={loading}
        />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Sales - Larger Column */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Últimos Pedidos</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sincronizado ahora</p>
            </div>
            <Link href="/admin/ventas" className="px-6 py-3 bg-gray-50 hover:bg-rose-50 text-rose-600 text-xs font-black rounded-2xl transition-all uppercase tracking-widest">Ver Todo</Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
                Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl"></div>
                ))
            ) : recentSales.length > 0 ? recentSales.map((order) => (
              <div key={order.id} className="group flex items-center justify-between p-6 hover:bg-rose-50/30 rounded-[1.5rem] transition-all duration-300 border border-transparent hover:border-rose-100">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-rose-600 font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                    {(order.customers?.full_name || 'C')[0]}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-gray-900 leading-none">{order.customers?.full_name || 'Cliente'}</p>
                    <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <Calendar size={12} className="mr-1" />
                        {new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                        <span className="mx-2">•</span>
                        <span className="text-rose-400">ID #{order.id.slice(0, 5)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xl font-black text-gray-900 tracking-tighter">${Number(order.total_amount).toLocaleString('es-AR')}</p>
                  <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    order.payment_status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {order.payment_status}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold italic">No hay ventas registradas aún.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Center - Sidebar Style */}
        <div className="space-y-8">
            <div className="bg-rose-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-rose-200 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight">Logística</h3>
                    <p className="text-rose-200 text-xs font-medium">Tenés {stats.pendingOrders} pedidos listos para despachar vía Envía.com.</p>
                </div>
                <Link href="/admin/logistica" className="w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2">
                    <Truck size={18} />
                    <span>Ir a Despacho</span>
                </Link>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Alertas de Stock</h3>
                {stats.lowStock > 0 ? (
                    <div className="space-y-4">
                        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl space-y-3">
                            <div className="flex items-center space-x-3 text-red-600">
                                <AlertTriangle size={20} />
                                <span className="text-sm font-black">{stats.lowStock} productos críticos</span>
                            </div>
                            <p className="text-xs text-red-500/80 font-medium leading-relaxed">Hay productos con menos de 3 unidades en inventario.</p>
                            <Link href="/admin/productos" className="block text-center w-full py-3 bg-white text-red-600 border border-red-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Gestionar Stock</Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp size={20} />
                         </div>
                         <p className="text-emerald-700 font-bold text-sm">Stock saludable</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
