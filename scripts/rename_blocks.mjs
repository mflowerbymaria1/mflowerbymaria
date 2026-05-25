import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const { error: err1 } = await supabase
        .from('products')
        .update({ name: 'block A5 osito gomita' })
        .ilike('name', '%Osito%');
    
    if (err1) console.error(err1);
    else console.log("Updated osito");

    const { error: err2 } = await supabase
        .from('products')
        .update({ name: 'block A5 cereza' })
        .ilike('name', '%Cerezas%');

    if (err2) console.error(err2);
    else console.log("Updated cereza");
}

run();
