import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectDb() {
  const { data: products, error: prodError } = await supabase.from('products').select('*');
  if (prodError) console.error(prodError);
  else {
    console.log("Categories of Argentina products:");
    const arg = products.filter(p => p.name.toLowerCase().includes('argentina') || p.name.toLowerCase().includes('sol de mayo') || p.name.toLowerCase().includes('maleva'));
    console.log(arg.map(p => ({ id: p.id, name: p.name, category: p.category })));
    
    console.log("\nAll unique categories in products:");
    const uniqueCats = [...new Set(products.map(p => p.category))];
    console.log(uniqueCats);
  }
}
inspectDb();
