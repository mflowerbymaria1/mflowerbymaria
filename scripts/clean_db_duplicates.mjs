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

async function cleanDuplicates() {
    console.log('Buscando productos duplicados en la base de datos...');
    const { data: allProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, name, category');

    if (fetchError) {
        console.error('Error al obtener productos:', fetchError.message);
        return;
    }

    const seen = new Set();
    const idsToDelete = [];

    for (const p of allProducts) {
        // Usamos una clave combinada de nombre y categoría
        const key = `${p.name.trim().toLowerCase()}_${p.category ? p.category.trim().toLowerCase() : ''}`;
        if (seen.has(key)) {
            idsToDelete.push(p.id);
        } else {
            seen.add(key);
        }
    }

    console.log(`Total de productos en base de datos: ${allProducts.length}`);
    console.log(`Cantidad de productos duplicados a eliminar: ${idsToDelete.length}`);

    if (idsToDelete.length > 0) {
        // Eliminar los duplicados usando sus IDs únicos
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .in('id', idsToDelete);

        if (deleteError) {
            console.error('Error al eliminar los duplicados:', deleteError.message);
        } else {
            console.log('✅ ¡Duplicados eliminados exitosamente de la base de datos!');
        }
    } else {
        console.log('No se encontraron productos duplicados.');
    }
}

cleanDuplicates();
