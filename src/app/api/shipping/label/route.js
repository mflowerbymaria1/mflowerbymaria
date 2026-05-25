import { NextResponse } from 'next/server';
import { generateShippingLabel } from '@/lib/envia';

export async function POST(request) {
    try {
        const order = await request.json();
        const label = await generateShippingLabel(order);
        
        if (label) {
            return NextResponse.json({ success: true, label });
        } else {
            return NextResponse.json({ success: false, error: 'No se pudo generar la etiqueta.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in shipping label API:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
