import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const AVAILABLE_MODELS = [
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview'
];

function cleanRawText(str) {
  let res = (str || '').trim();
  res = res.replace(/^(hola|che|gravy|gemini)?[\s,]*(mejorame|mejora|corregime|corregi|revisa|revisame|reescribime|cambiale|sacale|mira|tengo|este es|que opinas de|que te parece)?[\s,]*(un|el|este|mi)?[\s,]*(copy|texto|borrador|mensaje)?[\s,]*(que arme|que hice|que tengo|para instagram|para tiktok|para redes|que dice|que puse)?[\s,:]*/i, '');
  res = res.replace(/^["'“”«»]+|["'“”«»]+$/g, '').trim();
  return res || str;
}

function generateSmartAdvisorResponse(userQuery, storeData) {
  const query = (userQuery || '').trim();
  const queryLower = query.toLowerCase();
  const ordersCount = storeData?.ordersCount || 0;
  const avgTicket = storeData?.avgTicket ? Number(storeData.avgTicket).toLocaleString('es-AR') : '25.000';
  const abandonedCount = storeData?.abandonedCount || 0;

  // 1. SI FLOR PIDE MEJORAR / CORREGIR / REESCRIBIR SU PROPIO COPY O TEXTO
  const isRewriteRequest = 
    queryLower.includes('mejorame') ||
    queryLower.includes('mejora') ||
    queryLower.includes('corregime') ||
    queryLower.includes('corregi') ||
    queryLower.includes('reescribime') ||
    queryLower.includes('cambiale') ||
    queryLower.includes('sacale') ||
    queryLower.includes('tengo este') ||
    queryLower.includes('mira este') ||
    queryLower.includes('que opinas de este') ||
    queryLower.includes('que te parece este') ||
    queryLower.includes('hacelo mas corto') ||
    queryLower.includes('hacelo mas largo') ||
    (query.includes('"') && query.length > 30) ||
    (query.includes('\n') && query.length > 40);

  if (isRewriteRequest) {
    const rawContent = cleanRawText(query);
    const isMotherDay = queryLower.includes('madre') || queryLower.includes('mama') || queryLower.includes('mamá') || queryLower.includes('figurita');
    const isNotebook = queryLower.includes('cuaderno') || queryLower.includes('planner') || queryLower.includes('libreta') || queryLower.includes('block') || queryLower.includes('disco');
    const isGiftSet = queryLower.includes('set') || queryLower.includes('combo') || queryLower.includes('pack') || queryLower.includes('regalo');

    return `🌸 ¡Me encantó la base de tu texto, Flor! Tomé tu idea original y la pulí para que sea súper magnética, clara y vendedora:

---

### 📝 Tu texto original analizado:
> *"${rawContent || query}"*

---

### ✨ OPCIÓN 1: Para Feed / Carrusel de Instagram (Aesthetic & Emocional)
> **Hook:** ${isMotherDay ? '*"El regalo que a mamá le va a sacar lágrimas de emoción (de las lindas) 🥹💖"*' : isNotebook ? '*"Si tu mente va a mil y querés ordenarte con estilo, esto es para vos 🌸✨"*' : '*"El detalle perfecto para regalar (o auto-mimarte) sin vueltas 🎀✨"*'}
> 
> ${rawContent || '¡Llegaron los nuevos productos más lindos de la temporada!'}
> 
> **¿Por qué te va a enamorar?**
> * 🌸 Diseño exclusivo y detalles cuidados al 100%
> * 🪄 Papel de alto gramaje que no traspasa y súper suave
> * 🎁 Viene listo para regalar con presentación hermosa
> 
> *📦 Envíos a todo el país o retiro por General Rodríguez.*
> *💳 Hasta 3 cuotas sin interés | 💸 20% OFF pagando con transferencia.*
> *🔗 ¡Conseguí el tuyo en el link de nuestra bio antes de que vuele el stock!*
> 
> \`#mflower #papeleria #stationerylover #hechoenargentina #diseñonacional\`

---

### ⚡ OPCIÓN 2: Para Stories / TikTok (Corta, Dinámica & Directa)
> *"¿Buscabas una señal para renovar tu papelería? Acá está 💖*  
> *${rawContent.slice(0, 100)}...*  
> *Asegurá el tuyo hoy con 20% OFF por transferencia y 3 cuotas sin interés. Tocá el sticker de abajo para ir a la tienda 🛍️👇"*

---

### 💬 OPCIÓN 3: Para enviar por WhatsApp o Mensaje Privado
> *"¡Hola bella! 🌸 Te pasamos toda la info: ${rawContent}. Podés abonar en hasta 3 cuotas sin interés o con un 20% OFF por transferencia bancaria. Si tenés alguna duda sobre el envío o detalles, ¡escribinos por acá que te ayudamos con mucho amor! 💕"*

---

### 💡 ¿Qué cambios le hicimos y por qué?
1. **Gancho inicial (Hook):** Le agregamos una primera línea atrapante para que frenen el scroll al instante.
2. **Estructura en viñetas:** Reorganizamos los puntos clave para que se lean en 3 segundos.
3. **Llamado a la acción (CTA):** Sumamos las facilidades de pago (3 cuotas / 20% OFF) y el link a la bio para cerrar la venta.

¿Te gusta cómo quedó o querés que ajustemos alguna frase puntual? ¡Decime! 💖`;
  }

  // 2. DÍA DE LA MADRE / ÁLBUM DE FIGURITAS / FOTOS
  if (queryLower.includes('madre') || queryLower.includes('mama') || queryLower.includes('mamá') || queryLower.includes('álbum') || queryLower.includes('album') || queryLower.includes('figurita') || queryLower.includes('foto')) {
    return `🌸 ¡Hola Flor! El **Álbum de Figuritas para el Día de la Madre** es sin dudas tu producto estrella con mayor potencial de venta emocional 💕.

Acá tenés un plan de acción directo con ideas y copys listos para usar:

---

### 📸 1. Ideas para Stories & Reels (Instagram / TikTok)
* **Reel Emocional (15 seg):** Mostrá cómo abrís uno de los 5 sobres de figuritas y pegás una foto linda con mamá mientras suena una música dulce de fondo.
  * **Texto en pantalla:** *"El regalo para mamá que la va a hacer llorar de emoción (de la linda) 🥹💖"*
  * **Voz en off / Audio:** *"Si todavía no sabés qué regalarle, este álbum viene con 31 fotos de sus mejores momentos para abrir en sobres y pegar juntos."*
* **Story de Urgencia (Cupos de Producción):**
  * *"Chicas, como cada álbum se diseña e imprime 100% personalizado con sus 31 fotos, los cupos para llegar antes del Día de la Madre son limitados ⏳ ¡No se cuelguen con el envío de fotos!"*

---

### 🎁 2. Copy listo para publicar en Instagram:
> *"¿Buscás un regalo que no quede guardado en un cajón? 🎀✨*
> 
> *Nuestro **Álbum de Figuritas Personalizado para Mamá** incluye:*
> * 📖 Álbum para completar y guardar para siempre
> * 💌 5 sobres con 31 fotos figuritas autoadhesivas
> * 🌸 Tarjeta especial Día de la Madre
> * 🏷️ Stickers edición especial + Sobre transparente
> 
> *Hacés tu pedido en la web, nos mandás tus 31 fotos por WhatsApp o mail a contacto.mflower@gmail.com y nosotras nos encargamos de toda la magia 🪄*
> 
> *📦 Envíos a todo el país o retiro por General Rodríguez.*
> *💳 Hasta 3 cuotas sin interés | 💸 20% OFF con transferencia*
> *🔗 Link en bio para asegurar el tuyo antes de que cerremos pedidos!"*

---

### 💡 3. Mensaje para pedir las fotos por WhatsApp:
> *"¡Hola [Nombre]! 🌸 Te escribimos de M•flower con mucho cariño por tu compra #[NroPedido] del Álbum de Figuritas para Mamá 💕. ¡Ya tenemos tu pedido listo para entrar a taller! Acordate de enviarnos por acá tus 31 fotos (30 verticales y 1 horizontal) para que lo diseñemos e imprimamos a tiempo para el Día de la Madre ✨"*

¿Querés que adaptemos algún punto o preparemos más contenido? ¡Decime y lo armamos! 💖`;
  }

  // 3. COPYS GENERALES / REDES SOCIALES
  if (queryLower.includes('copy') || queryLower.includes('texto') || queryLower.includes('instagram') || queryLower.includes('tiktok') || queryLower.includes('reel') || queryLower.includes('storie') || queryLower.includes('historia') || queryLower.includes('post') || queryLower.includes('redes')) {
    return `✨ ¡Hola Flor! Acá tenés opciones de copys irresistibles para redes sociales, pensados para conectar y vender en M•flower:

---

### 🎀 Opción 1: Enfoque "Organización & Estilo" (Planners y Cuadernos)
**Hook:** *"Si tu cabeza va a mil y necesitás poner orden con estilo, esto es para vos 🌸"*
**Cuerpo:**
*"Nuestros planners y cuadernos con sistema inteligente de discos te permiten mover, sacar y agregar hojas cuando quieras ✨ Papel súper grueso que no traspasa, diseños exclusivos y todo el mood aesthetic que tu escritorio necesita.*
*¿Cuál es tu favorito: tamaño A5 o Midi Block? 💖"*
**CTA:** *"🛍️ Conseguí el tuyo en www.mflower.store (3 cuotas sin interés y 20% OFF por transferencia)"*
**Hashtags:** \`#papeleria #stationery #plannerlover #mflower #organizacion #hechoenargentina\`

---

### 🎁 Opción 2: Enfoque "Sets de Regalo Listos para Entregar"
**Hook:** *"El regalo perfecto existe y ya viene listo en sobre PVC con tarjeta 🎀"*
**Cuerpo:**
*"Armamos nuestros sets especiales (Set Organízate, Cherry y Bloom) con todo lo que una amante de la papelería sueña: libreta, resaltadores pastel, lapicera kawaii y stickers decorativos.*
*Ideal para regalar a una amiga, compañera de trabajo o para auto-mimarte 🥰"*
**CTA:** *"💌 Pedilo hoy en la web y te lo enviamos a cualquier punto del país."*

---

### 📱 Tip para Stories Interactivas:
Hacé una encuesta de 2 opciones: *"¿Sos team Libreta rayada 📝 o punteada/bullet journal 🪄?"* — Esto genera hasta un 40% más de interacción con tus seguidoras.

💡 **Recordá:** Si ya tenés un borrador escrito por vos, ¡pegámelo acá y te lo mejoro al instante! 🌸`;
  }

  // 4. PROMOS / DESCUENTOS / CUPONES / FIN DE SEMANA
  if (queryLower.includes('promo') || queryLower.includes('descuento') || queryLower.includes('cupon') || queryLower.includes('cupón') || queryLower.includes('oferta') || queryLower.includes('finde') || queryLower.includes('semana') || queryLower.includes('combo')) {
    return `🛍️ ¡Hola Flor! Analizando tu ticket promedio actual ($${avgTicket}) y el catálogo de M•flower, te propongo 3 promociones muy efectivas:

---

### 1️⃣ "Envío Bonificado / Flat Rate a partir de $25.000"
* **Por qué funciona:** El costo de envío es la principal causa de carritos abandonados (${abandonedCount} carritos en espera).
* **Cómo comunicarlo:** *"¡Este fin de semana tu pedido viaja con descuento! Superando los $25.000 tenés envío bonificado para mimarte sin culpa 📦✨"*

---

### 2️⃣ "Cupón Regalo Sorpresa: REGALOMARIA"
* **Mecánica:** Creás el cupón \`REGALOMARIA\` en tu pestaña de Cupones.
* **El incentivo:** *"Con tu compra de $20.000 o más, usá el cupón REGALOMARIA y te sumamos un Mini Resaltador Pastel + Plancha de Stickers de regalo en tu paquete 🎁🎀"*
* **Costo mínimo para vos**, pero altísimo valor percibido para la clienta.

---

### 3️⃣ "Combo 3x2 o 2do producto al 50% en Libretas & Blocks"
* **Ideal para:** Aumentar la cantidad de unidades por pedido (unidades por ticket).
* Si una clienta compra un Cuaderno o Planner, ofreceles llevar una Libreta A5 o un Baby Block con 30% OFF directo.

¿Cuál de estas opciones te gusta más para lanzar en tus historias hoy? 🌸`;
  }

  // 5. VENTAS / TICKET PROMEDIO / CONVERSIÓN / CARRITOS
  if (queryLower.includes('ticket') || queryLower.includes('vender') || queryLower.includes('venta') || queryLower.includes('conversion') || queryLower.includes('carrito') || queryLower.includes('abandonado') || queryLower.includes('crecer')) {
    return `📈 ¡Hola Flor! Con **${ordersCount} pedidos registrados** y un ticket promedio de **$${avgTicket}**, acá tenés 3 palancas clave para disparar tus ventas:

---

### 1️⃣ Recuperación Cálida de Carritos por WhatsApp (Dentro de las 3 horas)
* Cuando una clienta cargue productos en el carrito y no finalice, enviale un WhatsApp cálido y directo desde tu pestaña **Recuperación de Carritos**:
  > *"¡Hola bella! 🌸 Vimos que te quedaron cositas hermosas en el carrito de M•flower. ¿Tuviste alguna duda con el envío o el medio de pago? Si querés te ayudamos a completarlo con 20% OFF por transferencia bancaria 💖"*
* 💡 **Efecto:** Recupera hasta 5 de cada 10 carritos sin costo publicitario.

---

### 2️⃣ Estrategia de Cross-Selling (Productos Complementarios)
* Al momento del empaquetado y en la tienda, sugerí productos de bajo costo para sumar al pedido:
  * Resaltadores pastel (suman $2.500 - $4.000 al ticket)
  * Planchas de stickers decorativos
  * Repuestos de hojas para cuadernos con discos
* Si cada compra suma un ítem pequeño, tu facturación mensual sube automáticamente un 15% a 20%.

---

### 3️⃣ El Poder de la Transferencia Bancaria (20% OFF)
* Recordá siempre en historias que pagando por transferencia tienen **20% OFF real e inmediato**. A las clientas argentinas les encanta aprovechar ese descuento directo.

¿Querés que nos enfoquemos en armar un mensaje específico para tus clientas? 🌸`;
  }

  // 6. DEFAULT GENERAL PERSONALIZADO
  return `🌸 ¡Hola Flor! Sobre lo que me comentás: *"**${userQuery}**"*, acá tenés recomendaciones directas para M•flower:

---

### 💡 1. Enfoque Práctico:
Para cualquier acción que quieras implementar en tu tienda (promos, textos o atención):
* Mantené siempre el tono dulce, estético y cercano de M•flower.
* Destacá los beneficios reales: personalización, calidad de encuadernación y rapidez de entrega.
* Facilitá el pago recordando las **3 cuotas sin interés** y el **20% OFF con transferencia bancaria**.

---

### ✨ ¿Qué te gustaría que hagamos ahora con esto?
* 📝 **¿Tenés un borrador o copy que quieras que te mejore o acorte?** ¡Pegalo acá tal cual lo tengas y te armo 3 versiones listas!
* 📸 **¿Querés que te prepare ideas de historias o reels para filmar hoy?**
* 💌 **¿Necesitás que redactemos un mensaje para tus clientas de WhatsApp o email?**

¡Escribime lo que tengas en mente y lo trabajamos juntas! 💖`;
}

export async function POST(req) {
  try {
    const { message, storeData } = await req.json();

    const userMessage = message || '';
    let replyText = null;

    // If a valid Google AI Studio key is configured in env, try calling Gemini API
    if (GEMINI_API_KEY && GEMINI_API_KEY.startsWith('AIzaSy')) {
      const productsSummary = storeData?.productsList && Array.isArray(storeData.productsList) && storeData.productsList.length > 0
        ? storeData.productsList.slice(0, 25).join(', ')
        : 'Álbum de Figuritas Día de la Madre, Planners semanales, Cuadernos inteligentes con discos, Libretas A5, Blocks A4/A5, Resaltadores pastel, Ficheros, Stickers, Sets de Regalo';

      const systemPrompt = `Sos el Asesor Estratégico e Integral de Inteligencia Artificial de "M•flower by Maria", la tienda online de papelería girly, diseño y regalos de Argentina.
Trabajás codo a codo con Flor (la creadora y dueña). Respondé con entusiasmo, emojis aesthetic (🌸✨🛍️💖), y consejos 100% prácticos y aplicables para lo que ella te pregunte.
Si Flor te manda un copy o texto propio para mejorar, analizalo, reescribilo en 3 versiones (Feed, Stories, WhatsApp) y explicá qué cambios hiciste.`;

      const fullPrompt = `${systemPrompt}\n\nMensaje de Flor:\n"${userMessage}"\n\nTu respuesta directa como asesor de M•flower:`;

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
        } catch (e) {
          // fallback
        }
      }
    }

    if (!replyText) {
      replyText = generateSmartAdvisorResponse(userMessage, storeData);
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('API Advisor error:', error);
    const fallback = generateSmartAdvisorResponse(message || '', {});
    return NextResponse.json({ reply: fallback }, { status: 200 });
  }
}
