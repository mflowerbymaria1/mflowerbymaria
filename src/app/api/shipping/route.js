import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { targetZip } = await request.json();

        // Origin is always General Rodriguez (CP: 1748)
        const originZip = '1748';
        const apiKey = '59019134c5fa1d9f344810d5c611c3e1ab354177d375ad4a18925f7e1fce5902';

        // NOTE: In a real production app, you would construct the full payload
        // with package dimensions, weight, currency, etc. required by envia.com's /ship/generate/ endpoint.
        // For this frontend implementation, we simulate the API call delay and
        // return mock varying prices based on the CP to demonstrate the UI behavior.

        // Simulating API network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        let cost = 8500;
        let method = "Correo Argentino a Domicilio";

        if (targetZip === originZip) {
            cost = 2500;
            method = "Moto Mensajería (Local)";
        } else if (targetZip.startsWith('1')) {
            // CABA y GBA
            cost = 4500;
            method = "Correo Argentino a Domicilio";
        } else if (targetZip.startsWith('9')) {
            // Sur
            cost = 11500;
            method = "Andreani a Domicilio";
        }

        return NextResponse.json({
            success: true,
            quotes: [
                {
                    provider: method,
                    price: cost,
                    currency: "ARS",
                    days: targetZip === originZip ? "1 día hábil" : "3-5 días hábiles"
                }
            ]
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to calculate shipping' }, { status: 500 });
    }
}
