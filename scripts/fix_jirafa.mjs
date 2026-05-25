import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fix() {
  console.log("Fixing Jirafa...");
  // Move Jirafa back to Cuadernos A4
  await supabase.from('products').update({ category: 'Cuadernos A4' }).ilike('name', '%Jirafa%');

  // Ensure Pink Buenos Aires is in Capsula Argentina
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Pink Buenos Aires%');

  console.log("Checking separators...");
  const { data: seps } = await supabase.from('products').select('*').ilike('name', '%separador%');
  console.log("Separators found:", seps.map(p => p.name));
  
  if (seps.length === 0) {
      console.log("No separators found! Searching all products...");
      const { data: all } = await supabase.from('products').select('*');
      console.log("All products:");
      console.log(all.map(p => p.name));
  } else {
      // Ensure they are in 'Set de separadores'
      await supabase.from('products').update({ category: 'Set de separadores' }).ilike('name', '%separador%');
  }
}
fix();
