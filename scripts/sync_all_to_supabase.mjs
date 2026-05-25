import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('C:\\Users\\Leandro\\.gemini\\antigravity\\scratch\\mflowerbymaria\\.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// All products with correct categories
const products = [
    { name: "Notas borrables", category: "Stickers & Varios", short_description: "Superficie apta para marcador de pizarra.", description: "Dimensiones: 9 cm de ancho x 13 cm de largo. Superficie apta para marcador de pizarra, fácil de borrar y reutilizar.", price: 1200, image_url: "/images/mflower_prod_cuaderno_1772749182939.png", stock: 20 },
    { name: "Cuaderno A4 Pink Buenos Aires sistema de discos", category: "Cuadernos A4", short_description: "A4, 90 hojas, anillado inteligente.", description: "Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.", price: 31900, image_url: "/images/mockup_combinado_ia.png", stock: 10, is_best_seller: true },
    { name: "Planner A4", category: "Planners", short_description: "Planner horizontal perpetuo.", description: "Contiene: planner horizontal, 50 hojas A4. El interior es perpetuo. Organización semanal y mensual.", price: 32000, image_url: "/images/mflower_prod_planner_1772749261418.png", stock: 8, is_best_seller: true },
    { name: "Fichero N° 3", category: "Ficheros N° 3", short_description: "Complemento ideal para organizar tus fichas de estudio.", description: "Complemento ideal para organizar tus fichas de estudio o notas rápidas. Tamaño fichero N° 3, viene con 3 separadores, sistema anillado de discos inteligente.", price: 28000, image_url: "/images/mflower_prod_fichero_1772749276913.png", stock: 12 },
    { name: "Cuaderno A5", category: "Cuadernos A5", short_description: "A5, 100 hojas, sistema de discos.", description: "Tamaño A5. Sistema de discos inteligente. Incluye 100 hojas, 6 plantillas de temario, 2 separadores, y calendario.", price: 28000, image_url: "/images/mflower_prod_cuaderno_1772749182939.png", stock: 15 },
    { name: "Set de separadores de materias", category: "Stickers & Varios", short_description: "Organiza tus cuadernos, resistentes.", description: "Complemento ideal para organizar tus cuadernos, estos separadores son resistentes. Elegir tamaño (A4/A5), el precio es por 3 separadores.", price: 6000, image_url: "/images/mflower_hero_banner_1772749247154.png", stock: 30 },
    { name: "Plancha de stickers troquelados Galletitas", category: "Stickers & Varios", short_description: "Stickers autoadhesivos troquelados diseño Galletitas.", description: "Papel autoadhesivo, brillante. Personalizá todas tus cosas con nuestras planchas de galletitas.", price: 8500, image_url: "/images/stickers_galletitas.jpg", stock: 25, is_best_seller: true },
    { name: "Plancha de stickers troquelados Caritas", category: "Stickers & Varios", short_description: "Stickers autoadhesivos troquelados diseño Caritas.", description: "Papel autoadhesivo, brillante. Personalizá todas tus cosas con nuestras planchas de caritas sonrientes.", price: 8500, image_url: "/images/stickers_caritas.jpg", stock: 25 },
    { name: "Libretas A5", category: "Cuadernos A5", short_description: "40 hojas (rayadas/lisas), sistema de gancho.", description: "Contiene 40 hojas. Libretas con sistema de gancho, las mismas se encuentran plastificadas para mayor duración.", price: 15000, image_url: "/images/mflower_prod_cuaderno_1772749182939.png", stock: 10, is_best_seller: true },
    { name: "Block de papeles A5", category: "Block de papeles", short_description: "20 papeles colección Enamora, 10 prints distintos.", description: "Contiene 20 papeles tamaño A5 (14cm x 20cm) de la colección Enamora, 80 gramaje.", price: 20000, image_url: "/images/mflower_hero_desk_1772749167247.png", stock: 15 },
    { name: "Set Escolar: Cuaderno A4 + Separadores + Stickers", category: "Cuadernos A4", short_description: "Kit ideal para empezar las clases con todo.", description: "Armá tu kit ideal: incluye el Cuaderno A4 Sistema de discos inteligente (90 hojas), elegir tu set de 3 separadores y una plancha de stickers troquelados brillantes para decorar.", price: 45000, image_url: "/images/mflower_prod_cuaderno_1772749182939.png", stock: 5, is_best_seller: true },
    { name: "Cuaderno A4 Sol de Mayo sistema de discos", category: "Cuadernos A4", short_description: "A4, 90 hojas, diseño Sol de Mayo.", description: "Edición Limitada. Diseño exclusivo Sol de Mayo. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos.", price: 31900, image_url: "/images/mockup_sol_de_mayo_front.jpg", stock: 8 },
    { name: "Cuaderno A4 Pinky Jirafa sistema de discos", category: "Cuadernos A4", short_description: "A4, 90 hojas, diseño Pinky Jirafa.", description: "Diseño exclusivo Pinky Jirafa. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.", price: 31900, image_url: "/images/mockup_jirafa_back.jpg", stock: 10 },
    { name: "Fichero N° 3 Maleva", category: "Ficheros N° 3", short_description: "Fichero de estudio diseño Maleva.", description: "Diseño exclusivo Maleva. Complemento ideal para organizar tus fichas de estudio o notas rápidas.", price: 28000, image_url: "/images/mockup_maleva_front.jpg", stock: 10 },
    { name: "Cuaderno A4 Croissant sistema de discos", category: "Cuadernos A4", short_description: "A4, 90 hojas, diseño Croissant.", description: "Diseño exclusivo Croissant. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.", price: 31900, image_url: "/images/mockup_croissant_back.jpg", stock: 10 },
    { name: "Fichero N° 3 Perro Salchicha", category: "Ficheros N° 3", short_description: "Fichero de estudio diseño Perro Salchicha.", description: "Diseño exclusivo Perro Salchicha. Complemento ideal para organizar tus fichas de estudio o notas rápidas.", price: 28000, image_url: "/images/mockup_salchicha_front.jpg", stock: 10 },
    { name: "Cuaderno A4 Amelie sistema de discos", category: "Cuadernos A4", short_description: "A4, 90 hojas, diseño Amelie.", description: "Diseño exclusivo Amelie. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.", price: 31900, image_url: "/images/mockup_amelie_front.jpg", stock: 10 },
    { name: "Cuaderno A5 Pretty Girls sistema de discos", category: "Cuadernos A5", short_description: "A5, 90 hojas, diseño Pretty Girls.", description: "Diseño exclusivo Pretty Girls. Contiene: Interior 90 hojas A5, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.", price: 26500, image_url: "/images/mockup_pretty_girls_front.jpg", stock: 10 },
    { name: "Cuaderno A4 Coffee Time sistema de discos", category: "Cuadernos A4", short_description: "A4, 90 hojas, diseño Coffee Time.", description: "Diseño exclusivo Coffee Time. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.", price: 31900, image_url: "/images/mockup_coffee_time_front.jpg", stock: 10 },
    { name: "Cuaderno A4 Yendo sistema de discos", category: "Cuadernos A4", short_description: "A4, 90 hojas, diseño Yendo.", description: "Diseño exclusivo Yendo. Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.", price: 31900, image_url: "/images/mockup_yendo_front.jpg", stock: 10 },
    { name: "Cuaderno A5 Candy sistema de discos", category: "Cuadernos A5", short_description: "A5, 90 hojas, diseño Candy.", description: "Diseño exclusivo Candy. Contiene: Interior 90 hojas A5, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores.", price: 26500, image_url: "/images/mockup_candy_front.jpg", stock: 10 },
    { name: "Repuesto Hojas A4", category: "Repuestos", short_description: "Repuesto A4, 100 hojas, papel de alta calidad.", description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel ecológico de 80 gr.", price: 16000, image_url: "/images/repuestos_svg/a4_blanco_rayadas.svg", stock: 30 },
    { name: "Repuesto Hojas A5", category: "Repuestos", short_description: "Repuesto A5, 100 hojas, papel de alta calidad.", description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel ecológico de 90 gr.", price: 13500, image_url: "/images/repuestos_svg/a5_blanco_rayadas.svg", stock: 30 },
    { name: "Repuesto Fichas N° 3", category: "Repuestos", short_description: "100 fichas rayadas para fichero N° 3.", description: "Repuesto de fichero N° 3, contiene 100 fichas rayadas en papel de 120 gr.", price: 10900, image_url: "/images/repuestos_svg/fichas_blanco_rayadas.svg", stock: 30 },
];

// Categories to ensure exist
const categories = [
    { name: "Cuadernos A4", slug: "cuadernos-a4", description: "Cuadernos tamaño A4 con sistema de discos inteligente" },
    { name: "Cuadernos A5", slug: "cuadernos-a5", description: "Cuadernos tamaño A5 con sistema de discos inteligente" },
    { name: "Ficheros N° 3", slug: "ficheros-n3", description: "Ficheros de estudio con sistema de discos" },
    { name: "Planners", slug: "planners", description: "Planificadores y agendas para organizar tu vida" },
    { name: "Stickers & Varios", slug: "stickers-varios", description: "Stickers troquelados, separadores y accesorios" },
    { name: "Block de papeles", slug: "block-de-papeles", description: "Blocks de papeles decorativos" },
    { name: "Block de hojas", slug: "block-de-hojas", description: "Blocks de hojas A5 con diseños exclusivos" },
    { name: "Repuestos", slug: "repuestos", description: "Repuestos de hojas y fichas para cuadernos y ficheros" },
    { name: "capsula-argentina", slug: "capsula-argentina", description: "Colección Cápsula Argentina - Edición Limitada" },
];

async function syncAll() {
    console.log("🔄 Sincronizando categorías...");
    
    for (const cat of categories) {
        // Upsert: insert or update if exists
        const { data: existing } = await supabase
            .from('categories')
            .select('id')
            .eq('name', cat.name)
            .maybeSingle();
        
        if (existing) {
            await supabase.from('categories').update(cat).eq('id', existing.id);
            console.log(`  ✅ Categoría actualizada: ${cat.name}`);
        } else {
            const { error } = await supabase.from('categories').insert([cat]);
            if (error) {
                console.log(`  ⚠️ Error insertando categoría ${cat.name}: ${error.message}`);
            } else {
                console.log(`  ✅ Categoría creada: ${cat.name}`);
            }
        }
    }

    console.log("\n🔄 Sincronizando productos...");
    
    for (const prod of products) {
        const { data: existing } = await supabase
            .from('products')
            .select('id, stock')
            .eq('name', prod.name)
            .maybeSingle();
        
        if (existing) {
            // Update product but keep the current stock if it already exists (don't overwrite real stock)
            const updateData = { ...prod };
            delete updateData.stock; // Don't overwrite real stock
            
            const { error } = await supabase.from('products').update(updateData).eq('id', existing.id);
            if (error) {
                console.log(`  ❌ Error actualizando ${prod.name}: ${error.message}`);
            } else {
                console.log(`  ✅ Producto actualizado: ${prod.name} (stock actual: ${existing.stock})`);
            }
        } else {
            const { error } = await supabase.from('products').insert([prod]);
            if (error) {
                console.log(`  ❌ Error insertando ${prod.name}: ${error.message}`);
            } else {
                console.log(`  ✅ Producto creado: ${prod.name} (stock: ${prod.stock})`);
            }
        }
    }

    console.log("\n✅ Sincronización completa!");
}

syncAll();
