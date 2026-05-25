import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Faltan las credenciales en .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCategory() {
    console.log('Actualizando categoría del cuaderno del Obelisco...');
    const { data, error } = await supabase
        .from('products')
        .update({ category: 'Cápsula Argentina' })
        .ilike('name', '%Pink Buenos Aires%')
        .select();

    if (error) {
        console.error('Error al actualizar:', error.message);
    } else {
        console.log('✅ Cuaderno del Obelisco actualizado con éxito:', data);
    }
}

updateCategory();
