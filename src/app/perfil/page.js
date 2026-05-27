"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchProfileData() {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                router.push('/');
                return;
            }

            setUser(session.user);

            // Fetch orders for this email
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_email', session.user.email)
                .order('created_at', { ascending: false });

            if (!ordersError && ordersData) {
                setOrders(ordersData);
            }
            setLoading(false);
        }

        fetchProfileData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow flex items-center justify-center bg-background">
                    <p>Cargando perfil...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-background py-12">
                <div className="container max-w-4xl mx-auto" style={{ padding: '0 20px' }}>
                    
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <h1 style={{ fontFamily: 'var(--font-quicksand)', fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>Mi Perfil</h1>
                                <p style={{ color: '#666', marginTop: '0.5rem' }}>Hola, {user?.user_metadata?.full_name || 'Usuari@'} ({user?.email})</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                style={{ background: '#f3f4f6', color: '#4b5563', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Cerrar Sesión
                            </button>
                        </div>

                        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333', marginBottom: '1.5rem' }}>Historial de Pedidos</h2>

                        {orders.length === 0 ? (
                            <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', textAlign: 'center', color: '#6b7280' }}>
                                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>🛍️</span>
                                Todavía no tenés ningún pedido registrado.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                            <th style={{ padding: '12px', borderBottom: '2px solid #e5e7eb' }}>Pedido #</th>
                                            <th style={{ padding: '12px', borderBottom: '2px solid #e5e7eb' }}>Fecha</th>
                                            <th style={{ padding: '12px', borderBottom: '2px solid #e5e7eb' }}>Total</th>
                                            <th style={{ padding: '12px', borderBottom: '2px solid #e5e7eb' }}>Estado Pago</th>
                                            <th style={{ padding: '12px', borderBottom: '2px solid #e5e7eb' }}>Estado Envío</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#333' }}>
                                                    {String(order.id).slice(0, 8)}
                                                </td>
                                                <td style={{ padding: '16px 12px', color: '#555' }}>
                                                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                                                </td>
                                                <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#D47792' }}>
                                                    ${order.total_amount?.toLocaleString('es-AR')}
                                                </td>
                                                <td style={{ padding: '16px 12px' }}>
                                                    <span style={{ 
                                                        background: order.payment_status === 'approved' ? '#dcfce7' : '#fef3c7',
                                                        color: order.payment_status === 'approved' ? '#166534' : '#92400e',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {order.payment_status === 'approved' ? 'Aprobado' : 'Pendiente'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 12px' }}>
                                                    <span style={{ 
                                                        background: order.shipping_status === 'shipped' ? '#dbeafe' : (order.shipping_status === 'ready' ? '#f3e8ff' : '#f3f4f6'),
                                                        color: order.shipping_status === 'shipped' ? '#1e40af' : (order.shipping_status === 'ready' ? '#6b21a8' : '#374151'),
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {order.shipping_status === 'shipped' ? 'Enviado' : (order.shipping_status === 'ready' ? 'Listo' : 'Pendiente')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
