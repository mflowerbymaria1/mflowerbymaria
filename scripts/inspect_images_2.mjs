import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectImages() {
  const { data: yendo } = await supabase.from('products').select('name, image_url, gallery').ilike('name', '%Yendo%');
  const { data: sol } = await supabase.from('products').select('name, image_url, gallery').ilike('name', '%Sol de Mayo%');
  const { data: est } = await supabase.from('products').select('name, image_url, gallery').ilike('name', '%Estampillas%');
  console.log("Yendo:");
  console.log(yendo);
  console.log("Sol de Mayo:");
  console.log(sol);
  console.log("Estampillas:");
  console.log(est);
}
inspectImages();
