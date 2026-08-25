"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { Key, ArrowRight, FileText, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ROSE = '#D47792';
const ROSE_LIGHT = '#FFF0F3';
const ROSE_BORDER = '#F5C6D0';

export default function MayoristaLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code.trim()) {
      setErrorMsg('Ingresá tu código de acceso mayorista único.');
      return;
    }

    setLoading(true);

    try {
      const inputCode = code.trim().toUpperCase();
      const { data, error } = await supabase.from('categories').select('*').like('name', 'WHOLESALE_CODE:%');

      let found = null;
      if (!error && data) {
        for (const item of data) {
          const itemCode = item.slug ? item.slug.replace('wholesale-code-', '').toUpperCase() : '';
          if (itemCode === inputCode) {
            let extra = {};
            try { extra = JSON.parse(item.description || '{}'); } catch(e) {}
            found = {
              code: itemCode,
              name: extra.name || 'Cliente Mayorista',
              status: extra.status || 'active'
            };
            break;
          }
        }
      }

      if (!found) {
        const defaultCodes = [
          { code: 'MAY-MARIA-2026', status: 'active' },
          { code: 'FLOWER-MAYOR-88', status: 'active' }
        ];
        found = defaultCodes.find(c => c.code === inputCode);
      }

      if (!found) {
        setErrorMsg('El código de acceso mayorista ingresado no es válido o expiró.');
        setLoading(false);
        return;
      }

      if (found.status === 'paused') {
        setErrorMsg('Tu código de acceso mayorista se encuentra en pausa temporal. Contactanos para reactivarlo.');
        setLoading(false);
        return;
      }

      const sessionData = {
        email: email || 'mayorista@mflowerbymaria.com',
        clientName: found.name || 'Cliente Mayorista',
        code: found.code,
        logged_at: new Date().toISOString()
      };
      localStorage.setItem('mflower_wholesale_session', JSON.stringify(sessionData));

      router.push('/');
    } catch(err) {
      console.error(err);
      setErrorMsg('Ocurrió un error al verificar el acceso mayorista.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: 480, width: '100%', background: '#fff', padding: 36, borderRadius: 28, border: `2px solid ${ROSE_BORDER}`, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Logo size="small" />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ROSE_LIGHT, color: ROSE, padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginTop: 16 }}>
              <Lock size={14} /> Acceso Exclusivo Mayoristas
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', marginTop: 12 }}>Ingreso Venta Mayorista</h2>
            <p style={{ fontSize: 13, color: '#777', marginTop: 4 }}>Ingresá tus credenciales y tu código único asignado para acceder a los precios mayoristas.</p>
          </div>

          {errorMsg && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: '#444', display: 'block', marginBottom: 6 }}>Email de Cliente:</label>
              <input 
                type="email" 
                placeholder="tuempresa@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #ddd', fontSize: 14, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: '#444', display: 'block', marginBottom: 6 }}>Contraseña:</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #ddd', fontSize: 14, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: ROSE, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Key size={14} /> Código de Acceso Mayorista Único:
              </label>
              <input 
                type="text" 
                placeholder="Ej: MAY-MARIA-2026"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${ROSE_BORDER}`, fontSize: 15, fontWeight: 900, color: ROSE, letterSpacing: '0.05em', outline: 'none', background: ROSE_LIGHT }}
              />
              <span style={{ fontSize: 11, color: '#999', display: 'block', marginTop: 4 }}>* Código otorgado directamente por M•flower por María.</span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ background: ROSE, color: '#fff', border: 'none', padding: '14px 20px', borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, transition: 'all 0.2s' }}
            >
              {loading ? 'Verificando...' : <>Ingresar a Tienda Mayorista <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ borderTop: '1px solid #eee', marginTop: 24, paddingTop: 20, textAlign: 'center' }}>
            <Link href="/mayorista/condiciones" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#666', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <FileText size={16} style={{ color: ROSE }} /> Ver Condiciones de Venta Mayorista
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
