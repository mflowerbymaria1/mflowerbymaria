import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const { error: err1 } = await supabase
        .from('products')
        .update({ 
            // Put the collage (image 2) first, and the text (image 1) second
            image_url: '/images/block_papeles_inspiracion_2.jpg',
            gallery: ['/images/block_papeles_inspiracion_2.jpg', '/images/block_papeles_inspiracion_1.jpg']
        })
        .ilike('name', '%Inspiración%');
    
    if (err1) console.error(err1);
    else console.log("Swapped Inspiracion images");
}

run();
