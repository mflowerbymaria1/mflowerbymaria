import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOrderNotificationAdmin(orderData) {
    try {
        const { id, customer_name, customer_email, customer_phone, total_amount, payment_status, shipping_method, items, notes } = orderData;
        
        let itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name || item.products?.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">$${Number(item.price || item.unit_price || 0).toLocaleString('es-AR')}</td>
            </tr>
        `).join('');

        const subject = `¡Nueva Venta! 🌸 Pedido #${String(id).slice(0, 8)} por $${Number(total_amount).toLocaleString('es-AR')}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <h1 style="color: #D47792; text-align: center;">¡Felicidades, tenés una nueva venta! 🎉</h1>
                <p style="font-size: 16px; color: #555;">Acaba de ingresar un nuevo pedido en tu tienda online.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <h2 style="font-size: 18px; margin-top: 0; color: #333;">Detalles del Cliente</h2>
                    <p style="margin: 5px 0;"><strong>Nombre:</strong> ${customer_name}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${customer_email}</p>
                    <p style="margin: 5px 0;"><strong>WhatsApp:</strong> <a href="https://wa.me/${customer_phone?.replace(/\D/g, '')}" style="color: #25D366; text-decoration: none; font-weight: bold;">${customer_phone} (Click para abrir)</a></p>
                    ${notes ? `
                    <div style="margin-top: 15px; padding: 10px; background-color: #fff; border-left: 4px solid #D47792; border-radius: 4px;">
                        <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #D47792;">📝 Notas del Pedido</h3>
                        <p style="margin: 0; font-size: 14px; color: #555;">${notes}</p>
                    </div>
                    ` : ''}
                </div>

                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <h2 style="font-size: 18px; margin-top: 0; color: #333;">Resumen del Pedido #${String(id).slice(0, 8)}</h2>
                    <p style="margin: 5px 0;"><strong>Estado de Pago:</strong> <span style="color: ${payment_status === 'approved' ? 'green' : 'orange'}; text-transform: uppercase; font-weight: bold;">${payment_status}</span></p>
                    <p style="margin: 5px 0;"><strong>Envío:</strong> <span style="text-transform: capitalize;">${shipping_method}</span></p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
                        <thead>
                            <tr style="background-color: #eee;">
                                <th style="padding: 10px; text-align: left;">Producto</th>
                                <th style="padding: 10px; text-align: left;">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="padding: 10px; font-weight: bold; text-align: right;">Total:</td>
                                <td style="padding: 10px; font-weight: bold; color: #D47792; font-size: 16px;">$${Number(total_amount).toLocaleString('es-AR')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://mflowerbymaria.vercel.app/admin/ventas" style="background-color: #D47792; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">Ver pedido en el panel</a>
                </div>
            </div>
        `;

        if (!resend) {
            console.log("Resend API Key is missing. Simulating email notification for:", subject);
            return { success: true, simulated: true };
        }

        const { data, error } = await resend.emails.send({
            from: 'Mflower Store <onboarding@resend.dev>',
            to: ['contacto.mflower@gmail.com'],
            subject,
            html: htmlContent
        });

        if (error) {
            console.error("Resend error admin:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Error sending admin email:", err);
        return { success: false, error: err.message };
    }
}

export async function sendOrderNotificationCustomer(orderData) {
    try {
        const { id, customer_name, customer_email, total_amount, payment_method, payment_status, shipping_method, items } = orderData;
        
        let itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name || item.products?.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">$${Number(item.price || item.unit_price || 0).toLocaleString('es-AR')}</td>
            </tr>
        `).join('');

        const isTransfer = payment_status === 'pending' || orderData.shipping_method === 'transferencia'; // Check context if needed.

        const subject = `¡Gracias por tu compra en Mflower! 🌸 Pedido #${String(id).slice(0, 8)}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #D47792; margin-bottom: 5px;">¡Gracias por tu compra, ${customer_name.split(' ')[0]}! 🛍️</h1>
                    <p style="font-size: 16px; color: #555;">Recibimos tu pedido y ya estamos trabajando en él.</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <h2 style="font-size: 18px; margin-top: 0; color: #333;">Resumen de tu pedido #${String(id).slice(0, 8)}</h2>
                    <p style="margin: 5px 0;"><strong>Método de Envío/Retiro:</strong> <span style="text-transform: capitalize;">${shipping_method}</span></p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
                        <thead>
                            <tr style="background-color: #eee;">
                                <th style="padding: 10px; text-align: left;">Producto</th>
                                <th style="padding: 10px; text-align: left;">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="padding: 10px; font-weight: bold; text-align: right;">Total:</td>
                                <td style="padding: 10px; font-weight: bold; color: #D47792; font-size: 16px;">$${Number(total_amount).toLocaleString('es-AR')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                ${payment_method === 'transferencia' ? `
                <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #ffeeba; text-align: center;">
                    <h3 style="margin-top: 0; font-size: 16px;">⏳ Pendiente de Pago</h3>
                    <p style="margin: 5px 0 15px 0; font-size: 14px;">Recuerda que si elegiste pago por transferencia, tu pedido se procesará una vez que confirmemos el ingreso del dinero.</p>
                    <a href="https://wa.me/5491141817424?text=Hola,%20soy%20${encodeURIComponent(customer_name)}.%20Te%20env%C3%ADo%20el%20comprobante%20de%20mi%20pedido%20%23${String(id).slice(0, 8)}" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-weight: bold; font-size: 14px; display: inline-block;">📱 Enviar comprobante por WhatsApp</a>
                </div>
                ` : `
                <div style="background-color: #e8f5e9; color: #2e7d32; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #c8e6c9; text-align: center;">
                    <h3 style="margin-top: 0; font-size: 16px;">💳 Pago Electrónico</h3>
                    <p style="margin: 5px 0 15px 0; font-size: 14px;">El pago se gestiona a través de Mercado Pago de forma 100% segura. Si el pago fue exitoso, no tenés que hacer nada más, ¡ya estamos preparando todo!</p>
                    <a href="https://wa.me/5491141817424?text=Hola,%20soy%20${encodeURIComponent(customer_name)}.%20Tengo%20una%20consulta%20sobre%20mi%20pedido%20%23${String(id).slice(0, 8)}" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-weight: bold; font-size: 14px; display: inline-block;">📱 Consultas por WhatsApp</a>
                </div>
                `}
                
                <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #777;">
                    <p>Si tenés alguna consulta, no dudes en responder este correo o contactarnos por WhatsApp.</p>
                    <p><strong>Mflower Store</strong></p>
                </div>
            </div>
        `;

        if (!resend) {
            console.log("Resend API Key is missing. Simulating customer email for:", subject);
            return { success: true, simulated: true };
        }

        const { data, error } = await resend.emails.send({
            from: 'Mflower Store <contacto@mflower.store>',
            to: [customer_email],
            subject,
            html: htmlContent
        });

        if (error) {
            console.error("Resend error customer:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Error sending customer email:", err);
        return { success: false, error: err.message };
    }
}
