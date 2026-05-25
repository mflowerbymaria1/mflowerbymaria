"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function ProductosContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || "";
    const categoria = searchParams.get('categoria') || "";

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*');
                
                if (!error && data) {
                    // Mapping Supabase schema to component expectations and formatting prices
                    const formatted = data.map(p => {
                        let formattedPrice = p.price;
                        if (typeof p.price === 'number') {
                            formattedPrice = p.price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        } else if (typeof p.price === 'string' && !p.price.includes('.')) {
                            const parsed = parseFloat(p.price);
                            if (!isNaN(parsed)) {
                                formattedPrice = parsed.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }
                        return {
                            ...p,
                            image: p.image_url,
                            shortDescription: p.short_description,
                            isBestSeller: p.is_best_seller,
                            price: formattedPrice
                        };
                    });
                    setAllProducts(formatted);
                } else {
                    console.error("Error fetching products from Supabase:", error);
                    setAllProducts([]);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setAllProducts([]);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    // Helper to normalize category comparison safely
    const getSlug = (cat) => {
        if (!cat) return "";
        return cat
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9]+/g, "-")    // Replace spaces/non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, "");        // Trim hyphens
    };

    // Helper to format human-readable category title
    const getCategoryTitle = (catSlug) => {
        if (!catSlug) return "Todos Nuestros Productos";
        switch (catSlug.toLowerCase()) {
            case 'cuadernos-a4': return "Cuadernos A4";
            case 'cuadernos-a5': return "Cuadernos A5";
            case 'libretas-a5': return "Libretas A5";
            case 'planners': return "Planners";
            case 'ficheros-n-3': return "Ficheros N° 3";
            case 'block-de-papeles-a5': return "Block de papeles A5";
            case 'block-de-hojas': return "Block de hojas";
            case 'set-de-separadores-de-materias': return "Set de separadores de materias";
            case 'stickers-varios': return "Stickers & Varios";
            case 'capsula-argentina': return "Cápsula Argentina";
            case 'repuestos': return "Repuestos";
            default: 
                return catSlug
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
        }
    };

    // Helper to display category description
    const getCategoryDescription = (catSlug) => {
        if (!catSlug) return "Explorá nuestra colección completa y encontrá lo que necesitás para tu espacio creativo.";
        switch (catSlug.toLowerCase()) {
            case 'cuadernos-a4': return "Nuestros cuadernos de tamaño A4 con el exclusivo sistema de discos inteligente.";
            case 'cuadernos-a5': return "Nuestros cuadernos A5 con sistema de discos para llevar tus ideas a todas partes.";
            case 'libretas-a5': return "Nuestras libretas prácticas de tamaño A5, ideales para llevar con vos.";
            case 'planners': return "Organizá tu año con nuestros planificadores semanales y mensuales perpetuos.";
            case 'ficheros-n-3': return "Organizá tus fichas de estudio o notas rápidas con nuestro sistema inteligente.";
            case 'block-de-papeles-a5': return "Papeles A5 coleccionables para tus creaciones y anotaciones.";
            case 'block-de-hojas': return "Blocks de notas y listas de tareas para organizar tu día con estilo.";
            case 'set-de-separadores-de-materias': return "Organizá y dale vida a tus materias con nuestros separadores resistentes.";
            case 'stickers-varios': return "Separadores, stickers troquelados y complementos para personalizar tus cuadernos.";
            case 'capsula-argentina': return "Edición especial y limitada inspirada en nuestra cultura nacional.";
            case 'repuestos': return "Todos los repuestos de hojas rayadas, lisas, cuadriculadas y punteadas que necesitás.";
            default: return `Explorá todos los productos en la categoría ${getCategoryTitle(catSlug)}.`;
        }
    };

    const filteredProducts = allProducts.filter(p => {
        if (categoria && getSlug(p.category) !== getSlug(categoria)) return false;
        
        if (!query) return true;
        const lowerQ = query.toLowerCase();
        return (
            p.name.toLowerCase().includes(lowerQ) ||
            p.description.toLowerCase().includes(lowerQ) ||
            (p.shortDescription && p.shortDescription.toLowerCase().includes(lowerQ))
        );
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-background py-16">
                <div className="container">
                    <div className="text-center mb-12">
                        <h1 className="font-quicksand text-4xl text-pink font-bold mb-4 flex-center justify-center">
                            {query ? `Resultados para "${query}"` : 
                                (categoria === 'capsula-argentina' ? (
                                    <>
                                        Cápsula Argentina
                                        <img src="https://flagcdn.com/w40/ar.png" alt="Argentina" style={{width: '32px', height: 'auto', objectFit: 'contain', marginLeft: '10px'}} />
                                    </>
                                ) : getCategoryTitle(categoria))
                            }
                        </h1>
                        <p className="text-gray-600">
                            {query ? "Encontramos estos productos para vos:" : getCategoryDescription(categoria)}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="w-12 h-12 border-4 border-pink border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                            <span className="text-5xl mb-4 block">🔍</span>
                            <h2 className="text-2xl font-quicksand font-bold text-gray-800 mb-2">No encontramos resultados</h2>
                            <p className="text-gray-500 mb-6">No hay productos que coincidan con tu búsqueda.</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            <style>{`
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }
                .flex-center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
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
                .text-5xl { font-size: 3rem; line-height: 1; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .font-bold { font-weight: 700; }
                .text-gray-600 { color: #4B5563; }
                .text-gray-800 { color: #1f2937; }
                .text-gray-500 { color: #6b7280; }
                .text-pink { color: var(--pastel-pink); }
                .bg-background { background-color: #fafafa; }
                .bg-white { background-color: #fff; }
                .rounded-2xl { border-radius: 1rem; }
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .border { border-width: 1px; }
                .border-gray-100 { border-color: #f3f4f6; }
                .max-w-2xl { max-width: 42rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .block { display: block; }
                
                @media (max-width: 900px) {
                    .products-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .products-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

export default function ProductosPage() {
    return (
        <Suspense fallback={<div>Cargando productos...</div>}>
            <ProductosContent />
        </Suspense>
    );
}
