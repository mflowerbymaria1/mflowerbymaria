"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PoliticasEnvioPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-background py-16">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                        <h1 className="font-quicksand text-3xl md:text-4xl text-pink font-bold mb-8 text-center">
                            Políticas de Envío
                        </h1>

                        <div className="policy-content space-y-6 text-gray-700 leading-relaxed font-montserrat">
                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-pink">📦</span> Tiempos de Entrega
                                </h2>
                                <p>
                                    En <strong>M•flower by Maria</strong> preparamos cada pedido con mucho amor y dedicación. Nuestro tiempo estimado de preparación y entrega es de <strong>7 a 15 días hábiles</strong> una vez confirmado el pago. Te pedimos tener en cuenta este plazo al momento de realizar tu compra.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-pink">📍</span> Zonas de Cobertura
                                </h2>
                                <p>
                                    Realizamos envíos a todo el país (Argentina). Despachamos nuestros productos desde General Rodríguez, Provincia de Buenos Aires.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-pink">🚚</span> Métodos de Envío
                                </h2>
                                <p>
                                    Trabajamos con servicios de mensajería y correos oficiales (como Correo Argentino y Andreani) para asegurar que tu paquete llegue en perfectas condiciones. El costo de envío se calculará automáticamente en el <em>Checkout</em> dependiendo de tu Código Postal.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-pink">📲</span> Seguimiento
                                </h2>
                                <p>
                                    Una vez que tu pedido sea despachado, te enviaremos por correo electrónico o WhatsApp el código de seguimiento correspondiente para que puedas rastrear el trayecto de tu paquete.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-pink">⚠️</span> Consideraciones Importantes
                                </h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Los días feriados y fines de semana no cuentan como días hábiles.</li>
                                    <li>Es responsabilidad del cliente proporcionar la dirección de entrega correcta y completa.</li>
                                    <li>Si el correo visita el domicilio y no encuentra a nadie, el paquete será enviado a la sucursal más cercana por un tiempo limitado antes de volver al remitente. En caso de devolución, se deberá abonar un nuevo envío.</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <style>{`
                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .min-h-screen { min-height: 100vh; }
                .flex-grow { flex-grow: 1; }
                .text-center { text-align: center; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .p-8 { padding: 2rem; }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .font-bold { font-weight: 700; }
                .font-semibold { font-weight: 600; }
                .text-gray-700 { color: #374151; }
                .text-gray-900 { color: #111827; }
                .text-pink { color: var(--pastel-pink); }
                .bg-background { background-color: #fafafa; }
                .bg-white { background-color: #ffffff; }
                .rounded-2xl { border-radius: 1rem; }
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .border { border-width: 1px; }
                .border-gray-100 { border-color: #f3f4f6; }
                .max-w-4xl { max-width: 56rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .space-y-6 > * + * { margin-top: 1.5rem; }
                .space-y-2 > * + * { margin-top: 0.5rem; }
                .leading-relaxed { line-height: 1.625; }
                .items-center { align-items: center; }
                .gap-2 { gap: 0.5rem; }
                .list-disc { list-style-type: disc; }
                .pl-5 { padding-left: 1.25rem; }
                
                @media (min-width: 768px) {
                    .md\\:p-12 { padding: 3rem; }
                    .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                }
            `}</style>
        </div>
    );
}
