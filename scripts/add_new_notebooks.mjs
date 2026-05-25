import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Update Cuaderno A4 Cápsula Argentina -> Sol de Mayo
    const solDeMayoData = {
        name: "Cuaderno A4 Sol de Mayo sistema de discos",
        short_description: "A4, 90 hojas, diseño Sol de Mayo.",
        description: "Edición Limitada. Diseño exclusivo Sol de Mayo. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos.",
        price: 31900,
        image_url: "/images/mockup_sol_de_mayo_front.jpg",
        gallery: [
            "/images/mockup_sol_de_mayo_front.jpg",
            "/images/mockup_sol_de_mayo_back.jpg",
            "/images/mockup_arg_interior_1.png",
            "/images/mockup_arg_interior_2.png",
            "/images/mockup_arg_interior_3.png",
            "/images/mockup_arg_interior_4.png"
        ]
    };

    const { error: updErr } = await supabase
        .from('products')
        .update(solDeMayoData)
        .eq('name', 'Cuaderno A4 Cápsula Argentina');

    if (updErr) console.error("Error updating Sol de Mayo", updErr);
    else console.log("Sol de Mayo updated!");

    // 2. Insert Pinky Jirafa
    const jirafaData = {
        name: "Cuaderno A4 Pinky Jirafa sistema de discos",
        short_description: "A4, 90 hojas, diseño Pinky Jirafa.",
        description: "Diseño exclusivo Pinky Jirafa. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.",
        category: "Cuadernos A4", // Or maybe Cápsula Argentina? User just said "agrega estos de la jirafa". I'll put it in Cuadernos A4.
        price: 31900,
        stock: 10,
        low_stock_threshold: 3,
        image_url: "/images/mockup_jirafa_front.jpg",
        gallery: [
            "/images/mockup_jirafa_front.jpg",
            "/images/mockup_jirafa_back.jpg",
            "/images/mockup_interior_1.png",
            "/images/mockup_interior_2.png",
            "/images/mockup_interior_3.png",
            "/images/mockup_interior_4.png"
        ],
        is_best_seller: false
    };

    const { error: insErr } = await supabase.from('products').insert([jirafaData]);
    if (insErr) console.error("Error inserting Jirafa", insErr);
    else console.log("Pinky Jirafa inserted!");
}

run();
