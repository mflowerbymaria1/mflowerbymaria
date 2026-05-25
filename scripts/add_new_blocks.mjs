import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const productsToInsert = [
        {
            name: 'Block de papeles A5 Colección Inspiración',
            short_description: 'Set de 24 papeles en tamaño A5, diseño Colección Inspiración.',
            description: 'Block de papeles tamaño A5. Contiene 24 papeles con hermosos diseños de la Colección Inspiración. Ideales para decorar tu journal, hacer collages, notas o lo que te imagines.',
            category: 'Block de papeles A5',
            price: 12000,
            stock: 20,
            image_url: '/images/block_papeles_inspiracion_1.jpg',
            gallery: ['/images/block_papeles_inspiracion_1.jpg', '/images/block_papeles_inspiracion_2.jpg']
        },
        {
            name: 'Block de hojas To Do List Osito',
            short_description: 'Block de notas To Do List, diseño Osito.',
            description: 'Block de hojas diseño To Do List Osito. Perfecto para anotar todas tus tareas diarias, hacer listas y organizarte con estilo. Diseño súper tierno y práctico.',
            category: 'Block de hojas',
            price: 7500,
            stock: 20,
            image_url: '/images/block_hojas_osito.jpg',
            gallery: ['/images/block_hojas_osito.jpg']
        },
        {
            name: 'Block de hojas Cerezas',
            short_description: 'Block de notas rayado, diseño Cerezas.',
            description: 'Block de hojas rayado diseño Cerezas. Práctico y hermoso para llevar a todos lados, anotar recordatorios, notas rápidas o listas.',
            category: 'Block de hojas',
            price: 7500,
            stock: 20,
            image_url: '/images/block_hojas_cerezas.jpg',
            gallery: ['/images/block_hojas_cerezas.jpg']
        }
    ];

    const { data, error } = await supabase.from('products').insert(productsToInsert);
    
    if (error) {
        console.error("Error inserting products:", error);
    } else {
        console.log("Inserted new blocks successfully.");
    }
}

run();
