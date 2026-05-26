"use client";

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Search, 
  Package, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Printer,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LogisticaPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLabel, setLoadingLabel] = useState(null);
  const [activeTab, setActiveTab] = useState('pendientes'); // pendientes, despachados

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
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
            // Update Supabase status
            await supabase
                .from('orders')
                .update({ 
                    shipping_status: 'ready_to_pack',
                    tracking_number: result.label.tracking_number
                })
                .eq('id', order.id);
            
            window.open(result.label.label_url, '_blank');
            fetchOrders();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (err) {
        alert('Error de conexión');
    } finally {
        setLoadingLabel(null);
    }
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pendientes') return order.shipping_status === 'pending' || order.shipping_status === 'ready_to_pack';
    return order.shipping_status === 'shipped' || order.shipping_status === 'delivered';
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-1000">
      
      {/* Header Logística */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-6">
          <div className="p-5 bg-rose-600 text-white rounded-3xl shadow-xl shadow-rose-200">
            <Truck size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Centro de Despacho</h2>
            <p className="text-gray-400 font-medium">Gestioná tus envíos y generá etiquetas de Correo Argentino.</p>
          </div>
        </div>
        
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button 
                onClick={() => setActiveTab('pendientes')}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pendientes' ? 'bg-white text-rose-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Pendientes
            </button>
            <button 
                onClick={() => setActiveTab('despachados')}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'despachados' ? 'bg-white text-rose-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Historial
            </button>
        </div>
      </div>

      {/* Grid de Pedidos a Despachar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
            Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-gray-100"></div>
            ))
        ) : filteredOrders.length > 0 ? filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-500 group">
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-xl">
                                {(order.customer_name || 'C')[0]}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 leading-none">{order.customer_name}</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Pedido #{order.id.slice(0,8)}</p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            order.payment_status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                            Pago: {order.payment_status}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-5 rounded-3xl space-y-2 border border-gray-100/50">
                            <div className="flex items-center text-gray-400 space-x-2">
                                <MapPin size={14} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Destino</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 leading-tight">
                                {order.shipping_address}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-3xl space-y-2 border border-gray-100/50">
                            <div className="flex items-center text-gray-400 space-x-2">
                                <Navigation size={14} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Método</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 leading-tight">
                                {order.shipping_method || 'Envío Personalizado'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center space-x-2">
                            <Package size={18} className="text-gray-300" />
                            <span className="text-sm font-bold text-gray-500">Costo de Envío: ${order.shipping_cost || 0}</span>
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                className="p-3 bg-gray-50 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                onClick={() => alert(`Detalles del pedido: ${JSON.stringify(order.shipping_address)}`)}
                            >
                                <AlertCircle size={20} />
                            </button>
                            <button 
                                onClick={() => handleGenerateLabel(order)}
                                disabled={loadingLabel === order.id}
                                className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-gray-200 hover:shadow-rose-100 disabled:opacity-50"
                            >
                                {loadingLabel === order.id ? <Loader2 className="animate-spin" size={16} /> : <Printer size={16} />}
                                <span>{loadingLabel === order.id ? 'Generando...' : 'Generar Etiqueta'}</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Status Bar */}
                <div className="bg-gray-50 px-8 py-3 flex items-center justify-between border-t border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado Logístico</span>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${order.shipping_status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                        <span className="text-xs font-bold text-gray-700 capitalize">{order.shipping_status}</span>
                    </div>
                </div>
            </div>
        )) : (
            <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <Truck className="mx-auto text-gray-100 mb-6" size={64} />
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">No hay envíos {activeTab}</h3>
                <p className="text-gray-400 font-medium">¡Buen trabajo! Todo está bajo control.</p>
            </div>
        )}
      </div>

      {/* Card Informativa de Logística */}
      <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
            <h3 className="text-2xl font-black text-rose-900 tracking-tighter">Gestión de Envíos con Envía.com</h3>
            <p className="text-rose-700/70 font-medium max-w-xl">
              Tu tienda está integrada con la plataforma <strong>Envía.com</strong>, la cual gestiona toda la logística de <strong>Correo Argentino</strong>. 
              Las etiquetas generadas se descuentan de tu saldo en Envía y el seguimiento se sincroniza automáticamente.
            </p>
        </div>
        <div className="flex space-x-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100/50 text-center space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado de API</p>
                <p className="text-2xl font-black text-emerald-600">Conectado</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100/50 text-center space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Servicio</p>
                <p className="text-2xl font-black text-rose-600">C. Argentino</p>
            </div>
        </div>
      </div>
    </div>
  );
}
