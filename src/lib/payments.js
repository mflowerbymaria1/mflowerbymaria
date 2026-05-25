import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración de Mercado Pago con el Access Token del .env
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

/**
 * Crea una preferencia de pago en Mercado Pago
 * @param {Array} cartItems - Lista de productos en el carrito
 * @param {String} paymentMethod - 'mercadopago' o 'transferencia'
 * @param {Object} orderData - Datos adicionales de la orden (opcional)
 */
export async function createPreference(cartItems, paymentMethod, orderId) {
    // Calculamos el total (podemos aplicar descuentos aquí si es transferencia)
    const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    
    let discount = 0;
    if (paymentMethod === 'transferencia') {
        discount = total * 0.20; // 20% OFF Transferencia (esto se maneja fuera de MP generalmente, pero lo dejamos por consistencia)
    }

    const finalTotal = total - discount;

    try {
        const preference = new Preference(client);
        
        const body = {
            items: cartItems.map(item => ({
                id: item.id,
                title: item.name,
                unit_price: Number(item.price),
                quantity: Number(item.quantity),
                currency_id: 'ARS'
            })),
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
                failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/error`,
                pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/pending`,
            },
            auto_return: 'approved',
            notification_url: `${process.env.MP_WEBHOOK_URL}/api/webhooks/mercadopago`, // Necesitarás configurar esto
            external_reference: orderId, // Guardamos el ID de la orden de Supabase aquí
        };

        const result = await preference.create({ body });

        return {
            id: result.id,
            init_point: result.init_point,
            finalTotal
        };
    } catch (error) {
        console.error('Error creando preferencia de Mercado Pago:', error);
        throw error;
    }
}
