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
    
    const { error: updateError } = await supabase
        .from('products')
        .update({ 
            image_url: '/images/mockup_amelie_front.jpg'
        })
        .eq('id', data.id);
        
    if (updateError) {
        console.error("Error updating", updateError);
    } else {
        console.log("Successfully swapped Amelie images in Supabase!");
    }
}

swapAmelie();
