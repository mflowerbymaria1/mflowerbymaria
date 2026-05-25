import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', '%Coffee Time%');

    if (error || !data || data.length === 0) {
        console.error("Error finding Coffee Time");
        return;
    }

    const coffeeTime = data[0];
    const newGallery = [
        "/images/mockup_coffee_time_front.jpg",
        "/images/mockup_arg_interior_1.png",
        "/images/mockup_arg_interior_2.png",
        "/images/mockup_arg_interior_3.png",
        "/images/mockup_arg_interior_4.png"
    ];

    const { error: updateError } = await supabase
        .from('products')
        .update({ gallery: newGallery })
        .eq('id', coffeeTime.id);

    if (updateError) {
        console.error("Error updating", updateError);
    } else {
        console.log("Updated Coffee Time gallery.");
    }
}

run();
