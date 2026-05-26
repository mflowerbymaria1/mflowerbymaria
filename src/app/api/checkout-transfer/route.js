import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOrderNotificationAdmin, sendOrderNotificationCustomer } from '@/lib/email';

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, payer, shippingCost, shippingType, finalTotal } = body;

        // Create the order in Supabase
        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                customer_name: `${payer.nombre} ${payer.apellido}`,
                customer_email: payer.email,
                customer_phone: payer.telefono,
                shipping_address: payer.direccion || 'Retiro en sucursal',
                shipping_method: shippingType,
                payment_status: 'pending',
                total_amount: finalTotal,
                items: items
            })
            .select()
            .single();

        if (error) {
            console.error('Error inserting order:', error);
            return NextResponse.json({ success: false, error: 'No se pudo guardar la orden.' }, { status: 500 });
        }

        // Send email notification to admin and customer asynchronously
        if (order) {
            sendOrderNotificationAdmin(order).catch(err => console.error("Email notification admin error:", err));
            sendOrderNotificationCustomer(order).catch(err => console.error("Email notification customer error:", err));
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
