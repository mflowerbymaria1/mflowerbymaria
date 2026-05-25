import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectImages() {
  const { data: products } = await supabase.from('products').select('name, image_url').ilike('name', '%Cuaderno A4%');
  console.log("Cuadernos A4:");
  console.log(products);
}
inspectImages();
