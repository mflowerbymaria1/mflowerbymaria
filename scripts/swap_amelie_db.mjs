import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('C:\\Users\\Leandro\\.gemini\\antigravity\\scratch\\mflowerbymaria\\.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function swapAmelie() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('name', 'Cuaderno A4 Amelie sistema de discos')
        .single();
        
    if (error) {
        console.error("Error fetching", error);
        return;
    }
    
    // Swap the first two images in the array if there are at least two
    let images = data.images || [];
    if (images.length >= 2) {
        const temp = images[0];
        images[0] = images[1];
        images[1] = temp;
    }
    
    const { error: updateError } = await supabase
        .from('products')
        .update({ 
            image_url: images[0],
            images: images
        })
        .eq('id', data.id);
        
    if (updateError) {
        console.error("Error updating", updateError);
    } else {
        console.log("Successfully swapped Amelie images in Supabase!");
    }
}

swapAmelie();
