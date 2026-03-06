/**
 * Mock Mercado Pago Integration
 */
export async function createPreference(cartItems, paymentMethod) {
    const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price.replace('.', '')) * item.quantity), 0);

    let discount = 0;
    if (paymentMethod === 'transferencia') {
        discount = total * 0.20; // 20% OFF Transferencia
    }

    const finalTotal = total - discount;

    console.log(`[Mercado Pago] Creating preference for total: $${total}`);
    if (discount > 0) {
        console.log(`[Mercado Pago] Applied 20% transfer discount: -$${discount}. Final: $${finalTotal}`);
    }

    // Mock Preference ID
    return {
        id: "mock_preference_id_12345",
        init_point: "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock_preference_id_12345",
        finalTotal
    };
}
