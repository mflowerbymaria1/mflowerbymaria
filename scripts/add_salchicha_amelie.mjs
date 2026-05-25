import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // Fichero n3 perro salchicha
    const salchichaData = {
        name: "Fichero N° 3 Perro Salchicha",
        short_description: "Fichero de estudio diseño Perro Salchicha.",
        description: "Diseño exclusivo Perro Salchicha. Complemento ideal para organizar tus fichas de estudio o notas rápidas. Tamaño fichero N° 3, viene con 3 separadores, sistema anillado de discos inteligente.",
        price: 28000,
        image_url: "/images/mockup_salchicha_front.jpg",
        gallery: [
            "/images/mockup_salchicha_front.jpg",
            "/images/mockup_salchicha_back.jpg"
        ],
        category: "Stickers & Varios"
    };

    const { error: ins1 } = await supabase.from('products').insert([salchichaData]);
    if (ins1) console.error("Error inserting Salchicha", ins1);
    else console.log("Salchicha inserted.");

    // Cuaderno A4 Amelie
    const amelieData = {
        name: "Cuaderno A4 Amelie sistema de discos",
        short_description: "A4, 90 hojas, diseño Amelie.",
        description: "Diseño exclusivo Amelie. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.",
        category: "Cuadernos A4",
        price: 31900,
        stock: 10,
        low_stock_threshold: 3,
        image_url: "/images/mockup_amelie_front.jpg",
        gallery: [
            "/images/mockup_amelie_front.jpg",
            "/images/mockup_amelie_back.jpg",
            "/images/mockup_interior_1.png",
            "/images/mockup_interior_2.png",
            "/images/mockup_interior_3.png",
            "/images/mockup_interior_4.png"
        ],
        is_best_seller: false
    };

    const { error: ins2 } = await supabase.from('products').insert([amelieData]);
    if (ins2) console.error("Error inserting Amelie", ins2);
    else console.log("Amelie inserted.");
}

run();
