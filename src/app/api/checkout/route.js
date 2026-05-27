import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { sendOrderNotificationAdmin, sendOrderNotificationCustomer } from '@/lib/email';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, payer, shippingCost, shippingType, finalTotal, couponCode } = body;

        let finalNotes = payer.notas || '';
        let actualShippingCost = shippingCost;
        let cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Validate and apply coupon in backend to ensure security
        let appliedCoupon = null;
        let discountAmount = 0;

        if (couponCode) {
            const { data: coupon, error: couponError } = await supabase
                .from('products')
                .select('*')
                .eq('category', 'COUPON')
                .eq('name', couponCode)
                .single();
                
            if (!couponError && coupon && coupon.stock > 0) {
                // Check if already used
                const { data: pastOrders } = await supabase
                    .from('orders')
                    .select('notes')
                    .eq('customer_email', payer.email);
                    
                const alreadyUsed = pastOrders?.some(o => o.notes?.includes(`CUPÓN USADO: ${coupon.name}`));
                if (!alreadyUsed) {
                    appliedCoupon = coupon;
                    finalNotes = finalNotes ? `${finalNotes}\n\nCUPÓN USADO: ${coupon.name}` : `CUPÓN USADO: ${coupon.name}`;

                    // Calculate discount
                    if (coupon.short_description === 'percentage') {
                        discountAmount = (cartTotal * (coupon.price / 100));
                    } else if (coupon.short_description === 'fixed') {
                        discountAmount = coupon.price;
                    } else if (coupon.short_description === 'free_shipping') {
                        actualShippingCost = 0;
                    }
                }
            }
        }

        // Map frontend cart items to Mercado Pago preference items
        const currentItems = items.map(item => ({
            id: String(item.id),
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'ARS',
        }));

        if (actualShippingCost > 0) {
            currentItems.push({
                id: 'shipping',
                title: 'Costo de Envío',
                unit_price: Number(actualShippingCost),
                quantity: 1,
                currency_id: 'ARS',
            });
        }

        if (discountAmount > 0) {
            currentItems.push({
                id: 'discount',
                title: `Descuento Cupón (${appliedCoupon.name})`,
                unit_price: -Number(discountAmount),
                quantity: 1,
                currency_id: 'ARS',
            });
        }

        // 1. Create order in Supabase BEFORE going to MercadoPago
        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                customer_name: `${payer.nombre} ${payer.apellido}`,
                customer_email: payer.email,
                customer_phone: payer.telefono,
                shipping_address: shippingType === 'retiro' ? 'Retiro en sucursal' : JSON.stringify({ direccion: payer.direccion, ciudad: payer.ciudad, telefono: payer.telefono }),
                shipping_method: shippingType || 'envio',
                payment_status: 'pending',
                total_amount: finalTotal || currentItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0),
                items: items,
                notes: finalNotes || null
            })
            .select()
            .single();

        if (error) {
            console.error('Error inserting order for MP:', error);
            return NextResponse.json({ success: false, error: 'No se pudo guardar la orden.' }, { status: 500 });
        }

        // Send email notification to admin and customer asynchronously (don't await)
        if (order) {
            // Decrement coupon stock
            if (appliedCoupon) {
                supabase.from('products')
                    .update({ stock: appliedCoupon.stock - 1 })
                    .eq('id', appliedCoupon.id)
                    .then(() => console.log('Coupon stock decremented'))
                    .catch(err => console.error('Error decrementing coupon stock:', err));
            }

            const emailData = { ...order, payment_method: 'mercadopago' };
            sendOrderNotificationAdmin(emailData).catch(err => console.error("Email notification admin error:", err));
            sendOrderNotificationCustomer(emailData).catch(err => console.error("Email notification customer error:", err));
        }

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: currentItems,
                payer: {
                    name: payer.nombre,
                    surname: payer.apellido,
                    email: payer.email,
                    phone: {
                        number: payer.telefono
                    },
                    address: {
                        street_name: payer.direccion,
                    }
                },
                statement_descriptor: 'MFLOWERBYMARIA',
                external_reference: order.id,
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_BASE_URL}/gracias`,
                    failure: `${process.env.NEXT_PUBLIC_BASE_URL}/error`,
                    pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pendiente`
                },
                auto_return: 'approved',
                notification_url: `${process.env.MP_WEBHOOK_URL}/api/webhooks/mercadopago`
            }
        });

        // The URL the user needs to visit to pay
        return NextResponse.json({
            success: true,
            init_point: response.init_point
        });

    } catch (error) {
        console.error('Error creating Mercado Pago preference:', error);
        return NextResponse.json({ success: false, error: 'Hubo un error al crear la preferencia de pago.' }, { status: 500 });
    }
}
