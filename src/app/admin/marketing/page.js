"use client";

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Users, 
  Send, 
  MousePointer2, 
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatReminderMessage, sendWhatsAppReminder } from '@/lib/marketing';

export default function MarketingPage() {
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderType, setReminderType] = useState('reminder_1'); // 'reminder_1' o 'reminder_2'

  useEffect(() => {
    fetchCarts();
  }, []);

  async function fetchCarts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .order('last_active', { ascending: false });

    if (error) {
      console.error('Error fetching abandoned carts:', error);
    } else {
      setAbandonedCarts(data || []);
    }
    setLoading(false);
  }

  const handleSendReminder = (cart) => {
      const message = formatReminderMessage(reminderType, cart.id, cart.customer_email);
      if (cart.customer_phone) {
        sendWhatsAppReminder(cart.customer_phone, message);
      } else {
        const mailto = `mailto:${cart.customer_email}?subject=¡Tu carrito te espera! 🌸&body=${encodeURIComponent(message)}`;
        window.location.href = mailto;
      }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-1000">
      
      {/* Header Marketing */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-6">
          <div className="p-5 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-200">
            <Mail size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Marketing & Fidelización</h2>
            <p className="text-gray-400 font-medium">Recuperá ventas y comunicate con tus clientes.</p>
          </div>
        </div>
        
        <button 
            onClick={() => alert('Función de Nueva Campaña: Próximamente podrás crear Newsletters aquí.')}
            className="flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 hover:shadow-indigo-100"
        >
            <Plus size={18} />
            <span>Nueva Campaña</span>
        </button>
      </div>

      {/* Stats Marketing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag size={24} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carritos Abandonados</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{abandonedCarts.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Users size={24} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suscriptores</p>
              <p className="text-3xl font-black text-gray-900 mt-1">0</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <Star size={24} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campañas Activas</p>
              <p className="text-3xl font-black text-gray-900 mt-1">0</p>
          </div>
      </div>

      {/* Recuperación de Carritos */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recuperación de Carritos</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Clientes que no completaron su compra</p>
            </div>
            
            <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button 
                    onClick={() => setReminderType('reminder_1')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reminderType === 'reminder_1' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400'}`}
                >
                    Recordatorio 1 (2h)
                </button>
                <button 
                    onClick={() => setReminderType('reminder_2')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reminderType === 'reminder_2' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400'}`}
                >
                    Recordatorio 2 (24h)
                </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {loading ? (
                Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl"></div>
                ))
            ) : abandonedCarts.length > 0 ? abandonedCarts.map((cart) => (
              <div key={cart.id} className="group flex items-center justify-between p-6 bg-gray-50 hover:bg-indigo-50/50 rounded-[1.5rem] transition-all duration-300 border border-transparent hover:border-indigo-100">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm">
                    {(cart.customer_email || 'C')[0].toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-gray-900 leading-none">{cart.customer_email}</p>
                    <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <Clock size={12} className="mr-1" />
                        Hace {Math.floor((new Date() - new Date(cart.last_active)) / (1000 * 60 * 60))} horas
                        <span className="mx-2">•</span>
                        <span className="text-indigo-400">{JSON.parse(JSON.stringify(cart.items)).length} productos</span>
                    </div>
                  </div>
                </div>
                <button 
                    onClick={() => handleSendReminder(cart)}
                    className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                    <Send size={16} />
                    <span>Enviar Recordatorio</span>
                </button>
              </div>
            )) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <CheckCircle2 className="mx-auto text-emerald-200 mb-4" size={48} />
                  <p className="text-gray-400 font-bold italic">No hay carritos abandonados. ¡Excelente!</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
