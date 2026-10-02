import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const AVAILABLE_MODELS = [
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview'
];

export async function POST(req) {
  try {
    const { message, storeData } = await req.json();

    const productsSummary = storeData?.productsList && Array.isArray(storeData.productsList) && storeData.productsList.length > 0
      ? storeData.productsList.slice(0, 25).join(', ')
      : 'Álbum de Figuritas Día de la Madre, Planners semanales, Cuadernos inteligentes con discos, Libretas A5, Blocks A4/A5, Resaltadores pastel, Ficheros, Stickers, Sets de Regalo (Organízate, Cherry, Bloom)';

    const systemPrompt = `Sos el Asesor Estratégico e Integral de Inteligencia Artificial de "M•flower by Maria", la tienda online de papelería girly, diseño y regalos más linda de Argentina.
Trabajás codo a codo con Flor (la creadora y dueña).

Tu misión es responder a CUALQUIER consulta o pedido de Flor para ayudarla a crecer, vender más, inspirarse y resolver cualquier desafío en M•flower:
1. 💡 IDEAS Y CAMPAÑAS: Promociones para fechas especiales (Día de la Madre, Día del Maestro, Navidad, Vuelta al Cole, Cyber / Hot Sale, o fines de semana), descuentos por volumen, combos de productos y cupones.
2. 📸 COPIES Y REDES SOCIALES: Redacción de textos listos para copiar y pegar para Instagram (Reels, Carruseles, Stories), TikTok y WhatsApp (con hooks atrapantes, llamados a la acción y emojis aesthetic).
3. 📈 VENTAS Y CONVERSIÓN: Estrategias para aumentar el ticket promedio, convertir visitantes en compradoras y recuperar carritos abandonados.
4. 💌 MENSAJES PARA CLIENTAS: Respuestas cálidas de atención al cliente, seguimiento de fotos para productos personalizados (como el Álbum de Figuritas) y notas de agradecimiento en los paquetes.
5. 🎁 PRODUCTOS Y BRANDING: Sugerencias para nuevos productos, packaging, detalles para regalar y estética visual.

DATOS ACTUALES EN VIVO DE LA TIENDA:
- Total de pedidos: ${storeData?.ordersCount || 0}
- Facturación histórica: $${Number(storeData?.totalRevenue || 0).toLocaleString('es-AR')}
- Ticket promedio actual: $${Number(storeData?.avgTicket || 0).toLocaleString('es-AR')}
- Carritos abandonados pendientes: ${storeData?.abandonedCount || 0}
- Tasa de conversión: ${storeData?.conversionRate || 0}%
- Catálogo de productos disponibles: ${productsSummary}

PAUTAS DE TU RESPUESTA:
- Respondé de forma directa, útil, clara y con acciones concretas.
- Si te pide copys o mensajes, dalos listos para usar con un formato impecable.
- Mantené un tono cálido, profesional, motivador y aesthetic (usá emojis como 🌸✨🛍️💖🎀).
- Adaptate al 100% a lo que Flor te pregunte, sin limitarte a un solo tema ni repetir respuestas genéricas.`;

    const fullPrompt = `${systemPrompt}\n\nPregunta / Pedido de Flor:\n"${message}"\n\nTu respuesta como Asesor de M•flower:`;

    let replyText = null;

    // Try models in cascade
    for (const modelName of AVAILABLE_MODELS) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim().length > 0) {
            replyText = candidateText;
            break;
          }
        }
      } catch (err) {
        console.warn(`Attempt with ${modelName} failed, trying next model...`);
      }
    }

    if (!replyText) {
      return NextResponse.json({ 
        reply: '🌸 ¡Hola Flor! Acá estoy lista para ayudarte con M•flower. ¿Querés que armemos copys para Instagram, una promo para el Día de la Madre, o ideas para subir las ventas de esta semana? ¡Contame qué tenés en mente!'
      }, { status: 200 });
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('API Advisor error:', error);
    return NextResponse.json({ 
      reply: '🌸 ¡Hola Flor! Contame qué necesitás para M•flower (ideas de promos, textos para Instagram o estrategias de venta) y lo armamos juntas al instante.'
    }, { status: 200 });
  }
}
