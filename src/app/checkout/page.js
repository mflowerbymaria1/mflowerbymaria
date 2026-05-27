"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ShippingCalculator from "../../components/ShippingCalculator";
import { useCart } from "../../store/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function CheckoutPage() {
    const { cartItems, cartCount, clearCart } = useCart();
    const [formData, setFormData] = useState({
        nombre: "", apellido: "", email: "", telefono: "", direccion: "", ciudad: "", notas: ""
    });
    const [shippingType, setShippingType] = useState('envio'); // 'envio' or 'retiro'
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const [orderCompleted, setOrderCompleted] = useState(false);
    const [savedTotal, setSavedTotal] = useState(0);
    const [savedShippingType, setSavedShippingType] = useState('envio');

    // Coupon states
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const userEmail = session.user.email;
                const { data: orders } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('customer_email', userEmail)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (orders && orders.length > 0) {
                    const lastOrder = orders[0];
                    let parsedAddress = {};
                    try {
                        if (lastOrder.shipping_address && lastOrder.shipping_address.startsWith('{')) {
                            parsedAddress = JSON.parse(lastOrder.shipping_address);
                        } else if (lastOrder.shipping_address && lastOrder.shipping_address !== 'Retiro en sucursal') {
                            parsedAddress.direccion = lastOrder.shipping_address;
                        }
                    } catch (e) {
                        parsedAddress.direccion = lastOrder.shipping_address;
                    }
                    
                    setFormData(prev => ({
                        ...prev,
                        nombre: lastOrder.customer_name?.split(' ')[0] || prev.nombre,
                        apellido: lastOrder.customer_name?.split(' ').slice(1).join(' ') || prev.apellido,
                        email: userEmail || prev.email,
                        telefono: parsedAddress.telefono || lastOrder.customer_phone || prev.telefono,
                        direccion: parsedAddress.direccion || prev.direccion,
                        ciudad: parsedAddress.ciudad || prev.ciudad
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        email: userEmail,
                        nombre: session.user.user_metadata?.full_name?.split(' ')[0] || prev.nombre,
                        apellido: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || prev.apellido,
                    }));
                }
            }
        }
        fetchUserData();
    }, []);

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shippingCost = selectedShipping ? selectedShipping.price : 0;
    
    // Calculate discounts
    let discount = paymentMethod === 'transferencia' ? cartTotal * 0.20 : 0; // Base 20% transfer discount
    
    if (appliedCoupon) {
        if (appliedCoupon.short_description === 'percentage') {
            discount += (cartTotal * (appliedCoupon.price / 100));
        } else if (appliedCoupon.short_description === 'fixed') {
            discount += appliedCoupon.price;
        } else if (appliedCoupon.short_description === 'free_shipping') {
            shippingCost = 0;
        }
    }
    
    const finalTotal = Math.max(0, cartTotal - discount + shippingCost);

    const handleApplyCoupon = async () => {
        setCouponError('');
        if (!couponInput.trim()) return;
        
        if (!formData.email) {
            setCouponError('Por favor ingresá tu email en los datos de facturación primero.');
            return;
        }

        setCouponLoading(true);
        const { data: coupon, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', 'COUPON')
            .eq('name', couponInput.toUpperCase().trim())
            .single();
            
        if (error || !coupon) {
            setCouponError('Cupón inválido o inexistente.');
            setCouponLoading(false);
            return;
        }
        
        if (coupon.stock <= 0) {
            setCouponError('Este cupón ya no tiene usos disponibles.');
            setCouponLoading(false);
            return;
        }

        // Check if user already used it
        const { data: pastOrders } = await supabase
            .from('orders')
            .select('notes')
            .eq('customer_email', formData.email);
            
        const alreadyUsed = pastOrders?.some(o => o.notes?.includes(`CUPÓN USADO: ${coupon.name}`));
        if (alreadyUsed) {
            setCouponError('Ya utilizaste este cupón en una compra anterior.');
            setCouponLoading(false);
            return;
        }
        
        setAppliedCoupon(coupon);
        setCouponInput('');
        setCouponLoading(false);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (shippingType === 'envio' && !selectedShipping) {
            alert("Por favor calculá y seleccioná una opción de envío antes de continuar.");
            return;
        }

        setIsProcessing(true);

        try {
            if (paymentMethod === 'transferencia') {
                // Transfer workflow
                const res = await fetch('/api/checkout-transfer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cartItems,
                        payer: formData,
                        shippingCost: shippingCost,
                        shippingType: shippingType,
                        finalTotal: finalTotal,
                        couponCode: appliedCoupon?.name || null
                    })
                });
                const data = await res.json();
                
                setIsProcessing(false);
                if (data.success) {
                    localStorage.setItem('lastShippingType', shippingType);
                    setCreatedOrderId(data.orderId);
                    setSavedTotal(finalTotal);
                    setSavedShippingType(shippingType);
                    setOrderCompleted(true);
                    setShowTransferModal(true);
                } else {
                    alert("Ocurrió un error al guardar tu pedido. Por favor intentá nuevamente.");
                }
                return;
            }

            // Mercado Pago workflow
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    payer: formData,
                    shippingCost: shippingCost,
                    shippingType: shippingType,
                    finalTotal: finalTotal,
                    couponCode: appliedCoupon?.name || null
                })
            });

            const data = await res.json();

            if (data.success && data.init_point) {
                // Redirect user to Mercado Pago checkout
                localStorage.setItem('lastShippingType', shippingType);
                window.location.href = data.init_point;
            } else {
                alert("Ocurrió un error al procesar el pago. Por favor intenta nuevamente.");
                setIsProcessing(false);
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión. Revisa tu internet e intenta nuevamente.");
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0 && !showTransferModal && !orderCompleted) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow flex items-center justify-center py-20 bg-background">
                    <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
                        <span className="text-6xl mb-6 block" style={{ fontSize: '4rem' }}>🛒</span>
                        <h2 className="text-2xl font-quicksand font-bold text-gray-800 mb-4" style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-8" style={{ color: '#6b7280', marginBottom: '2rem' }}>Agrega algunos productos antes de finalizar la compra.</p>
                        <Link href="/productos" className="bg-pink text-white px-8 py-3 rounded-full font-bold hover-bg-pink-dark transition-colors inline-block w-full" style={{ background: 'var(--pastel-pink)', color: 'white', padding: '12px 24px', borderRadius: '9999px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
                            Volver a la tienda
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-background py-12">
                <div className="container min-h-[60vh]" style={{ padding: '20px' }}>
                    <h1 className="font-quicksand text-3xl text-gray-800 font-bold mb-8" style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold', color: '#1f2937' }}>Finalizar Compra</h1>

                    <div className="checkout-layout">
                        {/* Formulario */}
                        <div className="checkout-form-container">
                            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
                                <h2 className="text-xl font-bold mb-6 text-gray-800" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Datos del Comprador</h2>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellido</label>
                                        <input required type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Email</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Teléfono</label>
                                        <input required type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                                    </div>
                                </div>

                                {shippingType === 'envio' && (
                                    <>
                                        <h2 className="text-xl font-bold mb-6 mt-8 text-gray-800" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', marginTop: '2rem', fontWeight: 'bold' }}>Datos de Envío</h2>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Dirección</label>
                                                <input required type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="shipping-type-selector mt-8" style={{ marginTop: '2rem' }}>
                                    <h3 className="text-lg font-bold mb-4 text-gray-800" style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 'bold' }}>Método de Entrega</h3>
                                    <div className="payment-options">
                                        <label className={`payment-option ${shippingType === 'envio' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="shippingType"
                                                value="envio"
                                                checked={shippingType === 'envio'}
                                                onChange={() => setShippingType('envio')}
                                            />
                                            <div className="payment-option-details">
                                                <span className="font-bold">Envío a Domicilio</span>
                                                <span className="text-sm text-gray-500">Calculá el costo con tu código postal</span>
                                            </div>
                                        </label>
                                        <label className={`payment-option ${shippingType === 'retiro' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="shippingType"
                                                value="retiro"
                                                checked={shippingType === 'retiro'}
                                                onChange={() => {
                                                    setShippingType('retiro');
                                                    setSelectedShipping(null);
                                                }}
                                            />
                                            <div className="payment-option-details">
                                                <span className="font-bold text-pink">Acordar retiro</span>
                                                <span className="text-sm text-gray-500">General Rodriguez</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="payment-method-selector mt-8" style={{ marginTop: '2rem' }}>
                                    <h3 className="text-lg font-bold mb-4 text-gray-800" style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 'bold' }}>Medio de Pago</h3>
                                    <div className="payment-options">
                                        <label className={`payment-option ${paymentMethod === 'mercadopago' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="mercadopago"
                                                checked={paymentMethod === 'mercadopago'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="payment-option-details">
                                                <span className="font-bold">Mercado Pago</span>
                                                <span className="text-sm text-gray-500">Tarjetas, Dinero en cuenta</span>
                                            </div>
                                        </label>
                                        <label className={`payment-option ${paymentMethod === 'transferencia' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="transferencia"
                                                checked={paymentMethod === 'transferencia'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="payment-option-details">
                                                <span className="font-bold text-pink">Transferencia - 20% OFF</span>
                                                <span className="text-sm text-gray-500">El descuento se aplica al instante</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="notes-section mt-8" style={{ marginTop: '2rem' }}>
                                    <h3 className="text-lg font-bold mb-4 text-gray-800" style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 'bold' }}>Observaciones / Notas adicionales</h3>
                                    <div className="form-group full-width">
                                        <textarea 
                                            name="notas" 
                                            value={formData.notas} 
                                            onChange={handleInputChange} 
                                            placeholder="Si elegiste retiro y viene otra persona, indicanos acá su nombre y DNI. También podés dejar aclaraciones sobre tu entrega."
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', fontFamily: 'inherit', resize: 'vertical' }}
                                        ></textarea>
                                    </div>
                                </div>

                                <button type="submit" disabled={isProcessing} className="submit-btn mt-8" style={{ marginTop: '2rem' }}>
                                    {isProcessing ? 'Procesando...' : (paymentMethod === 'transferencia' ? 'Ver Datos de Transferencia' : 'Pagar con Mercado Pago')}
                                </button>
                            </form>
                        </div>

                        {/* Resumen */}
                        <div className="checkout-summary-container">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', position: 'sticky', top: '6rem' }}>
                                <h2 className="text-xl font-bold mb-6 text-gray-800" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Resumen del Pedido</h2>
                                <div className="summary-items mb-6" style={{ marginBottom: '1.5rem' }}>
                                    {cartItems.map(item => (
                                        <div key={item.id} className="summary-item">
                                            <div className="item-info">
                                                <span className="item-qty">{item.quantity}x</span>
                                                <span className="item-name truncate">{item.name}</span>
                                            </div>
                                            <span className="item-price">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Coupon Section */}
                                <div className="coupon-section mb-6" style={{ marginBottom: '1.5rem', background: '#F9FAFB', padding: '12px', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                                    {!appliedCoupon ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4B5563' }}>¿Tenés un cupón de descuento?</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input 
                                                    type="text" 
                                                    placeholder="Ej: MAMA20" 
                                                    value={couponInput}
                                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', textTransform: 'uppercase', outline: 'none' }}
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading}
                                                    style={{ background: 'var(--pastel-pink)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: couponLoading ? 0.7 : 1 }}
                                                >
                                                    {couponLoading ? '...' : 'Aplicar'}
                                                </button>
                                            </div>
                                            {couponError && <span style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 'bold' }}>{couponError}</span>}
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ background: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>CUPÓN APLICADO</span>
                                                <span style={{ fontWeight: 'bold', color: '#1F2937' }}>{appliedCoupon.name}</span>
                                            </div>
                                            <button type="button" onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
                                                Quitar
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="summary-calculations pt-4 border-t border-gray-100" style={{ paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${cartTotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    
                                    {/* Mostrar descuento del cupón */}
                                    {appliedCoupon && appliedCoupon.short_description !== 'free_shipping' && (
                                        <div className="flex justify-between mb-2 text-pink">
                                            <span>Cupón {appliedCoupon.name}</span>
                                            <span className="font-bold">
                                                -{appliedCoupon.short_description === 'percentage' ? `${appliedCoupon.price}%` : `$${appliedCoupon.price.toLocaleString('es-AR')}`}
                                            </span>
                                        </div>
                                    )}
                                    {appliedCoupon && appliedCoupon.short_description === 'free_shipping' && (
                                        <div className="flex justify-between mb-2 text-pink">
                                            <span>Cupón {appliedCoupon.name}</span>
                                            <span className="font-bold">ENVÍO GRATIS</span>
                                        </div>
                                    )}

                                    {/* Mostrar descuento de transferencia si aplica */}
                                    {discount > 0 && paymentMethod === 'transferencia' && (
                                        <div className="flex justify-between mb-2 text-pink">
                                            <span>Descuento Transferencia (20%)</span>
                                            <span className="font-bold">-${(cartTotal * 0.20).toLocaleString('es-AR')}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between mb-4">
                                        <span className="text-gray-600">
                                            Entrega {shippingType === 'retiro' ? '(Acordar retiro)' : (selectedShipping ? `(${selectedShipping.provider})` : '')}
                                        </span>
                                        <span className="font-medium">
                                            {shippingType === 'retiro' || (appliedCoupon && appliedCoupon.short_description === 'free_shipping') ? 'Gratis' : (selectedShipping ? `$${shippingCost.toLocaleString('es-AR')}` : 'A calcular')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <span className="text-lg font-bold text-gray-800" style={{ fontSize: '1.125rem', color: '#1f2937' }}>Total Final</span>
                                        <span className="text-2xl font-bold text-pink" style={{ fontSize: '1.5rem' }}>${finalTotal.toLocaleString('es-AR')}</span>
                                    </div>
                                </div>

                                {shippingType === 'envio' && (
                                    <div className="mt-8 pt-6 border-t border-gray-100" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
                                        <ShippingCalculator
                                            onSelectShipping={setSelectedShipping}
                                            selectedProvider={selectedShipping?.provider}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transfer Modal */}
                {showTransferModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="bg-white rounded-2xl shadow-2xl relative transfer-modal-content" style={{ background: '#fff', padding: '20px 20px 30px 20px', borderRadius: '20px', maxWidth: '380px', width: '95%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '2px solid #FFD1DC', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button onClick={() => setShowTransferModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', zIndex: 10 }}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <div style={{ marginBottom: '25px', width: '100%', textAlign: 'center' }}>
                                <h3 className="text-2xl font-bold text-gray-800" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', width: '100%', textAlign: 'center' }}>¡Pedido Confirmado! ✓</h3>
                                <p style={{ color: '#6b7280', margin: '0 auto', maxWidth: '90%', textAlign: 'center', fontSize: '0.9rem' }}>
                                    {savedShippingType === 'retiro'
                                        ? "Solo falta que realices el pago y acordar retiro en General Rodríguez."
                                        : "Solo falta que realices el pago para que preparemos tu envío."}
                                </p>
                            </div>
                            <div className="bg-pink-50 rounded-xl" style={{ backgroundColor: 'rgba(255, 209, 220, 0.2)', padding: '20px', borderRadius: '16px', marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                <div style={{ marginBottom: '20px', textAlign: 'center', width: '100%' }}>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', textAlign: 'center' }}>Monto a transferir:</span>
                                    <span className="text-pink" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--pastel-pink)', textAlign: 'center', display: 'block' }}>${savedTotal.toLocaleString('es-AR')}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center', width: '100%' }}>
                                        <span style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '2px', textAlign: 'center' }}>CVU:</span>
                                        <span style={{ fontFamily: 'monospace', fontWeight: '500', color: '#1f2937', fontSize: '1rem', wordBreak: 'break-all', textAlign: 'center', display: 'block' }}>0000003100097797485299</span>
                                    </div>
                                    <div style={{ textAlign: 'center', width: '100%' }}>
                                        <span style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '2px', textAlign: 'center' }}>Alias:</span>
                                        <span style={{ fontFamily: 'monospace', fontWeight: '500', color: '#1f2937', fontSize: '1rem', textAlign: 'center', display: 'block' }}>m.flower</span>
                                    </div>
                                    <div style={{ textAlign: 'center', width: '100%' }}>
                                        <span style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '2px', textAlign: 'center' }}>Titular:</span>
                                        <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '1rem', textAlign: 'center', display: 'block' }}>Maria Florencia Da Costa Cruz</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '15px', padding: '0 10px', textAlign: 'center', width: '100%' }}>
                                Una vez realizada la transferencia, envíanos el comprobante por WhatsApp o por Mail.
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl" style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '12px', marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nuestro WhatsApp:</span>
                                    <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '1rem' }}>+54 9 11 4181-7424</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nuestro Email:</span>
                                    <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '1rem' }}>contacto.mflower@gmail.com</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const msg = `¡Hola Mflower! Acabo de hacer un pedido en la página web.%0A%0A*Mi Orden:* ${createdOrderId || ''}%0A*Nombre:* ${formData.nombre} ${formData.apellido}%0A*Monto a transferir:* $${savedTotal.toLocaleString('es-AR')}%0A%0A¡Te envío el comprobante de pago por acá!`;
                                    window.open(`https://wa.me/541141817424?text=${msg}`, '_blank');
                                    clearCart();
                                    window.location.href = '/';
                                }}
                                className="bg-pink text-white"
                                style={{ width: '100%', backgroundColor: '#25D366', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}
                            >
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                Enviar comprobante por WhatsApp
                            </button>
                            <button onClick={() => { setShowTransferModal(false); clearCart(); window.location.href = '/'; }} style={{ background: 'none', border: 'none', color: '#9ca3af', textDecoration: 'underline', fontSize: '0.9rem', cursor: 'pointer' }}>
                                Cerrar y volver a la tienda
                            </button>
                            {/* Spacer to force bottom space */}
                            <div style={{ height: '30px', width: '100%' }}></div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />

            <style>{`
                .checkout-layout {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 30px;
                    align-items: start;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group.full-width {
                    grid-column: 1 / -1;
                }
                .form-group label {
                    font-size: 0.9rem;
                    color: #4b5563;
                    font-weight: 500;
                }
                .form-group input {
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                    outline: none;
                }
                .form-group input:focus {
                    border-color: var(--pastel-pink);
                }
                .submit-btn {
                    width: 100%;
                    background-color: var(--pastel-pink);
                    color: white;
                    padding: 16px;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 1.1rem;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .submit-btn:hover:not(:disabled) {
                    background-color: #d18ab2;
                }
                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px dashed #f3f4f6;
                    font-size: 0.95rem;
                }
                .item-info {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    max-width: 70%;
                }
                .item-qty {
                    font-weight: 600;
                    color: #6b7280;
                }
                .item-name {
                    color: #374151;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .item-price {
                    font-weight: 600;
                    color: #1f2937;
                }
                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .payment-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .payment-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .payment-option.active {
                    border-color: var(--pastel-pink);
                    background-color: rgba(255, 209, 220, 0.05);
                }
                .payment-option input[type="radio"] {
                    accent-color: var(--pastel-pink);
                    width: 18px;
                    height: 18px;
                }
                .payment-option-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .min-h-screen { min-height: 100vh; }
                .flex-grow { flex-grow: 1; }
                .bg-background { background-color: #fafafa; }
                .text-pink { color: var(--pastel-pink); }
                .font-medium { font-weight: 500; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-4 { margin-bottom: 1rem; }
                .border-gray-200 { border-color: #e5e7eb; }

                .transfer-modal-content {
                    text-align: center !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    padding: 25px 25px 50px 25px !important;
                }
                .transfer-modal-content * {
                    text-align: center !important;
                }

                @media (max-width: 1024px) {
                    .checkout-layout {
                        display: flex;
                        flex-direction: column-reverse;
                        width: 100%;
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                        width: 100%;
                    }
                    .checkout-form-container, .checkout-summary-container {
                        width: 100%;
                        max-width: 100vw;
                        overflow-x: hidden;
                    }
                }
            `}</style>
        </div>
    );
}
