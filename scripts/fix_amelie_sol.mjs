import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Swap Amelie images
    const { data: amelieData } = await supabase.from('products').select('*').eq('name', 'Cuaderno A4 Amelie sistema de discos').single();
    if (amelieData) {
        const gallery = [...amelieData.gallery];
        const temp = gallery[0];
        gallery[0] = gallery[1];
        gallery[1] = temp;
        await supabase.from('products').update({ gallery, image_url: gallery[0] }).eq('id', amelieData.id);
        console.log("Amelie updated in DB.");
    }

    // 2. Revert Sol de Mayo interiors back to arg_interior
    const { data: solData } = await supabase.from('products').select('*').eq('name', 'Cuaderno A4 Sol de Mayo sistema de discos').single();
    if (solData) {
        const newGallery = [
            solData.gallery[0],
            solData.gallery[1],
            '/images/mockup_arg_interior_1.png',
            '/images/mockup_arg_interior_2.png',
            '/images/mockup_arg_interior_3.png',
            '/images/mockup_arg_interior_4.png'
        ];
        await supabase.from('products').update({ gallery: newGallery }).eq('id', solData.id);
        console.log("Sol de Mayo interiors reverted in DB.");
    }
}

run();
