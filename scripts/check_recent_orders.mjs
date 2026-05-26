import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listOrders() {
  const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
  console.log("Orders error:", error);
  console.log("Orders:", orders);
}
listOrders();
