"use client";

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { ShoppingBag, Truck, CreditCard, ShieldCheck, ArrowLeft, Key } from 'lucide-react';

const ROSE = '#D47792';
const ROSE_LIGHT = '#FFF0F3';
const ROSE_BORDER = '#F5C6D0';

export default function MayoristaCondicionesPage() {
  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, maxWidth: 860, width: '100%', margin: '0 auto', padding: '40px 20px' }}>
        
        <div style={{ background: '#fff', padding: 40, borderRadius: 28, border: `2px solid ${ROSE_BORDER}`, boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Logo size="medium" />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ROSE_LIGHT, color: ROSE, padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', marginTop: 20 }}>
              Condiciones Comerciales
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a', marginTop: 12 }}>Venta Mayorista M•flower</h1>
            <p style={{ fontSize: 14, color: '#666', marginTop: 6 }}>Términos y condiciones para revendedores y clientes mayoristas.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
            
            <div style={{ background: ROSE_LIGHT, padding: 20, borderRadius: 20, border: `1px solid ${ROSE_BORDER}` }}>
              <ShoppingBag size={24} style={{ color: ROSE, marginBottom: 10 }} />
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a', marginBottom: 6 }}>Monto Mínimo</h3>
              <p style={{ fontSize: 13, color: '#555', margin: 0, lineHeight: 1.5 }}>
                El monto mínimo por compra es de <strong>$200.000</strong> con <strong>surtido libre</strong>. Podés combinar productos como prefieras.
              </p>
            </div>

            <div style={{ background: '#FEF3C7', padding: 20, borderRadius: 20, border: '1px solid #FCD34D' }}>
              <Truck size={24} style={{ color: '#D97706', marginBottom: 10 }} />
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#92400E', marginBottom: 6 }}>Plazo de Despacho</h3>
              <p style={{ fontSize: 13, color: '#B45309', margin: 0, lineHeight: 1.5 }}>
                El tiempo estimado de preparación de los pedidos mayoristas es de <strong>5 a 10 días hábiles</strong> adicionales al correo.
              </p>
            </div>

            <div style={{ background: '#F0FDF4', padding: 20, borderRadius: 20, border: '1px solid #86EFAC' }}>
              <CreditCard size={24} style={{ color: '#059669', marginBottom: 10 }} />
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#065F46', marginBottom: 6 }}>Medios de Pago</h3>
              <p style={{ fontSize: 13, color: '#047857', margin: 0, lineHeight: 1.5 }}>
                Aceptamos <strong>Transferencia bancaria</strong> o pago a través de <strong>Mercado Pago</strong> (consulte opciones de cuotas).
              </p>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid #eee', paddingTop: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a' }}>Preguntas Frecuentes</h3>
            
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: ROSE }}>¿Cómo obtengo mi Código de Acceso Mayorista?</h4>
              <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                Los códigos son personales e intransferibles. Si tenés una librería, showroom o emprendimiento y querés revender nuestros productos, ponete en contacto con nosotros vía WhatsApp o Instagram para solicitar tu código único.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: ROSE }}>¿Cómo se calculan los envíos?</h4>
              <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                Los envíos se cotizan automáticamente al momento de la compra con nuestro sistema de correo y logística integrada.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <Link 
              href="/mayorista/login" 
              style={{ background: ROSE, color: '#fff', padding: '12px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Key size={16} /> Ingresar con Código Mayorista
            </Link>
            <Link 
              href="/" 
              style={{ background: '#f5f5f5', color: '#666', padding: '12px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <ArrowLeft size={16} /> Volver a la Tienda Minorista
            </Link>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
