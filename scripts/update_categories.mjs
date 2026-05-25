import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Ficheros N° 3
    const { error: err1 } = await supabase
        .from('products')
        .update({ category: 'Ficheros N° 3' })
        .ilike('name', '%Fichero N° 3%');
    if (err1) console.error("Error updating Ficheros", err1);
    
    // 2. Block de papeles A5
    const { error: err2 } = await supabase
        .from('products')
        .update({ category: 'Block de papeles A5' })
        .ilike('name', '%Block de papeles A5%');
    if (err2) console.error("Error updating Block", err2);

    // 3. Set de separadores de materias
    const { error: err3 } = await supabase
        .from('products')
        .update({ category: 'Set de separadores de materias' })
        .ilike('name', '%Set de separadores de materias%');
    if (err3) console.error("Error updating Separadores", err3);

    console.log("Categories updated successfully.");
}

run();
