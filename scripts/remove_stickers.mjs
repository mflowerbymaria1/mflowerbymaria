import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
    console.log("Buscando productos duplicados de stickers...");
    const { data, error } = await supabase
        .from('products')
        .select('id, name');

    if (error) {
        console.error("Error al buscar productos:", error);
        return;
    }

    const toDelete = data.filter(p => p.name.toLowerCase().includes('galletitas') || p.name.toLowerCase().includes('caritas'));
    
    if (toDelete.length === 0) {
        console.log("No se encontraron esos productos duplicados.");
        return;
    }

    console.log("Productos a eliminar:");
    for (const p of toDelete) {
        console.log(`- ID: ${p.id} | Nombre: ${p.name}`);
        const { error: delError } = await supabase
            .from('products')
            .delete()
            .eq('id', p.id);
            
        if (delError) {
            console.error(`Error al eliminar ${p.name}:`, delError);
        } else {
            console.log(`✅ Eliminado: ${p.name}`);
        }
    }
}

main();
