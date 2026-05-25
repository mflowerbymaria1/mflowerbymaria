import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Delete Cuaderno A4 sistema de discos (the 33.000 one)
    const { error: delErr } = await supabase.from('products').delete().eq('name', 'Cuaderno A4 sistema de discos');
    if (delErr) console.error("Error deleting generic notebook", delErr);

    // 2. Re-insert Cuaderno A4 Pink Buenos Aires sistema de discos (the 31.900 one)
    const pinkBuenosAires = {
        name: "Cuaderno A4 Pink Buenos Aires sistema de discos",
        short_description: "A4, 90 hojas, anillado inteligente.",
        description: "Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores (no se pueden elegir).",
        category: "Cápsula Argentina",
        price: 31900,
        stock: 10,
        low_stock_threshold: 3,
        image_url: "/images/mockup_combinado_ia.png",
        gallery: [
            "/images/mockup_combinado_ia.png",
            "/images/mockup_back_cover.png",
            "/images/mockup_interior_1.png",
            "/images/mockup_interior_2.png",
            "/images/mockup_interior_3.png",
            "/images/mockup_interior_4.png"
        ],
        is_best_seller: true
    };

    const { error: insErr } = await supabase.from('products').insert([pinkBuenosAires]);
    if (insErr) console.error("Error inserting Pink Buenos Aires", insErr);
    else console.log("Pink Buenos Aires restored and generic deleted.");
}

run();
