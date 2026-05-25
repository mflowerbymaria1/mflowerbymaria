import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 4. Libretas A5
    const { error: err } = await supabase
        .from('products')
        .update({ category: 'Libretas A5' })
        .ilike('name', '%Libretas A5%');
    if (err) console.error("Error updating Libretas", err);
    else console.log("Updated Libretas A5 category");
}

run();
