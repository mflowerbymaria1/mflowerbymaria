import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

export async function POST(request) {
    const body = await request.json();
    const { type, data } = body;

    console.log(`[MP Webhook] Received ${type} notification`);

    // Solo nos interesan los pagos
    if (type === 'payment') {
        const paymentId = data.id;
        
        try {
            const payment = new Payment(client);
            const paymentDetails = await payment.get({ id: paymentId });

            const status = paymentDetails.status;
            const externalReference = paymentDetails.external_reference; // Este es nuestro orderId

            console.log(`[MP Webhook] Payment ${paymentId} status: ${status} for Order: ${externalReference}`);

            if (externalReference) {
                let finalStatus = status;
                if (['cancelled', 'rejected', 'refunded', 'charged_back'].includes(status)) {
                    finalStatus = 'Anulado';
                }

                // Actualizamos el estado del pedido en Supabase
                // El trigger 'on_payment_approved' en SQL se encargará de bajar el stock si status === 'approved'
                const { error } = await supabase
                    .from('orders')
                    .update({ 
                        payment_status: finalStatus,
                        mercadopago_id: paymentId.toString()
                    })
                    .eq('id', externalReference);

                if (error) {
                    console.error('[MP Webhook] Error updating Supabase order:', error);
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }
                
                console.log(`[MP Webhook] Order ${externalReference} updated successfully to ${status}`);
            }

        } catch (error) {
            console.error('[MP Webhook] Error fetching payment details from MP:', error);
            return NextResponse.json({ error: 'MP API error' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
