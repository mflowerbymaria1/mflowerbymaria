import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Swap images for Pinky Jirafa
    const { data: jirafaData, error: jirafaErr } = await supabase.from('products').select('*').eq('name', 'Cuaderno A4 Pinky Jirafa sistema de discos').single();
    if (jirafaErr) console.error("Error fetching Jirafa", jirafaErr);
    else {
        // Swap first and second images in gallery
        const gallery = [...jirafaData.gallery];
        const temp = gallery[0];
        gallery[0] = gallery[1];
        gallery[1] = temp;
        // image_url is the first image
        const { error: updErr } = await supabase.from('products').update({ gallery, image_url: gallery[0] }).eq('id', jirafaData.id);
        if (updErr) console.error("Error updating Jirafa", updErr);
        else console.log("Jirafa updated.");
    }

    // 2. Fichero N° 3 Maleva replacing Fichero N° 3 Cápsula Argentina
    const malevaData = {
        name: "Fichero N° 3 Maleva",
        short_description: "Fichero de estudio diseño Maleva.",
        description: "Diseño exclusivo Maleva. Complemento ideal para organizar tus fichas de estudio o notas rápidas. Tamaño fichero N° 3, viene con 3 separadores, sistema anillado de discos inteligente.",
        price: 28000,
        image_url: "/images/mockup_maleva_front.jpg",
        gallery: [
            "/images/mockup_maleva_front.jpg",
            "/images/mockup_maleva_back.jpg"
        ],
        category: "Stickers & Varios" // Put it in the general category, since it's not explicitly capsula argentina or maybe it is?
    };
    const { error: malevaErr } = await supabase.from('products').update(malevaData).eq('name', 'Fichero N° 3 Cápsula Argentina');
    if (malevaErr) console.error("Error updating Maleva", malevaErr);
    else console.log("Maleva updated.");

    // 3. Cuaderno A4 Croissant
    const croissantData = {
        name: "Cuaderno A4 Croissant sistema de discos",
        short_description: "A4, 90 hojas, diseño Croissant.",
        description: "Diseño exclusivo Croissant. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.",
        category: "Cuadernos A4",
        price: 31900,
        stock: 10,
        low_stock_threshold: 3,
        image_url: "/images/mockup_croissant_front.jpg",
        gallery: [
            "/images/mockup_croissant_front.jpg",
            "/images/mockup_croissant_back.jpg",
            "/images/mockup_interior_1.png",
            "/images/mockup_interior_2.png",
            "/images/mockup_interior_3.png",
            "/images/mockup_interior_4.png"
        ],
        is_best_seller: false
    };
    const { error: insErr } = await supabase.from('products').insert([croissantData]);
    if (insErr) console.error("Error inserting Croissant", insErr);
    else console.log("Croissant inserted.");
}

run();
