import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { targetZip } = await request.json();

        // Origin is always General Rodriguez (CP: 1748)
        const originZip = '1748';
        const apiKey = process.env.ENVIA_API_TOKEN;

        const enviaPayload = {
            "origin": {
                "name": "M•flower by Maria",
                "company": "M•flower by Maria",
                "email": "contacto@mflowerbymaria.com",
                "phone": "1100000000",
                "street": "Centro",
                "number": "123",
                "district": "Centro",
                "city": "General Rodriguez",
                "state": "BA",
                "country": "AR",
                "postalCode": originZip,
                "category": 1
            },
            "destination": {
                "name": "Cliente",
                "company": "",
                "email": "cliente@email.com",
                "phone": "1100000000",
                "street": "Calle",
                "number": "123",
                "district": "",
                "city": "Ciudad",
                "state": "BA",
                "country": "AR",
                "postalCode": targetZip,
                "category": 1
            },
            "packages": [
                {
                    "content": "Productos",
                    "amount": 1,
                    "type": "box",
                    "dimensions": { "length": 25, "width": 20, "height": 10 },
                    "weight": 1,
                    "insurance": 0,
                    "declaredValue": 0,
                    "weightUnit": "KG",
                    "lengthUnit": "CM"
                }
            ],
            "shipment": {
                "carrier": "correoargentino",
                "type": 1
            },
            "settings": {
                "currency": "ARS"
            }
        };

        const enviaRes = await fetch("https://api.envia.com/ship/rate/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(enviaPayload)
        });

        const data = await enviaRes.json();

        // Check if Envia returned valid rates
        if (data.meta !== 'rate' || !data.data || data.data.length === 0) {
            return NextResponse.json({ success: false, error: 'No se encontraron tarifas.' });
        }

        // Map Envia's response to our frontend's expected format
        const quotes = data.data.map(rate => ({
            provider: `${rate.carrierDescription} ${rate.serviceDescription}`,
            price: rate.totalPrice,
            currency: rate.currency,
            days: rate.deliveryEstimate || "3-5 días hábiles"
        }));

        return NextResponse.json({
            success: true,
            quotes: quotes
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to calculate shipping' }, { status: 500 });
    }
}
