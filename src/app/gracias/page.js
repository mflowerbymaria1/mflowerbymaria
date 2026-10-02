"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useCart } from "../../store/CartContext";

function GraciasContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'approved';
    const paymentId = searchParams.get('payment_id') || '';
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', background: '#fafafa' }}>
                <div style={{
                    maxWidth: '550px',
                    width: '100%',
                    textAlign: 'center',
                    background: 'white',
                    padding: '3rem 2.5rem',
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    border: '1px solid #f3f4f6'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #B2F2BB 0%, #69db7c 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        fontSize: '2.5rem'
                    }}>
                        ✓
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-quicksand), sans-serif',
                        fontSize: '2rem',
                        color: '#1f2937',
                        fontWeight: 700,
                        marginBottom: '0.75rem'
                    }}>
                        ¡Gracias por tu compra! 🌸
                    </h1>

                    <p style={{ color: '#6b7280', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        Tu pago fue procesado exitosamente. Estamos preparando tu pedido con mucho cariño.
                    </p>

                    {paymentId && (
                        <div style={{
                            background: '#f9fafb',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            border: '1px solid #f3f4f6',
                            marginBottom: '1.5rem',
                            fontSize: '0.85rem',
                            color: '#6b7280'
                        }}>
                            ID de Pago: <strong style={{ color: '#374151' }}>{paymentId}</strong>
                        </div>
                    )}

                    {/* Callout para productos personalizados como Álbum de Figuritas */}
                    <div style={{
                        background: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E9 100%)',
                        border: '2px solid #F5C6D0',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        textAlign: 'left',
                        boxShadow: '0 4px 15px rgba(212, 119, 146, 0.12)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '1.5rem' }}>📸</span>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#D47792', fontFamily: 'var(--font-quicksand), sans-serif' }}>
                                ¿Compraste el Álbum de Figuritas u otro producto personalizado?
                            </h3>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '14px' }}>
                            ¡Es momento de enviarnos tus fotos! Tocá el botón verde para mandarlas por WhatsApp junto con tu <strong>número o ID de pedido</strong> (o envialas por email a <a href="mailto:contacto.mflower@gmail.com" style={{ color: '#D47792', fontWeight: 700 }}>contacto.mflower@gmail.com</a>).
                        </p>
                        <a 
                            href={`https://wa.me/541141817424?text=${encodeURIComponent('¡Hola Flor! Acá te paso las fotos para mi Álbum de Figuritas del pedido ' + (paymentId ? '#' + paymentId : ''))}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: '#25D366',
                                color: '#fff',
                                padding: '11px 22px',
                                borderRadius: '30px',
                                fontSize: '0.9rem',
                                fontWeight: 800,
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            <span>📲 Enviar fotos por WhatsApp ahora</span>
                        </a>
                    </div>

                    <div style={{
                        background: 'rgba(255, 209, 220, 0.15)',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 209, 220, 0.3)',
                        marginBottom: '2rem',
                        textAlign: 'left'
                    }}>
                        <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '8px' }}>
                            📦 <strong>Próximos pasos:</strong>
                        </p>
                        <ul style={{ fontSize: '0.85rem', color: '#6b7280', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                            <li>Recibirás un email de confirmación</li>
                            {typeof window !== 'undefined' && localStorage.getItem('lastShippingType') === 'retiro' ? (
                                <>
                                    <li>Te avisaremos cuando tu pedido esté listo para retirar</li>
                                    <li>Acordate de traer tu número de pedido y DNI</li>
                                </>
                            ) : (
                                <>
                                    <li>Te avisaremos cuando tu pedido esté en camino</li>
                                    <li>Podés seguir tu envío con el código de tracking</li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <Link href="/productos" style={{
                            padding: '14px 28px',
                            background: 'var(--pastel-pink)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'all 0.3s',
                            fontSize: '0.95rem'
                        }}>
                            Seguir comprando
                        </Link>
                        <Link href="/" style={{
                            padding: '14px 28px',
                            background: '#f3f4f6',
                            color: '#374151',
                            borderRadius: '12px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.3s',
                            fontSize: '0.95rem'
                        }}>
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function GraciasPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Cargando...</div>}>
            <GraciasContent />
        </Suspense>
    );
}
