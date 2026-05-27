"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GraciasContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'approved';
    const paymentId = searchParams.get('payment_id') || '';

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
