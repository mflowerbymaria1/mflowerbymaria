import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Swap images for Croissant
    const { data: croissantData, error: croissantErr } = await supabase.from('products').select('*').eq('name', 'Cuaderno A4 Croissant sistema de discos').single();
    if (croissantErr) console.error("Error fetching Croissant", croissantErr);
    else {
        // Swap first and second images in gallery
        const gallery = [...croissantData.gallery];
        const temp = gallery[0];
        gallery[0] = gallery[1];
        gallery[1] = temp;
        // image_url is the first image
        const { error: updErr } = await supabase.from('products').update({ gallery, image_url: gallery[0] }).eq('id', croissantData.id);
        if (updErr) console.error("Error updating Croissant", updErr);
        else console.log("Croissant updated.");
    }
}

run();
