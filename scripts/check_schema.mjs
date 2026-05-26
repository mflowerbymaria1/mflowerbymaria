import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getSchema() {
  const { data, error } = await supabase.rpc('get_table_schema', { table_name: 'orders' });
  if (error) {
     console.log("No rpc for schema, let's try an empty insert to see fields, or just use psql.");
     const res = await supabase.from('orders').select('*').limit(1);
     console.log(res);
  }
}
getSchema();
