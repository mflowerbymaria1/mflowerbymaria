const ENVIA_BASE_URL = 'https://api.envia.com'; // Usamos producción si ya tenemos el token real

/**
 * Obtiene cotizaciones de envío
 * @param {Object} destination - { postalCode, state, city, street, number }
 */
export async function getShippingRates(destination) {
    const token = process.env.ENVIA_API_TOKEN;
    
    if (!token) {
        console.warn('Envia API Token missing.');
        return [];
    }

    try {
        const response = await fetch(`${ENVIA_BASE_URL}/ship/rate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                origin: {
                    name: "M•flower",
                    company: "M•flower by Maria",
                    email: "contacto@mflowerbymaria.com",
                    phone: "1100000000",
                    street: "Centro",
                    number: "123",
                    district: "Centro",
                    city: "General Rodriguez",
                    state: "BA",
                    category: 1,
                    country: "AR",
                    postalCode: "1748"
                },
                destination: {
                    ...destination,
                    country: "AR"
                },
                packages: [{
                    content: "Cuaderno / Planner",
                    amount: 1,
                    type: "box",
                    weight: 1,
                    insurance: 0,
                    declaredValue: 0,
                    weightUnit: "kg",
                    lengthUnit: "cm",
                    dimensions: {
                        length: 30,
                        width: 25,
                        height: 5
                    }
                }],
                shipment: {
                    carrier: "correoargentino",
                    type: 1
                }
            }),
        });

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error en Envía API (Rates):', error);
        return [];
    }
}

/**
 * Genera una etiqueta de envío
 * @param {Object} order - Datos del pedido y destino
 */
export async function generateShippingLabel(order) {
    const token = process.env.ENVIA_API_TOKEN;

    try {
        const response = await fetch(`${ENVIA_BASE_URL}/ship/generate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                origin: {
                    name: "M•flower",
                    company: "M•flower by Maria",
                    email: "contacto@mflowerbymaria.com",
                    phone: "1100000000",
                    street: "Centro",
                    number: "123",
                    postalCode: "1748",
                    city: "General Rodriguez",
                    state: "BA",
                    country: "AR"
                },
                destination: {
                    name: order.customer_name,
                    email: order.customer_email,
                    phone: order.customer_phone,
                    street: order.shipping_address.street,
                    number: order.shipping_address.number,
                    postalCode: order.shipping_address.postalCode,
                    country: "AR"
                },
                packages: [{
                    content: "Productos M•flower",
                    amount: 1,
                    type: "box",
                    weight: 1,
                    dimensions: { length: 30, width: 20, height: 10 }
                }],
                shipment: {
                    carrier: "correoargentino",
                    type: 1,
                    service: "express"
                }
            })
        });

        const data = await response.json();
        return data.data ? data.data[0] : null; // Retorna la info de la etiqueta incluyendo label_url
    } catch (error) {
        console.error('Error en Envía API (Generate):', error);
        return null;
    }
}
