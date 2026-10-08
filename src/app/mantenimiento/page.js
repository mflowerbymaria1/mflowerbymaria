"use client";

import React, { useState } from 'react';
import { Lock, Sparkles, Heart } from 'lucide-react';

export default function MantenimientoPage() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password) {
      window.location.href = `/admin?pw=${encodeURIComponent(password)}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 100%)',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      fontFamily: 'Montserrat, Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background cute circles */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'rgba(212, 119, 146, 0.08)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'rgba(212, 119, 146, 0.08)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Main card */}
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '32px',
        padding: '3rem 2.5rem',
        boxShadow: '0 20px 50px rgba(212, 119, 146, 0.12)',
        border: '2px solid #F5C6D0',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Brand Header */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #D47792 0%, #B85873 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 900,
          margin: '0 auto 1.5rem',
          boxShadow: '0 10px 25px rgba(212, 119, 146, 0.35)'
        }}>
          M
        </div>

        <h1 style={{
          fontSize: '1.85rem',
          fontWeight: 900,
          color: '#1a1a1a',
          marginBottom: '0.75rem',
          letterSpacing: '-0.02em'
        }}>
          Estamos preparando cosas hermosas ✨🌸
        </h1>

        <p style={{
          fontSize: '1rem',
          color: '#666',
          lineHeight: '1.65',
          marginBottom: '2rem'
        }}>
          Nuestra tienda online se encuentra en <strong>mantenimiento y actualización de productos</strong>. Estamos dejando todo impecable para brindarte la mejor experiencia.
        </p>

        <div style={{
          background: '#FFF0F3',
          border: '1px dashed #F5C6D0',
          borderRadius: '20px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <Sparkles size={20} color="#D47792" />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#D47792' }}>
            ¡Volvemos en breve con toda la nueva colección!
          </span>
        </div>

        {/* Social / Contact button */}
        <a
          href="https://www.instagram.com/mflower.store"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#1a1a1a',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '16px',
            fontSize: '0.9rem',
            fontWeight: 800,
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          }}
        >
          <Heart size={16} fill="#fff" /> Seguinos en Instagram
        </a>

        {/* Admin Access Toggle */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6' }}>
          {!showAdminLogin ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#aaa',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Lock size={12} /> Acceso Administrador
            </button>
          ) : (
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', gap: '8px', maxWidth: '320px', margin: '0 auto' }}>
              <input
                type="password"
                placeholder="Contraseña de admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #F5C6D0',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: '#FFF0F3'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#D47792',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Entrar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
