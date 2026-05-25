import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Cuaderno A4 Yendo (gato en el inodoro)
    const yendoData = {
        name: "Cuaderno A4 Yendo sistema de discos",
        short_description: "A4, 90 hojas, diseño Yendo.",
        description: "Diseño exclusivo Yendo. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.",
        category: "Cuadernos A4",
        price: 31900,
        stock: 10,
        low_stock_threshold: 3,
        image_url: "/images/mockup_yendo_front.jpg",
        gallery: [
            "/images/mockup_yendo_front.jpg",
            "/images/mockup_yendo_back.jpg",
            "/images/mockup_interior_1.png",
            "/images/mockup_interior_2.png",
            "/images/mockup_interior_3.png",
            "/images/mockup_interior_4.png"
        ],
        is_best_seller: false
    };

    const { error: err1 } = await supabase.from('products').insert([yendoData]);
    if (err1) console.error("Error inserting Yendo", err1);
    else console.log("Yendo inserted.");

    // 2. Cuaderno A5 Candy (gato con chicle)
    const candyData = {
        name: "Cuaderno A5 Candy sistema de discos",
        short_description: "A5, 90 hojas, diseño Candy.",
        description: "Diseño exclusivo Candy. Contiene: Interior 90 hojas A5, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.",
        category: "Cuadernos A5",
        price: 26500,
        stock: 10,
        low_stock_threshold: 3,
        image_url: "/images/mockup_candy_front.jpg",
        gallery: [
            "/images/mockup_candy_front.jpg",
            "/images/mockup_candy_back.jpg",
            "/images/mockup_interior_1.png",
            "/images/mockup_interior_2.png",
            "/images/mockup_interior_3.png",
            "/images/mockup_interior_4.png"
        ],
        is_best_seller: false
    };

    const { error: err2 } = await supabase.from('products').insert([candyData]);
    if (err2) console.error("Error inserting Candy", err2);
    else console.log("Candy inserted.");
}

run();
