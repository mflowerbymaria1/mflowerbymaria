import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No se envió ningún archivo.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload to Supabase Storage bucket named 'productos'
        const { data, error } = await supabase.storage
            .from('productos')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('productos')
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl }, { status: 200 });

    } catch (error) {
        console.error("Error en el endpoint de upload:", error);
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
    }
}
