import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgjromtddlvifasmbqin.supabase.co';
const supabaseKey = 'sb_publishable_i9ZZX4KGxM7sMrWRL5nUSg_vNwV9HNJ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase
        .from('orders')
        .insert({
            customer_name: 'Test',
            customer_email: 'test@test.com',
            customer_phone: '123',
            shipping_address: 'Retiro',
            shipping_method: 'retiro',
            payment_status: 'pending',
            total_amount: 100,
            items: [],
            notes: 'Test notes'
        })
        .select();
    
    console.log("Error:", error);
    console.log("Data:", data);
}

test();
