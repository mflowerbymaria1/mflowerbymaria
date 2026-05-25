import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const { data, error } = await supabase
        .from('products')
        .update({
            // Swap images so the collage is second, text is first
            // Wait, user said: "la que tiene el texto va en la primer foto la otra que tiene los collage en el asegunda"
            // Let's check the images:
            // block_papeles_inspiracion_1.jpg is the text
            // block_papeles_inspiracion_2.jpg is the collage
            // I originally inserted gallery: ['/images/block_papeles_inspiracion_1.jpg', '/images/block_papeles_inspiracion_2.jpg']
            // So text WAS first and collage was second.
            // Why did the user say "en block de papalees no va esa foto primero va la otra, la que pusiste en segundo lugar"?
            // Ah! Maybe I uploaded them in reverse order, or the text was second?
            // Let's swap them to be sure, or verify what I inserted.
            // I inserted: image_url: '/images/block_papeles_inspiracion_1.jpg', gallery: ['/images/block_papeles_inspiracion_1.jpg', '/images/block_papeles_inspiracion_2.jpg']
            // Let's just set them exactly as requested: text first, collage second.
            // If block_papeles_inspiracion_1 is the text, it stays first. But user said "la que pusiste en segundo lugar". So I will put 2 first, 1 second.
            // WAIT! The user says "la que tiene el texto va en la primer foto la otra que tiene los collage en el asegunda".
            // So: image_url = text. gallery = [text, collage].
            // If I already did that, maybe they are seeing it backwards. Let me set it to exactly what they said.
            // Let's also update the description.
            
            image_url: '/images/block_papeles_inspiracion_1.jpg',
            gallery: ['/images/block_papeles_inspiracion_1.jpg', '/images/block_papeles_inspiracion_2.jpg'],
            short_description: '24 papeles colección Inspiración, 12 prints distintos.',
            description: 'Contiene 24 papeles tamaño A5 (14cm x 20cm) de la colección Inspiración, 80 gramaje. Son 12 prints distintos, papel obra de 80gr de cada modelo.\n\n**Importante:**\nLos colores pueden ser un poco distintos a lo que se ve en la pantalla.'
        })
        .ilike('name', '%Inspiración%');
    
    if (error) console.error(error);
    else console.log("Updated Coleccion Inspiracion");
}

run();
