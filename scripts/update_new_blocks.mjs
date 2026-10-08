import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgjromtddlvifasmbqin.supabase.co';
const supabaseKey = 'sb_publishable_i9ZZX4KGxM7sMrWRL5nUSg_vNwV9HNJ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function update() {
  const suertudoDesc = `El Midi Block Suertudo combina el tamaño ideal A5 con un diseño lleno de buena vibra y estilo. Perfecto para tener siempre a mano en tu escritorio o llevar en la cartera para anotar pendientes, ideas y recordatorios diarios.

Detalles del producto:
- Tamaño: A5 (15 x 21 cm).
- Cantidad: 40 hojas impresas a todo color.
- Papel: Papel obra de 90g de alto gramaje (apto para todo tipo de lapiceras y resaltadores sin traspasar).
- Encuadernación: Block encolado superior con base rígida para escribir cómodo.
- Usos recomendados: Tareas del día, recordatorios, listas y notas rápidas. [WHOLESALE:6900]`;

  const animalDesc = `El Mega Block Animal Print es el compañero perfecto para quienes necesitan espacio de sobra para planificar, estudiar y trabajar con estilo chic y canchero. Su tamaño extra grande A4 te permite tener una visión clara de todas tus prioridades en un solo lugar.

Detalles del producto:
- Tamaño: A4 (21 x 30 cm) extra espacio.
- Cantidad: 40 hojas impresas con diseño exclusivo Animal Print.
- Papel: Papel obra de 90g de excelente calidad, suave al tacto y resistente a tintas y resaltadores.
- Encuadernación: Block encolado superior con respaldo rígido.
- Usos recomendados: Planificación semanal, materias, proyectos, listas de pendientes y lluvias de ideas. [WHOLESALE:6900]`;

  const res1 = await supabase.from('products').update({
    short_description: 'Block de notas A5 (15x21 cm) con 40 hojas, diseño Suertudo.',
    description: suertudoDesc
  }).eq('id', '991c1ca3-826d-468c-a9fd-3a0585882066').select();

  const res2 = await supabase.from('products').update({
    short_description: 'Mega Block de notas A4 (21x30 cm) con 40 hojas, diseño Animal Print.',
    description: animalDesc
  }).eq('id', 'aacc4c15-e7dd-4e29-a55a-6daaae7a2591').select();

  console.log('Suertudo Update:', res1.error || 'OK - Actualizado');
  console.log('Animal Print Update:', res2.error || 'OK - Actualizado');
}
update();
