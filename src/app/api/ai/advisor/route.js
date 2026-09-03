import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req) {
  try {
    const { message, storeData } = await req.json();

    const systemPrompt = `Sos el Asesor Estratégico de Inteligencia Artificial de "M•flower by Maria", una hermosa tienda online de papelería girly, planners, cuadernos, resaltadores y sets de regalo en Argentina.
Tus objetivos son:
1. Ayudar a la dueña (Flor/Maria) a aumentar su tasa de conversión (visitas vs ventas), mejorar su ticket promedio y recuperar carritos abandonados.
2. Dar consejos específicos, prácticos, directos y con un tono cálido, profesional y entusiasta (usá emojis acordes como 🌸✨🛍️💖).
3. Redactar copies de venta para Instagram, WhatsApp o ideas de promociones basadas en los datos de la tienda.

Datos actuales de la tienda:
- Total de pedidos: ${storeData?.ordersCount || 0}
- Facturación total: $${storeData?.totalRevenue || 0}
- Ticket promedio: $${storeData?.avgTicket || 0}
- Carritos abandonados: ${storeData?.abandonedCount || 0}
- Tasa de conversión: ${storeData?.conversionRate || 0}%
- Productos destacados: Sets Día del Maestro (Set Organízate, Set Cherry, Set Bloom), Planners, Blocks A4/A5.`;

    const fullPrompt = `${systemPrompt}\n\nConsulta de la dueña: "${message}"\n\nPor favor, responde de forma clara, motivadora y con pasos de acción concretos:`;

    // Try Gemini 2.5 Flash / 1.5 Flash
    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    if (!response.ok) {
      // Fallback try gemini-1.5-pro
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json({ 
        error: 'No pudimos conectar con Gemini API temporalmente.', 
        reply: '🌸 ¡Hola Flor! En este momento estoy analizando tus métricas en modo offline. Te recomiendo enfocar las promos de este fin de semana en los Sets Día del Maestro y ofrecer envío bonificado superando los $25.000.' 
      }, { status: 200 });
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar una respuesta.';

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('API Advisor error:', error);
    return NextResponse.json({ 
      error: error.message,
      reply: '🌸 Te sugiero potenciar las promociones de los Sets Día del Maestro y recordar a los carritos abandonados por WhatsApp dentro de las primeras 3 horas.' 
    }, { status: 200 });
  }
}
