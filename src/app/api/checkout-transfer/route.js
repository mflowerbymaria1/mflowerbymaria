import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOrderNotificationAdmin, sendOrderNotificationCustomer } from '@/lib/email';

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, payer, shippingCost, shippingType, finalTotal, couponCode } = body;

        let finalNotes = payer.notas || '';

        // Validate and apply coupon in backend to ensure security
        let appliedCoupon = null;
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
                }
            }
        }

        // Create the order in Supabase
        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                customer_name: `${payer.nombre} ${payer.apellido}`,
                customer_email: payer.email,
                customer_phone: payer.telefono,
                shipping_address: shippingType === 'retiro' ? 'Retiro en sucursal' : JSON.stringify({ direccion: payer.direccion, ciudad: payer.ciudad, telefono: payer.telefono }),
                shipping_method: shippingType,
                payment_status: 'pending',
                total_amount: finalTotal,
                items: items,
                notes: finalNotes || null
            })
            .select()
            .single();

        if (error) {
            console.error('Error inserting order:', error);
            return NextResponse.json({ success: false, error: 'No se pudo guardar la orden.' }, { status: 500 });
        }

        // Send email notification to admin and customer asynchronously
        if (order) {
            // Decrement coupon stock
            if (appliedCoupon) {
                supabase.from('products')
                    .update({ stock: appliedCoupon.stock - 1 })
                    .eq('id', appliedCoupon.id)
                    .then(() => console.log('Coupon stock decremented'))
                    .catch(err => console.error('Error decrementing coupon stock:', err));
            }

            const emailData = { ...order, payment_method: 'transferencia' };
            sendOrderNotificationAdmin(emailData).catch(err => console.error("Email notification admin error:", err));
            sendOrderNotificationCustomer(emailData).catch(err => console.error("Email notification customer error:", err));
        }

        return NextResponse.json({
            success: true,
            orderId: order.id
        });

    } catch (error) {
        console.error('Error in checkout-transfer:', error);
        return NextResponse.json({ success: false, error: 'Hubo un error al procesar el pedido.' }, { status: 500 });
    }
}
