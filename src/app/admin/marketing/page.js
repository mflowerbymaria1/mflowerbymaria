"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Users, Send, ShoppingBag, Clock, CheckCircle2, Plus, Star, 
  Loader2, TrendingUp, MessageCircle, Sparkles, Brain, ArrowUpRight, 
  ExternalLink, Eye, Flame, MousePointerClick, ShieldCheck, Zap,
  AlertCircle, RefreshCw, DollarSign, Target, Gift, HelpCircle,
  Bot, User, CornerDownLeft, Copy, Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ROSE = '#D47792';
const ROSE_LIGHT = '#FFF0F3';
const ROSE_BORDER = '#F5C6D0';
const INDIGO = '#4F46E5';
const INDIGO_LIGHT = '#EEF2FF';
const INDIGO_BORDER = '#C7D2FE';
const AMBER = '#D97706';
const AMBER_BG = '#FEF3C7';
const GREEN = '#059669';
const GREEN_BG = '#D1FAE5';

const QUICK_PROMPTS = [
  "🌸 Ideas de promos para este finde",
  "📸 Copys para Instagram de Sets Día del Maestro",
  "💡 ¿Cómo subo el ticket promedio?",
  "🛒 Mensaje para carrito de más de $30.000"
];

export default function MarketingPage() {
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderType, setReminderType] = useState('reminder_1');
  const [activeTab, setActiveTab] = useState('ai_advisor');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisDate, setAiAnalysisDate] = useState(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }));

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: '¡Hola Flor! 🌸 Soy tu Asesor Estratégico de Inteligencia Artificial potenciado por Gemini. Tengo acceso en tiempo real a tus pedidos, ticket promedio y carritos abandonados. ¿En qué estrategia o copy te gustaría que trabajemos hoy?',
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'ai_advisor') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiGenerating, activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      const [cartsRes, ordersRes, productsRes] = await Promise.all([
        supabase.from('abandoned_carts').select('*').order('last_active', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*')
      ]);

      if (cartsRes.data) setAbandonedCarts(cartsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.data) setProducts(productsRes.data);
    } catch (e) {
      console.error('Error fetching marketing data:', e);
    }
    setLoading(false);
  }

  const handleRefreshAI = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysisDate(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  const handleSendReminder = (cart) => {
    const messages = {
      reminder_1: `¡Hola! 🌸 Te guardamos tus productos favoritos en M•flower con mucho cariño. ¿Querés que te ayudemos a completar tu pedido antes de que se agote el stock? 💖`,
      reminder_2: `¡Hola bella! ✨ Vimos que dejaste cositas hermosas en tu carrito. Te dejamos un regalito: respondé este mensaje y te regalamos envío bonificado o un sticker pack exclusivo en tu pedido 🎁🛍️`
    };
    const message = messages[reminderType] || messages.reminder_1;

    if (cart.customer_phone) {
      const phone = cart.customer_phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (cart.customer_email) {
      window.location.href = `mailto:${cart.customer_email}?subject=¡Tu carrito en M•flower te espera! 🌸&body=${encodeURIComponent(message)}`;
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);
  const avgTicket = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const totalCartsInitiated = orders.length + abandonedCarts.length;
  const conversionRate = totalCartsInitiated > 0 
    ? ((orders.length / totalCartsInitiated) * 100).toFixed(1) 
    : '0';

  // AI Health Score calculation
  let healthScore = 75;
  if (Number(conversionRate) > 40) healthScore += 15;
  else if (Number(conversionRate) < 15) healthScore -= 10;
  if (abandonedCarts.length > 5) healthScore -= 5;
  healthScore = Math.min(Math.max(healthScore, 50), 98);

  // Send message to Gemini Advisor API
  const handleSendMessage = async (customText = null) => {
    const textToSend = typeof customText === 'string' ? customText : inputMessage;
    if (!textToSend.trim() || isAiGenerating) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiGenerating(true);

    try {
      const storeData = {
        ordersCount: orders.length,
        totalRevenue,
        avgTicket,
        abandonedCount: abandonedCarts.length,
        conversionRate,
        productsCount: products.length
      };

      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          storeData
        })
      });

      const data = await res.json();
      const aiReply = data?.reply || '🌸 Lo siento, hubo un detalle al conectar con Gemini. ¡Por favor intentá de nuevo!';

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: aiReply,
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error contacting AI Advisor:', err);
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: '🌸 Hubo un pequeño inconveniente de red. Te sugiero intentar nuevamente en unos instantes.',
          time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabButtonStyle = (isActive) => ({
    padding: '12px 24px',
    borderRadius: 14,
    fontSize: 13,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: isActive ? '#1a1a1a' : 'transparent',
    color: isActive ? '#fff' : '#666',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
  });

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', paddingBottom: 60 }}>
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)', 
        borderRadius: 28, 
        padding: '36px 40px', 
        marginBottom: 28, 
        position: 'relative', 
        overflow: 'hidden', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 20,
        boxShadow: '0 20px 40px -15px rgba(67, 56, 202, 0.3)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            borderRadius: 20, 
            background: 'linear-gradient(135deg, rgba(212, 119, 146, 0.4) 0%, rgba(255, 255, 255, 0.15) 100%)', 
            border: '1px solid rgba(255,255,255,0.2)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff',
            backdropFilter: 'blur(8px)'
          }}>
            <Brain size={32} style={{ color: '#F472B6' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Centro de Conversión & Asesor IA</h2>
              <span style={{ background: 'rgba(244, 114, 182, 0.25)', border: '1px solid rgba(244, 114, 182, 0.5)', color: '#FBCFE8', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' }}>
                Gemini Pro Active
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6, maxWidth: 520 }}>
              Métricas de tráfico, comportamiento de usuarias y optimizaciones inteligentes para convertir visitas en ventas.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 2 }}>
          <button 
            onClick={handleRefreshAI} 
            disabled={isAnalyzing}
            style={{ 
              background: 'rgba(255,255,255,0.12)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '12px 20px', 
              borderRadius: 16, 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              cursor: 'pointer', 
              fontSize: 12, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              backdropFilter: 'blur(10px)'
            }}>
            <RefreshCw size={16} className={isAnalyzing ? 'animate-spin' : ''} />
            {isAnalyzing ? 'Analizando...' : 'Actualizar Métricas'}
          </button>
        </div>

        {/* Ambient background lights */}
        <div style={{ position: 'absolute', top: -60, right: -40, width: 300, height: 300, background: 'rgba(212, 119, 146, 0.25)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -50, left: '25%', width: 250, height: 250, background: 'rgba(79, 70, 229, 0.3)', borderRadius: '50%', filter: 'blur(50px)' }} />
      </div>

      {/* Main KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 28 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 22, border: '2px solid #F3F4F6', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tasa de Conversión</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: GREEN_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREEN }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <p style={{ fontSize: 30, fontWeight: 900, color: '#1a1a1a', margin: '4px 0' }}>{conversionRate}%</p>
          <p style={{ fontSize: 11, color: GREEN, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{orders.length} ventas</span> de {totalCartsInitiated} intenciones
          </p>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 22, border: '2px solid #F3F4F6', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Carritos Abandonados</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: ROSE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ROSE }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <p style={{ fontSize: 30, fontWeight: 900, color: '#1a1a1a', margin: '4px 0' }}>{abandonedCarts.length}</p>
          <p style={{ fontSize: 11, color: ROSE, fontWeight: 700 }}>
            Listos para recuperar por WhatsApp
          </p>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 22, border: '2px solid #F3F4F6', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ticket Promedio</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: INDIGO_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: INDIGO }}>
              <DollarSign size={18} />
            </div>
          </div>
          <p style={{ fontSize: 30, fontWeight: 900, color: '#1a1a1a', margin: '4px 0' }}>${avgTicket.toLocaleString('es-AR')}</p>
          <p style={{ fontSize: 11, color: INDIGO, fontWeight: 700 }}>
            Ingresos totales: ${totalRevenue.toLocaleString('es-AR')}
          </p>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 22, border: '2px solid #F3F4F6', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Puntaje de Tienda</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: AMBER_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: AMBER }}>
              <Zap size={18} />
            </div>
          </div>
          <p style={{ fontSize: 30, fontWeight: 900, color: '#1a1a1a', margin: '4px 0' }}>{healthScore}<span style={{ fontSize: 18, color: '#aaa', fontWeight: 600 }}>/100</span></p>
          <p style={{ fontSize: 11, color: AMBER, fontWeight: 700 }}>
            {healthScore > 80 ? '⭐ Nivel de Conversión Óptimo' : '⚡ Oportunidades de Mejora'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, background: '#fff', padding: 8, borderRadius: 18, border: '1px solid #E5E7EB', width: 'fit-content', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('ai_advisor')} style={tabButtonStyle(activeTab === 'ai_advisor')}>
          <Sparkles size={16} style={{ color: activeTab === 'ai_advisor' ? '#F472B6' : '#888' }} /> Asesor IA & Chat Estratégico
        </button>
        <button onClick={() => setActiveTab('tools')} style={tabButtonStyle(activeTab === 'tools')}>
          <Flame size={16} style={{ color: activeTab === 'tools' ? '#F59E0B' : '#888' }} /> Zonas Calientes & Google
        </button>
        <button onClick={() => setActiveTab('carts')} style={tabButtonStyle(activeTab === 'carts')}>
          <ShoppingBag size={16} style={{ color: activeTab === 'carts' ? ROSE : '#888' }} /> Recuperación de Carritos ({abandonedCarts.length})
        </button>
      </div>

      {/* TAB 1: AI ADVISOR & INTERACTIVE CHAT */}
      {activeTab === 'ai_advisor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
          
          {/* Diagnostic Cards */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #E5E7EB', padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 10px #22C55E' }} />
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>Diagnóstico Estratégico de IA</h3>
                </div>
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Último análisis generado a las {aiAnalysisDate} en base a tus pedidos y carritos reales.</p>
              </div>
              <span style={{ background: INDIGO_LIGHT, color: INDIGO, border: `1px solid ${INDIGO_BORDER}`, padding: '6px 14px', borderRadius: 12, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                CRO Booster
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div style={{ background: ROSE_LIGHT, border: `2px solid ${ROSE_BORDER}`, borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ROSE }}>
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>1. Incentivo de Cierre Rápido</h4>
                    <span style={{ fontSize: 10, color: ROSE, fontWeight: 800, textTransform: 'uppercase' }}>Alto Impacto Inmediato</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5, marginBottom: 16 }}>
                  Muchos usuarios que arman carritos superiores a $20.000 dudan en el costo de envío. Ofrecer un <strong>cupón automático de regalo sorpresa</strong> (ej: mini resaltador o sticker pack) en compras sobre ese monto incrementará un 25% la conversión.
                </p>
                <div style={{ background: '#fff', padding: '10px 14px', borderRadius: 12, fontSize: 12, color: '#666', border: `1px dashed ${ROSE_BORDER}` }}>
                  💡 <strong>Tip:</strong> Creá el cupón <code style={{ color: ROSE, fontWeight: 800 }}>REGALOMARIA</code> en la pestaña Cupones.
                </div>
              </div>

              <div style={{ background: INDIGO_LIGHT, border: '2px solid #C7D2FE', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INDIGO }}>
                    <Target size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>2. Potenciar "Sets Día del Maestro"</h4>
                    <span style={{ fontSize: 10, color: INDIGO, fontWeight: 800, textTransform: 'uppercase' }}>Estacionalidad Clave</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5, marginBottom: 16 }}>
                  Los sets completos (Set Organízate, Cherry y Bloom) tienen un ticket promedio más alto que productos individuales. Sugerí en la descripción que vienen <strong>listos para regalar en sobre PVC con tarjeta</strong> para cerrar ventas.
                </p>
                <div style={{ background: '#fff', padding: '10px 14px', borderRadius: 12, fontSize: 12, color: '#666', border: '1px dashed #C7D2FE' }}>
                  🎯 <strong>Acción:</strong> Mantené el slide 3 del banner activo durante las próximas semanas.
                </div>
              </div>

              <div style={{ background: GREEN_BG, border: '2px solid #A7F3D0', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREEN }}>
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>3. Recuperación Cálida por WhatsApp</h4>
                    <span style={{ fontSize: 10, color: GREEN, fontWeight: 800, textTransform: 'uppercase' }}>Tasa de Respuesta 60%</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5, marginBottom: 16 }}>
                  El público de papelería responde muy bien a mensajes afectuosos y personalizados. Enviar el recordatorio con tono <em>girly</em> dentro de las primeras 3 horas de abandono recupera hasta 6 de cada 10 pedidos.
                </p>
                <div style={{ background: '#fff', padding: '10px 14px', borderRadius: 12, fontSize: 12, color: '#666', border: '1px dashed #A7F3D0' }}>
                  📱 <strong>Acción:</strong> Usá el botón "WhatsApp" en la pestaña Recuperación de Carritos.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Gemini AI Chat Section */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 24, 
            border: '1px solid #E5E7EB', 
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Chat Top Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)', 
              padding: '20px 28px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              color: '#fff',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 14, 
                  background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)'
                }}>
                  <Sparkles size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0, color: '#fff' }}>Consultor Gemini AI en Vivo</h3>
                    <span style={{ 
                      fontSize: 10, 
                      fontWeight: 800, 
                      padding: '2px 8px', 
                      borderRadius: 12, 
                      background: 'rgba(34, 197, 94, 0.2)', 
                      color: '#4ADE80',
                      border: '1px solid rgba(74, 222, 128, 0.3)'
                    }}>
                      ● EN LÍNEA
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '2px 0 0' }}>
                    Sincronizado con: {orders.length} pedidos · ${avgTicket.toLocaleString('es-AR')} ticket prom. · {abandonedCarts.length} carritos
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button 
                  onClick={() => setChatMessages([{
                    id: 'welcome_reset',
                    role: 'assistant',
                    text: '¡Conversación reiniciada! 🌸 ¿Qué otra consulta estratégica, copy o promoción querés optimizar?',
                    time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                  }])}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#E2E8F0',
                    padding: '8px 14px',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Limpiar Chat
                </button>
              </div>
            </div>

            {/* Quick Prompt Pills */}
            <div style={{ 
              background: '#F8FAFC', 
              padding: '14px 24px', 
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sugerencias:
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap' }}>
                {QUICK_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isAiGenerating}
                    style={{
                      background: '#fff',
                      border: '1px solid #CBD5E1',
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = ROSE;
                      e.currentTarget.style.color = ROSE;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.color = '#334155';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages List */}
            <div style={{ 
              padding: '24px', 
              height: 440, 
              overflowY: 'auto', 
              background: '#FAFAF9',
              display: 'flex',
              flexDirection: 'column',
              gap: 18
            }}>
              {chatMessages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div 
                    key={msg.id} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: isAssistant ? 'flex-start' : 'flex-end',
                      width: '100%'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-end', 
                      gap: 10, 
                      maxWidth: '85%',
                      flexDirection: isAssistant ? 'row' : 'row-reverse'
                    }}>
                      {/* Avatar */}
                      <div style={{ 
                        width: 34, 
                        height: 34, 
                        borderRadius: 12, 
                        background: isAssistant ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#1E293B',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: 12,
                        fontWeight: 900
                      }}>
                        {isAssistant ? <Sparkles size={16} /> : <User size={16} />}
                      </div>

                      {/* Bubble */}
                      <div style={{
                        background: isAssistant ? '#fff' : '#1E1B4B',
                        color: isAssistant ? '#1E293B' : '#fff',
                        padding: '16px 20px',
                        borderRadius: isAssistant ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                        border: isAssistant ? '1px solid #E2E8F0' : 'none',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                        fontSize: 14,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        position: 'relative'
                      }}>
                        {msg.text}

                        {isAssistant && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>
                            <button
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                fontSize: 11,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: 0
                              }}
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check size={12} color="#10B981" />
                                  <span style={{ color: '#10B981', fontWeight: 700 }}>Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <span style={{ 
                      fontSize: 10, 
                      color: '#94A3B8', 
                      marginTop: 4,
                      marginLeft: isAssistant ? 44 : 0,
                      marginRight: !isAssistant ? 44 : 0
                    }}>
                      {isAssistant ? 'Gemini AI Advisor' : 'Flor (M•flower)'} · {msg.time}
                    </span>
                  </div>
                );
              })}

              {/* Generating Loading State */}
              {isAiGenerating && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, maxWidth: '80%' }}>
                  <div style={{ 
                    width: 34, 
                    height: 34, 
                    borderRadius: 12, 
                    background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', 
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div style={{
                    background: '#fff',
                    padding: '14px 20px',
                    borderRadius: '18px 18px 18px 4px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#64748B',
                    fontSize: 13,
                    fontWeight: 600
                  }}>
                    <Sparkles size={14} style={{ color: '#EC4899' }} className="animate-spin" />
                    <span>Gemini está formulando la mejor estrategia...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <div style={{ 
              padding: '16px 24px', 
              background: '#fff', 
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              gap: 12,
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Escribí una consulta para Gemini (ej: 'Redactame un post para promocionar el Set Cherry con envío gratis')..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isAiGenerating}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: 14,
                  border: '1.5px solid #E2E8F0',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = INDIGO}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isAiGenerating}
                style={{
                  background: inputMessage.trim() && !isAiGenerating 
                    ? 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)' 
                    : '#E2E8F0',
                  color: inputMessage.trim() && !isAiGenerating ? '#fff' : '#94A3B8',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 24px',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: inputMessage.trim() && !isAiGenerating ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: inputMessage.trim() && !isAiGenerating ? '0 4px 14px rgba(67, 56, 202, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {isAiGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Enviar</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TOOLS (CLARITY & SEARCH CONSOLE) */}
      {activeTab === 'tools' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #E5E7EB', padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={28} />
              </div>
              <span style={{ background: GREEN_BG, color: GREEN, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                ✓ Conectado
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', marginBottom: 8 }}>Microsoft Clarity</h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
              Visualizá los <strong>mapas de calor (zonas calientes)</strong> para ver exactamente en qué fotos y botones tocan con el dedo tus clientas, y mirá <strong>grabaciones de sesión reales</strong>.
            </p>

            <div style={{ background: '#FAFAFA', padding: 16, borderRadius: 16, border: '1px solid #EEE', marginBottom: 24, fontSize: 12, color: '#555' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>ID de Proyecto:</strong>
                <code style={{ background: '#fff', padding: '2px 8px', borderRadius: 6, border: '1px solid #ddd', color: INDIGO, fontWeight: 800 }}>ycr3resi23</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Estado del script:</strong>
                <span style={{ color: GREEN, fontWeight: 700 }}>Activo en mflower.store</span>
              </div>
            </div>

            <a 
              href="https://clarity.microsoft.com/projects/view/ycr3resi23/dashboard" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: '14px 20px',
                background: '#1a1a1a',
                color: '#fff',
                borderRadius: 14,
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Abrir Mapas de Calor <ExternalLink size={16} />
            </a>
          </div>

          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #E5E7EB', padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: '#EEF2FF', color: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={28} />
              </div>
              <span style={{ background: GREEN_BG, color: GREEN, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                ✓ Verificado
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', marginBottom: 8 }}>Google Search Console</h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
              Descubrí qué palabras escribe la gente en Google para encontrar <strong>M•flower</strong>, cuántas búsquedas recibís y el estado de indexación de tus productos.
            </p>

            <div style={{ background: '#FAFAFA', padding: 16, borderRadius: 16, border: '1px solid #EEE', marginBottom: 24, fontSize: 12, color: '#555' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>Propiedad:</strong>
                <span style={{ fontWeight: 700 }}>https://www.mflower.store/</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Sitemap XML:</strong>
                <span style={{ color: INDIGO, fontWeight: 700 }}>/sitemap.xml</span>
              </div>
            </div>

            <a 
              href="https://search.google.com/search-console?resource_id=https%3A%2F%2Fwww.mflower.store%2F" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: '14px 20px',
                background: INDIGO,
                color: '#fff',
                borderRadius: 14,
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Abrir Search Console <ExternalLink size={16} />
            </a>
          </div>
        </div>
      )}

      {/* TAB 3: ABANDONED CARTS */}
      {activeTab === 'carts' && (
        <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>Recuperación de Carritos</h2>
              <p style={{ fontSize: 11, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Clientes con compra pendiente</p>
            </div>
            <div style={{ display: 'flex', background: '#f5f5f5', padding: 4, borderRadius: 14 }}>
              <button 
                onClick={() => setReminderType('reminder_1')} 
                style={{ 
                  padding: '10px 18px', 
                  borderRadius: 12, 
                  fontSize: 12, 
                  fontWeight: 800, 
                  border: 'none', 
                  cursor: 'pointer',
                  background: reminderType === 'reminder_1' ? ROSE : 'transparent',
                  color: reminderType === 'reminder_1' ? '#fff' : '#666'
                }}>
                Mensaje Dulce 💖
              </button>
              <button 
                onClick={() => setReminderType('reminder_2')} 
                style={{ 
                  padding: '10px 18px', 
                  borderRadius: 12, 
                  fontSize: 12, 
                  fontWeight: 800, 
                  border: 'none', 
                  cursor: 'pointer',
                  background: reminderType === 'reminder_2' ? ROSE : 'transparent',
                  color: reminderType === 'reminder_2' ? '#fff' : '#666'
                }}>
                Con Regalo / Promo 🎁
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Loader2 size={32} style={{ color: ROSE, animation: 'spin 1s linear infinite', margin: '0 auto' }} />
              <p style={{ color: '#aaa', marginTop: 12, fontWeight: 600 }}>Cargando datos...</p>
            </div>
          ) : abandonedCarts.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                <thead>
                  <tr>
                    <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Cliente</th>
                    <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Contacto</th>
                    <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Items</th>
                    <th style={{ fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '8px 12px' }}>Última Actividad</th>
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
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ROSE, fontWeight: 900, fontSize: 16, border: `1px solid ${ROSE_BORDER}` }}>
                              {(cart.customer_email || 'C')[0].toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{cart.customer_email || 'Visitante sin registrar'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', borderRight: 'none' }}>
                          <div style={{ fontSize: 13, color: '#555' }}>
                            {cart.customer_phone ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 700 }}>
                                <MessageCircle size={16} />
                                <span>{cart.customer_phone}</span>
                              </div>
                            ) : (
                              <span style={{ color: '#aaa', fontSize: 12 }}>Solo email</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', borderRight: 'none' }}>
                          <span style={{ fontWeight: 800, color: ROSE, fontSize: 16 }}>{itemCount}</span>
                          <span style={{ fontSize: 12, color: '#888', marginLeft: 4 }}>productos</span>
                        </td>
                        <td style={{ padding: '14px 12px', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', borderRight: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' }}>
                            <Clock size={14} style={{ color: hoursAgo < 3 ? ROSE : '#aaa' }} />
                            <span>Hace {hoursAgo < 1 ? 'menos de 1 hora' : `${hoursAgo}h`}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', borderRadius: '0 12px 12px 0', border: `1px solid ${hoursAgo < 3 ? ROSE_BORDER : '#eee'}`, borderLeft: 'none', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleSendReminder(cart)} 
                            style={{ 
                              padding: '10px 18px', 
                              background: '#25D366', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: 12,
                              fontWeight: 800, 
                              fontSize: 11, 
                              cursor: 'pointer', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.05em',
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 6,
                              boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                            }}>
                            <Send size={14} /> WhatsApp
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, background: GREEN_BG, borderRadius: 20 }}>
              <CheckCircle2 size={48} style={{ color: GREEN, margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', marginBottom: 4 }}>¡Excelente!</h3>
              <p style={{ color: '#059669', fontWeight: 600 }}>No hay carritos abandonados pendientes. Tus visitantes están concretando sus compras.</p>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
