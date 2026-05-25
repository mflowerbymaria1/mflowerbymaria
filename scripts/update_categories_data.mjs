import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Updating categories...");

  // 1. Rename Capsula Argentina
  await supabase.from('categories').update({ name: 'Cápsula Argentina 🇦🇷' }).eq('slug', 'capsula-argentina');

  // 2. Rename Cuadernos A4
  await supabase.from('categories').update({ name: 'Cuadernos A4 📓' }).eq('slug', 'cuadernos-a4');
  await supabase.from('categories').update({ name: 'Cuadernos A5 📓' }).eq('slug', 'cuadernos-a5');

  // 3. Delete 'Varios' category
  await supabase.from('categories').delete().eq('slug', 'stickers-varios');

  console.log("Updating products categories...");

  // 4. Move "Sol de Mayo" and "Maleva" back to Cápsula Argentina
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Sol de Mayo%');
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Maleva%');

  console.log("Done.");
}

run();
