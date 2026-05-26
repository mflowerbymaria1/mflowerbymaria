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

export async function generateShippingLabel(order) {
    const token = process.env.ENVIA_API_TOKEN;

    try {
        // Parse address string into components
        const addressStr = order.shipping_address || '';
        
        // Find 4-digit postal code
        const cpMatch = addressStr.match(/\b\d{4}\b/);
        const postalCode = cpMatch ? cpMatch[0] : "1748"; // default to General Rodriguez CP if not found

        // Split address by comma
        const parts = addressStr.split(',');
        const streetFull = parts[0] || 'Calle';
        const city = parts[1] ? parts[1].trim() : 'Buenos Aires';

        // Extract house number if possible
        const streetParts = streetFull.trim().split(' ');
        let number = "S/N";
        let street = streetFull;
        if (streetParts.length > 1) {
            const lastPart = streetParts[streetParts.length - 1];
            if (/^\d+$/.test(lastPart)) {
                number = lastPart;
                street = streetParts.slice(0, -1).join(' ');
            }
        }

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
                    phone: "1141817424",
                    street: "Centro",
                    number: "123",
                    district: "Centro",
                    postalCode: "1748",
                    city: "General Rodriguez",
                    state: "BA",
                    country: "AR"
                },
                destination: {
                    name: order.customer_name || "Cliente",
                    email: order.customer_email || "cliente@email.com",
                    phone: order.customer_phone || "1100000000",
                    street: street,
                    number: number,
                    district: city,
                    postalCode: postalCode,
                    city: city,
                    state: "BA",
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
        if (data.data && data.data.length > 0) {
            return { success: true, data: data.data[0] };
        } else {
            const errMsg = data.error?.message || data.message || JSON.stringify(data);
            return { success: false, error: errMsg };
        }
    } catch (error) {
        console.error('Error en Envía API (Generate):', error);
        return { success: false, error: error.message };
    }
}
