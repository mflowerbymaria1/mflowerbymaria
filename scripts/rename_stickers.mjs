import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Update Galletitas -> Cositas ricas
    const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update({
            name: 'Plancha de stickers troquelados Cositas ricas',
            short_description: 'Stickers autoadhesivos troquelados diseño Cositas ricas.',
            description: 'Papel autoadhesivo, brillante. Personalizá todas tus cosas con nuestras planchas de cositas ricas; al ser troqueladas, es mucho más fácil, listas para despegar y pegar donde más te guste. Perfectos para papel, cartón, libretas, tu journal ✨🌈. No son a prueba de agua.\n\n**Importante:**\nLos colores pueden ser un poco distintos a lo que se ve en la pantalla.'
        })
        .ilike('name', '%Galletitas%');
    
    if (updateError) console.error("Error updating Cositas ricas:", updateError);
    else console.log("Updated Cositas ricas");

    // 2. Update Caritas -> Carita feliz
    const { data: updateData2, error: updateError2 } = await supabase
        .from('products')
        .update({
            name: 'Plancha de stickers troquelados Carita feliz',
            short_description: 'Stickers autoadhesivos troquelados diseño Carita feliz.',
            description: 'Papel autoadhesivo, brillante. Personalizá todas tus cosas con nuestras planchas de carita feliz; al ser troqueladas, es mucho más fácil, listas para despegar y pegar donde más te guste. Perfectos para papel, cartón, libretas, tu journal ✨🌈. No son a prueba de agua.\n\n**Importante:**\nLos colores pueden ser un poco distintos a lo que se ve en la pantalla.'
        })
        .ilike('name', '%Caritas%');

    if (updateError2) console.error("Error updating Carita feliz:", updateError2);
    else console.log("Updated Carita feliz");
}

run();
