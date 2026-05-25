import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // Delete all existing "Repuestos"
    const { data: repuestos, error: fetchErr } = await supabase.from('products').select('id').eq('category', 'Repuestos');
    if (fetchErr) { console.error("Error fetching", fetchErr); return; }

    const idsToDelete = repuestos.map(r => r.id);
    if (idsToDelete.length > 0) {
        const { error: delErr } = await supabase.from('products').delete().in('id', idsToDelete);
        if (delErr) { console.error("Error deleting", delErr); return; }
        console.log(`Deleted ${idsToDelete.length} repuestos.`);
    }

    // Insert the 3 base repuestos
    const newRepuestos = [
        {
            name: "Repuesto Hojas A4",
            category: "Repuestos",
            short_description: "Repuesto A4, 100 hojas, papel de alta calidad.",
            description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel ecológico de 80 gr. Elegí el tipo de hoja y papel que prefieras.",
            price: 16000,
            image_url: "/images/repuestos_svg/a4_blanco_rayadas.svg",
            gallery: ["/images/repuestos_svg/a4_blanco_rayadas.svg", "/images/repuestos_svg/a4_natural_rayadas.svg"],
            is_best_seller: false
        },
        {
            name: "Repuesto Hojas A5",
            category: "Repuestos",
            short_description: "Repuesto A5, 100 hojas, papel de alta calidad.",
            description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel ecológico de 90 gr. Elegí el tipo de hoja y papel que prefieras.",
            price: 13500,
            image_url: "/images/repuestos_svg/a5_blanco_rayadas.svg",
            gallery: ["/images/repuestos_svg/a5_blanco_rayadas.svg", "/images/repuestos_svg/a5_natural_rayadas.svg"],
            is_best_seller: false
        },
        {
            name: "Repuesto Fichas N° 3",
            category: "Repuestos",
            short_description: "100 fichas rayadas para fichero N° 3.",
            description: "Repuesto de fichero N° 3, contiene 100 fichas rayadas en papel de 120 gr. Elegí el tipo de papel que prefieras.",
            price: 10900,
            image_url: "/images/repuestos_svg/fichas_blanco_rayadas.svg",
            gallery: ["/images/repuestos_svg/fichas_blanco_rayadas.svg", "/images/repuestos_svg/fichas_natural_rayadas.svg"],
            is_best_seller: false
        }
    ];

    const { error: insErr } = await supabase.from('products').insert(newRepuestos);
    if (insErr) { console.error("Error inserting", insErr); return; }
    console.log("Inserted 3 base repuestos successfully.");
}

run();
