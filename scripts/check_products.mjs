import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const { data, error } = await supabase.from('products').select('*').ilike('name', '%sticker%');
    console.log(data);
    
    const { data: empty, error: err2 } = await supabase.from('products').select('*').eq('name', '');
    console.log("Empty name:", empty);
}

run();
