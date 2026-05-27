import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN
});

export async function POST(request) {
    try {
        const { items, customerEmail } = await request.json();

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: items.map(item => ({
                    title: item.name,
                    quantity: item.quantity,
                    unit_price: Number(item.price),
                    currency_id: 'ARS'
                })),
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_BASE_URL}/gracias`,
                    failure: `${process.env.NEXT_PUBLIC_BASE_URL}/error`,
                    pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pendiente`
                },
                auto_return: 'approved',
                notification_url: `${process.env.MP_WEBHOOK_URL}/api/webhooks/mercadopago`,
                metadata: {
                    customer_email: customerEmail
                }
            }
        });

        return Response.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
        console.error('Error creando preferencia de Mercado Pago:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
