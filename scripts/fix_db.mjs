import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Reverting and fixing categories...");

  // 1. Rename Capsula Argentina back to normal (no emoji)
  await supabase.from('categories').update({ name: 'Cápsula Argentina' }).eq('slug', 'capsula-argentina');

  // 2. Rename Cuadernos back to normal (no emoji)
  await supabase.from('categories').update({ name: 'Cuadernos A4' }).eq('slug', 'cuadernos-a4');
  await supabase.from('categories').update({ name: 'Cuadernos A5' }).eq('slug', 'cuadernos-a5');

  // 3. Delete ANY category named "Varios" or "Cuaderno" (exact matches or close)
  await supabase.from('categories').delete().ilike('name', 'Varios');
  await supabase.from('categories').delete().ilike('name', 'Cuaderno');

  // 4. Restore "Stickers & Varios"
  // Check if it exists first
  const { data: exist } = await supabase.from('categories').select('*').eq('slug', 'stickers-varios');
  if (!exist || exist.length === 0) {
      await supabase.from('categories').insert([{ 
          name: 'Stickers & Varios', 
          slug: 'stickers-varios', 
          description: 'Stickers troquelados, separadores y accesorios' 
      }]);
  }

  console.log("Fixing products...");

  // 5. Add to Capsula Argentina: Obelisco, Sol de Mayo, Estampillas, Raices Argentinas
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Obelisco%');
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Sol de Mayo%');
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Estampillas%');
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Raíces%');

  // 6. Remove Maleva from Capsula Argentina (put back to Ficheros N° 3)
  await supabase.from('products').update({ category: 'Ficheros N° 3' }).ilike('name', '%Maleva%');

  console.log("Done.");
}

run();
