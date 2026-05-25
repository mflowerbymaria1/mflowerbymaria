import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const prettyGirlsData = {
        name: "Cuaderno A5 Pretty Girls sistema de discos",
        short_description: "A5, 90 hojas, diseño Pretty Girls.",
        description: "Diseño exclusivo Pretty Girls. Contiene: Interior 90 hojas A5, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.",
        category: "Cuadernos A5",
        price: 26500, // standard A5 notebook price I've seen before or similar
        stock: 10,
        low_stock_threshold: 3,
        image_url: "/images/mockup_pretty_girls_front.jpg",
        gallery: [
            "/images/mockup_pretty_girls_front.jpg",
            "/images/mockup_pretty_girls_back.jpg",
            "/images/mockup_interior_1.png",
            "/images/mockup_interior_2.png",
            "/images/mockup_interior_3.png",
            "/images/mockup_interior_4.png"
        ],
        is_best_seller: false
    };

    const { error: ins1 } = await supabase.from('products').insert([prettyGirlsData]);
    if (ins1) console.error("Error inserting Pretty Girls", ins1);
    else console.log("Pretty Girls inserted.");

    const coffeeTimeData = {
        name: "Cuaderno A4 Coffee Time sistema de discos",
        short_description: "A4, 90 hojas, diseño Coffee Time.",
        description: "Diseño exclusivo Coffee Time. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.",
        category: "Cuadernos A4",
        price: 31900, // A4 price
        stock: 10,
        low_stock_threshold: 3,
        image_url: "/images/mockup_coffee_time_front.jpg",
        gallery: [
            "/images/mockup_coffee_time_front.jpg",
            "/images/mockup_interior_1.png",
            "/images/mockup_interior_2.png",
            "/images/mockup_interior_3.png",
            "/images/mockup_interior_4.png"
        ],
        is_best_seller: false
    };

    const { error: ins2 } = await supabase.from('products').insert([coffeeTimeData]);
    if (ins2) console.error("Error inserting Coffee Time", ins2);
    else console.log("Coffee Time inserted.");
}

run();
