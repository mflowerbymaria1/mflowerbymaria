import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspect() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%Amuleto%');
  if (error) {
    console.error("Error fetching product:", error);
  } else {
    console.log("Product Details:");
    console.log(JSON.stringify(data, null, 2));
  }
}

inspect();
