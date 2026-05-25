import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // Set all to false first
    await supabase.from('products').update({ is_best_seller: false }).neq('id', '00000000-0000-0000-0000-000000000000'); // update all
    
    // Now set specific good products to true
    // Let's get the good ones we know:
    const goodNames = [
        'Cuaderno A4 Croissant sistema de discos',
        'Cuaderno A4 Amelie sistema de discos',
        'Fichero N° 3 Maleva',
        'Cuaderno A5 Candy sistema de discos',
        'Cuaderno A4 Yendo sistema de discos',
        'Cuaderno A4 Coffee Time sistema de discos'
    ];
    
    const { data, error } = await supabase
        .from('products')
        .update({ is_best_seller: true })
        .in('name', goodNames);
        
    console.log("Updated best sellers to only show products with good images.");
}

run();
