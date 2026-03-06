"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { useFavorites } from "../../store/FavoritesContext";
import Link from "next/link";

export default function FavoritosPage() {
    const { favorites } = useFavorites();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-background py-16">
                <div className="container">
                    <div className="text-center mb-12">
                        <h1 className="font-quicksand text-4xl text-pink font-bold mb-4">Mis Favoritos</h1>
                        <p className="text-gray-600">Todos los productos que te enamoraron, en un solo lugar.</p>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-pink-light">
                            <span className="text-6xl mb-4 block">💕</span>
                            <h2 className="text-2xl font-quicksand font-bold text-gray-800 mb-2">Aún no tenés favoritos</h2>
                            <p className="text-gray-500 mb-6">Explorá nuestra tienda y dale corazón a lo que más te guste.</p>
                            <Link href="/productos" className="bg-pink text-white px-8 py-3 rounded-full font-bold hover:bg-pink-dark transition-colors inline-block">
                                Ver Productos
                            </Link>
                        </div>
                    ) : (
                        <div className="favorites-grid">
                            {favorites.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            <style>{`
                .favorites-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }
                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .min-h-screen { min-height: 100vh; }
                .flex-grow { flex-grow: 1; }
                .text-center { text-align: center; }
                .mb-12 { margin-bottom: 3rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
                .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
                .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                .text-6xl { font-size: 3.75rem; line-height: 1; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .font-bold { font-weight: 700; }
                .text-gray-600 { color: #4B5563; }
                .text-gray-800 { color: #1f2937; }
                .text-gray-500 { color: #6B7280; }
                .bg-white { background-color: #ffffff; }
                .rounded-2xl { border-radius: 1rem; }
                .rounded-full { border-radius: 9999px; }
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .border { border-width: 1px; }
                .border-pink-light { border-color: #fce7f3; }
                .block { display: block; }
                .inline-block { display: inline-block; }
                .bg-pink { background-color: var(--pastel-pink); }
                .text-white { color: #ffffff; }
                .px-8 { padding-left: 2rem; padding-right: 2rem; }
                .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                .hover\\:bg-pink-dark:hover { background-color: #D47792; }
                .transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-duration: 150ms; }
                
                @media (max-width: 900px) {
                    .favorites-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .favorites-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
