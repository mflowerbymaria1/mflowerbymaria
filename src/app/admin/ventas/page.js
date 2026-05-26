"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Search, Filter, Eye, Printer, AlertCircle, Loader2, Package, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function VentasPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const printRef = useRef();

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

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => {
        window.print();
    }, 100);
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Historial de Ventas</h2>
          <p className="text-gray-500 text-sm">Controlá tus pedidos y estados de pago.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 print:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o ID de pedido..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span>Filtrar</span>
          </button>
        </div>
      </div>

      {/* Orders Grid instead of Table */}
      <div className="print:hidden">
        {loading ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <Loader2 className="animate-spin text-rose-500" size={40} />
                <p className="text-gray-400 font-medium">Cargando pedidos...</p>
            </div>
        ) : filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-[2rem] border-2 border-rose-200 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100 hover:border-rose-300 transition-all duration-300 flex flex-col mb-8">
                        {/* HEADER ROSA SÚPER CLARO */}
                        <div className="bg-rose-50 border-b border-rose-100 px-6 py-4 flex justify-between items-center text-rose-900">
                            <div className="space-y-1">
                                <span className="text-xs font-black text-rose-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-rose-200">
                                    PEDIDO #{order.id.slice(0, 8)}
                                </span>
                                <p className="text-[11px] text-rose-500/80 font-bold uppercase tracking-widest mt-2">
                                    {new Date(order.created_at).toLocaleString('es-AR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest border-2 ${
                                order.payment_status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50' : 
                                order.payment_status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/50' : 
                                'bg-red-500/10 text-red-400 border-red-500/50'
                            }`}>
                                {order.payment_status}
                            </div>
                        </div>

                        <div className="p-6 space-y-6 flex-grow bg-white">
                            <div className="py-4 border-b-2 border-rose-50 flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-2xl border border-rose-100">
                                    {(order.customer_name || 'C')[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 leading-tight">{order.customer_name || 'Desconocido'}</h3>
                                    <p className="text-2xl font-black text-rose-600 tracking-tighter mt-1">${Number(order.total_amount).toLocaleString('es-AR')}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs font-black text-rose-700 uppercase tracking-widest bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                                <div className="flex items-center">
                                    {order.shipping_status === 'pending' ? <Package size={14} className="text-amber-500 mr-1.5" /> : <CheckCircle2 size={14} className="text-emerald-500 mr-1.5" />}
                                    <span className="capitalize">{order.shipping_status}</span>
                                </div>
                                <span>{order.items?.length || 0} prod.</span>
                            </div>
                        </div>

                        <div className="bg-rose-50/30 px-6 py-5 border-t border-rose-100 flex gap-4">
                            <button 
                                onClick={() => setSelectedOrder(order)}
                                className="flex-1 bg-white border border-rose-200 text-rose-600 font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:bg-rose-50 transition-all flex items-center justify-center space-x-2"
                            >
                                <Eye size={16} /> <span>Ver Todos Los Datos</span>
                            </button>
                            <button 
                                onClick={() => handlePrint(order)}
                                className="bg-rose-600 text-white p-3 rounded-xl hover:bg-rose-700 transition-all shadow-md shadow-rose-200 border border-rose-700"
                                title="Imprimir Remito"
                            >
                                <Printer size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-sm">
                <p className="text-gray-400 font-bold">No hay ventas que coincidan con la búsqueda.</p>
            </div>
        )}
      </div>

      {/* DETALLE DEL PEDIDO - MODAL OVERLAY (Solo pantalla) */}
      {selectedOrder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Pedido #{selectedOrder.id.slice(0, 8)}</h3>
                        <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-600">
                        <AlertCircle size={24} className="rotate-45" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    {/* Cliente */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</p>
                            <p className="font-bold text-gray-800">{selectedOrder.customer_name}</p>
                            <p className="text-sm text-gray-500">{selectedOrder.customer_phone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dirección</p>
                            <p className="text-sm font-bold text-gray-800">{selectedOrder.shipping_address}</p>
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Productos</p>
                        <div className="space-y-3">
                            {selectedOrder.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-rose-500 text-sm border border-rose-100">
                                            {item.quantity}
                                        </div>
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                    </div>
                                    <p className="font-black text-gray-900">${Number(item.price || item.unit_price || 0).toLocaleString('es-AR')}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <p className="text-lg font-black text-gray-900 uppercase">Total</p>
                        <p className="text-2xl font-black text-rose-600">${Number(selectedOrder.total_amount).toLocaleString('es-AR')}</p>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <button 
                        onClick={() => handlePrint(selectedOrder)}
                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                    >
                        <Printer size={16} /> Imprimir Remito
                    </button>
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="px-8 py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-all"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
          </div>
      )}

      {/* HOJA DE RUTA - VISTA DE IMPRESIÓN (Solo impresora) */}
      {selectedOrder && (
          <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 font-sans text-gray-800">
            <div className="flex justify-between items-start border-b-2 border-gray-200 pb-6 mb-8">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-rose-600">M•flower</h1>
                    <p className="text-xs text-gray-500 font-medium">Hoja de Ruta / Remito Interno</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold">Pedido #{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{new Date(selectedOrder.created_at).toLocaleDateString('es-AR')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-10">
                <div className="bg-gray-50 p-6 rounded-2xl">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Datos del Cliente</h2>
                    <p className="text-lg font-black text-gray-800">{selectedOrder.customer_name}</p>
                    <p className="text-sm">{selectedOrder.customer_email}</p>
                    <p className="text-sm">{selectedOrder.customer_phone}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-rose-500">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Destino de Envío</h2>
                    <p className="text-sm font-bold">{selectedOrder.shipping_address}</p>
                    <p className="text-sm font-medium mt-2 text-rose-600">Método: {selectedOrder.shipping_method}</p>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Productos a Preparar</h2>
                <div className="space-y-4">
                    {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400">
                                    {item.quantity}x
                                </div>
                                <p className="text-lg font-bold text-gray-800">{item.name}</p>
                            </div>
                            <div className="w-6 h-6 border-2 border-gray-200 rounded-md"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-20 pt-10 border-t border-dashed border-gray-200 text-center text-xs text-gray-400">
                M•flower by Maria - Control de Empaquetado
            </div>
          </div>
      )}

      {/* CSS para impresión en Next.js */}
      <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            .print\:block, .print\:block * {
                visibility: visible;
            }
            .print\:block {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .print\:hidden {
                display: none !important;
            }
        }
      `}</style>
    </div>
  );
}
