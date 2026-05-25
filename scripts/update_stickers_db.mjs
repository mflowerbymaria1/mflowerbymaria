import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Update Galletitas
    const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update({
            name: 'Plancha de stickers troquelados Galletitas',
            short_description: 'Stickers autoadhesivos troquelados diseño Galletitas.',
            description: 'Papel autoadhesivo, brillante. Personalizá todas tus cosas con nuestras planchas de galletitas; al ser troqueladas, es mucho más fácil, listas para despegar y pegar donde más te guste. Perfectos para papel, cartón, libretas, tu journal ❤️. No son a prueba de agua.\n\n**Importante:**\nLos colores pueden ser un poco distintos a lo que se ve en la pantalla.',
            image_url: '/images/stickers_galletitas.jpg',
            gallery: ['/images/stickers_galletitas.jpg'],
            category: 'Stickers & Varios'
        })
        .eq('id', 'd4b09181-6d59-430a-a594-2e6e942a41f9');
    
    if (updateError) console.error("Error updating galletitas:", updateError);
    else console.log("Updated Galletitas");

    // 2. Insert Caritas
    const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([{
            name: 'Plancha de stickers troquelados Caritas',
            short_description: 'Stickers autoadhesivos troquelados diseño Caritas.',
            description: 'Papel autoadhesivo, brillante. Personalizá todas tus cosas con nuestras planchas de caritas sonrientes; al ser troqueladas, es mucho más fácil, listas para despegar y pegar donde más te guste. Perfectos para papel, cartón, libretas, tu journal ❤️. No son a prueba de agua.\n\n**Importante:**\nLos colores pueden ser un poco distintos a lo que se ve en la pantalla.',
            category: 'Stickers & Varios',
            price: 8500,
            stock: 10,
            image_url: '/images/stickers_caritas.jpg',
            gallery: ['/images/stickers_caritas.jpg']
        }]);

    if (insertError) console.error("Error inserting caritas:", insertError);
    else console.log("Inserted Caritas");
}

run();
