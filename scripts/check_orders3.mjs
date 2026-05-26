import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOrders() {
  const { data: order, error } = await supabase
            .from('orders')
            .insert({
                customer_name: `Test Test`,
                customer_email: `test@test.com`,
                customer_phone: `123123`,
                shipping_address: 'Retiro en sucursal',
                shipping_type: 'envio',
                shipping_cost: 0,
                payment_status: 'pending',
                total: 100,
                items: [{id: 1, name: "Test"}]
            })
            .select()
            .single();
  console.log("Orders error:", error);
  console.log("Order:", order);
}
checkOrders();
