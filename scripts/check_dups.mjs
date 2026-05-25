import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data, error } = await supabase.from('products').select('id, name, category');
    if (error) { console.error(error); return; }
    
    const counts = {};
    data.forEach(p => {
        counts[p.name] = (counts[p.name] || 0) + 1;
    });
    
    for (const [name, count] of Object.entries(counts)) {
        if (count > 1) {
            console.log(`Duplicate: "${name}" occurs ${count} times.`);
        }
    }
    console.log(`Total products: ${data.length}`);
}

run();
