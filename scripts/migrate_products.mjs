import { createClient } from '@supabase/supabase-js';
import { products } from './src/data/products.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Faltan las credenciales en .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Iniciando migración de productos...');

    for (const product of products) {
        const { data, error } = await supabase
            .from('products')
            .insert({
                name: product.name,
                short_description: product.shortDescription,
                description: product.description,
                category: product.category || 'Varios',
                price: parseFloat(product.price.replace('.', '')),
                stock: 10, // Stock inicial por defecto
                image_url: product.image,
                gallery: product.images,
                is_best_seller: product.isBestSeller || false
            });

        if (error) {
            console.error(`Error migrando ${product.name}:`, error.message);
        } else {
            console.log(`✅ Migrado: ${product.name}`);
        }
    }

    console.log('Migración finalizada.');
}

migrate();
