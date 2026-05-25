import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Iniciando actualizaciones...");

  // 6. Delete category "Cuadernos"
  await supabase.from('categories').delete().eq('slug', 'cuadernos');

  // 4. Create category "Set de separadores" if not exists
  const { data: sepCat } = await supabase.from('categories').select('*').eq('slug', 'set-separadores');
  if (!sepCat || sepCat.length === 0) {
      await supabase.from('categories').insert([{ name: 'Set de separadores', slug: 'set-separadores', description: 'Separadores de materias' }]);
  }

  // 7. Update Cuadernos A4/A5 titles in DB to include "Sistema de discos"
  await supabase.from('categories').update({ name: 'Cuadernos A4 Sistema de discos 📓' }).eq('slug', 'cuadernos-a4');
  await supabase.from('categories').update({ name: 'Cuadernos A5 Sistema de discos 📓' }).eq('slug', 'cuadernos-a5');

  // Fix products:

  // First, set all Cuaderno A4 to 'Cuadernos A4' category
  await supabase.from('products').update({ category: 'Cuadernos A4' }).ilike('name', '%Cuaderno A4%');

  // Then override the Capsula Argentina ones (Obelisco, Pink Buenos Aires, Sol de Mayo, Estampillas, Raíces)
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Obelisco%');
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Pink%');
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Sol de Mayo%');
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Estampillas%');
  await supabase.from('products').update({ category: 'Cápsula Argentina' }).ilike('name', '%Raíces%');

  // Ficheros N3: Perro Salchicha, Maleva
  await supabase.from('products').update({ category: 'Ficheros N° 3' }).ilike('name', '%Perro Salchicha%');
  await supabase.from('products').update({ category: 'Ficheros N° 3' }).ilike('name', '%Maleva%');

  // Set de separadores
  await supabase.from('products').update({ category: 'Set de separadores' }).ilike('name', '%separador%');

  // Block de papeles inspiración
  await supabase.from('products').update({ category: 'Block de papeles' }).ilike('name', '%Inspiraci%');

  console.log("Completado.");
}

run();
