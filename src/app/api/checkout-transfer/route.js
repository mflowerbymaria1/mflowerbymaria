import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
                shipping_type: shippingType,
                shipping_cost: shippingCost,
                payment_method: 'transferencia',
                payment_status: 'pending',
                total: finalTotal,
                items: items
            })
            .select()
            .single();

        if (error) {
            console.error('Error inserting order:', error);
            return NextResponse.json({ success: false, error: 'No se pudo guardar la orden.' }, { status: 500 });
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
