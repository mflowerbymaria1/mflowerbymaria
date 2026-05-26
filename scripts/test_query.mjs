import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testQuery() {
  const { data, error } = await supabase
            .from('orders')
            .select('*, customers(full_name, email, phone, address, city, postal_code), order_items(*, products(name))')
            .order('created_at', { ascending: false });
  console.log("Error:", error);
}
testQuery();
