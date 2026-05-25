"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-background py-16">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                        <h1 className="font-quicksand text-3xl md:text-4xl text-pink font-bold mb-8 text-center">
                            Preguntas Frecuentes (FAQ)
                        </h1>

                        <div className="faq-content space-y-8 text-gray-700 leading-relaxed font-montserrat">

                            <div className="faq-category">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                                    Sobre los Vasos y Tazas
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800">¿Cómo están intervenidos los vasos?</h3>
                                        <p className="mt-1">Todos nuestros vasos de vidrio aesthetic y tazas están intervenidos con tecnología <strong>DTF UV</strong>. Esto les da un relieve muy lindo y colores súper vibrantes.</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">¿Cómo debo lavar mi vaso DTF UV?</h3>
                                        <p className="mt-1">Para que el diseño dure mucho tiempo:
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Lavalos a mano con agua fría o tibia.</li>
                                                <li>Usá la parte suave de la esponja, ¡nunca pases la esponja de metal sobre el diseño!</li>
                                                <li>No los pongas en el lavavajillas.</li>
                                                <li>No los dejes en remojo por horas.</li>
                                                <li>Secalos con un paño suave o dejalos escurrir.</li>
                                            </ul>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="faq-category">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                                    ✨ Sobre los Stickers
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800">¿Los stickers son a prueba de agua?</h3>
                                        <p className="mt-1">
                                            ¡Depende del formato!
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li><strong>Planchas de stickers:</strong> Están pensadas para uso en papel (agendas, cuadernos, planners). Tienen acabado mate, pero <em>NO</em> son resistentes al agua (no aptos para botellas o termos).</li>
                                                <li><strong>Stickers sueltos (vinilos):</strong> Estos <em>SÍ</em> son resistentes al agua. Son ideales para decorar tu compu, el termo matancero o tu botella de todos los días.</li>
                                            </ul>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="faq-category">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                                    📒 Sobre Cuadernos y Planners
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800">¿Cómo cuido los cuadernos con sistema de discos?</h3>
                                        <p className="mt-1">El sistema de discos es súper práctico porque te permite sacar y poner hojas. Para hacerlo sin dañar el papel, siempre <strong>tirá de la hoja hacia arriba o hacia abajo</strong> (cerca de los anillos), nunca hacia el costado. Así el papel no se rompe y te dura un montón.</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">¿Las tapas son resistentes?</h3>
                                        <p className="mt-1">¡Sí! Nuestras libretas y cuadernos tienen la tapa plastificada, así que si les cae una gotita de agua accidentalmente o se ensucian, podés pasarles un trapito apenas húmedo para limpiarlas sin problema. Eso sí, evitalos en zonas de mucha humedad constante.</p>
                                    </div>
                                </div>
                            </div>

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
                .mb-4 { margin-bottom: 1rem; }
                .mt-1 { margin-top: 0.25rem; }
                .mt-2 { margin-top: 0.5rem; }
                .pb-2 { padding-bottom: 0.5rem; }
                .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .p-8 { padding: 2rem; }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .font-bold { font-weight: 700; }
                .font-semibold { font-weight: 600; }
                .text-gray-700 { color: #374151; }
                .text-gray-800 { color: #1f2937; }
                .text-gray-900 { color: #111827; }
                .text-pink { color: var(--pastel-pink); }
                .bg-background { background-color: #fafafa; }
                .bg-white { background-color: #ffffff; }
                .rounded-2xl { border-radius: 1rem; }
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .border { border-width: 1px; }
                .border-b { border-bottom-width: 1px; border-bottom-color: #e5e7eb; }
                .border-gray-100 { border-color: #f3f4f6; }
                .max-w-4xl { max-width: 56rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .space-y-8 > * + * { margin-top: 2rem; }
                .space-y-4 > * + * { margin-top: 1rem; }
                .space-y-1 > * + * { margin-top: 0.25rem; }
                .leading-relaxed { line-height: 1.625; }
                .list-disc { list-style-type: disc; }
                .pl-5 { padding-left: 1.25rem; }
                .faq-category { margin-bottom: 2rem; }
                
                @media (min-width: 768px) {
                    .md\\:p-12 { padding: 3rem; }
                    .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                }
            `}</style>
        </div>
    );
}
