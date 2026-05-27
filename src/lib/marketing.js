/**
 * Configuración de Automatización de Marketing para M•flower
 */

export const ABANDONED_CART_TEMPLATES = {
    reminder_1: {
        time: '2 horas',
        message: `¡Hola! 🌸 Vimos que estabas armando tu carrito y quedaron algunos productos hermosos esperándote. ¡No te los pierdas!\n\nPodés recuperar tu carrito y completar tu compra con un click acá: [LINK_DEL_CARRITO]\n\n¡Que tengas un hermoso día! ✨`
    },
    reminder_2: {
        time: '24 horas',
        message: `🌸 Hola de nuevo! Seguimos guardando tus productos favoritos de M•flower. ¿Tenés alguna duda con tu compra?\n\nCompletala acá: [LINK_DEL_CARRITO]\n\n¡Te esperamos! ✨`
    }
};

/**
 * Genera el mensaje final reemplazando variables
 */
export function formatReminderMessage(templateKey, cartId, customerEmail) {
    const template = ABANDONED_CART_TEMPLATES[templateKey];
    if (!template) return '';

    // URL de recuperación (debería apuntar a una ruta que reconstruya el carrito)
    const recoveryLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/carrito/recuperar?id=${cartId}`;
    
    return template.message.replace('[LINK_DEL_CARRITO]', recoveryLink);
}

/**
 * Envía el recordatorio por WhatsApp (abre ventana)
 */
export function sendWhatsAppReminder(phone, message) {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, '_blank');
}
