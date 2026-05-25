import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Sol de Mayo (white rings = stamps)
    const { data: solData } = await supabase.from('products').select('*').eq('name', 'Cuaderno A4 Sol de Mayo sistema de discos').single();
    if (solData) {
        const newGallery = [
            solData.gallery[0],
            solData.gallery[1],
            '/images/mockup_stamps_interior_1.png',
            '/images/mockup_stamps_interior_2.png',
            '/images/mockup_stamps_interior_3.png',
            '/images/mockup_stamps_interior_4.png'
        ];
        await supabase.from('products').update({ gallery: newGallery }).eq('id', solData.id);
        console.log("Sol de Mayo updated in DB.");
    }

    // 2. Croissant (black rings = arg)
    const { data: croissantData } = await supabase.from('products').select('*').eq('name', 'Cuaderno A4 Croissant sistema de discos').single();
    if (croissantData) {
        const newGallery = [
            croissantData.gallery[0],
            croissantData.gallery[1],
            '/images/mockup_arg_interior_1.png',
            '/images/mockup_arg_interior_2.png',
            '/images/mockup_arg_interior_3.png',
            '/images/mockup_arg_interior_4.png'
        ];
        await supabase.from('products').update({ gallery: newGallery }).eq('id', croissantData.id);
        console.log("Croissant updated in DB.");
    }
}

run();
