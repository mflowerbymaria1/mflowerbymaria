import { NextResponse } from 'next/server';
import { getShippingRates } from '@/lib/envia';

export async function POST(request) {
    try {
        const { destination } = await request.json();
        const rates = await getShippingRates(destination);
        
        return NextResponse.json({ success: true, rates });
    } catch (error) {
        console.error('Error in shipping rates API:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
