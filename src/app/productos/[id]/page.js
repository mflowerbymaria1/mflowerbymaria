"use client";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { useCart } from "../../../store/CartContext";
import { supabase } from "../../../lib/supabase";
import Logo from "../../../components/Logo";
import ShippingCalculator from "../../../components/ShippingCalculator";

export default function ProductDetailPage({ params }) {
    const { id } = use(params);
    const { addToCart, openCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [sheetType, setSheetType] = useState('rayadas');
    const [paperType, setPaperType] = useState('blanco');
    const [selectedImage, setSelectedImage] = useState(0);
    const [zoomOrigin, setZoomOrigin] = useState('center center');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                // Try to find by UUID first (the standard Supabase way)
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle();

                if (!error && data) {
                    setProduct({
                        ...data,
                        image: data.image_url,
                        images: data.image_url ? [data.image_url, ...(data.gallery || [])] : (data.gallery || []),
                        shortDescription: data.short_description,
                        isBestSeller: data.is_best_seller,
                        // Format price for display
                        price: typeof data.price === 'number'
                            ? data.price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                            : data.price
                    });
                    if (data.name.toLowerCase().includes('libreta')) {
                        setSheetType('lisas');
                        setPaperType('blanco');
                    }

                    // Fetch related products from the same category
                    const { data: related, error: relError } = await supabase
                        .from('products')
                        .select('id, name, price, image_url, short_description')
                        .eq('category', data.category)
                        .neq('id', data.id)
                        .limit(4);
                    if (!relError && related) {
                        setRelatedProducts(related.map(p => ({
                            ...p,
                            price: typeof p.price === 'number'
                                ? p.price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                                : p.price
                        })));
                    }
                }
            } catch (err) {
                console.error("Error al obtener detalles del producto:", err);
            }
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 border-4 border-pink border-t-transparent rounded-full animate-spin"></div></div>;

    if (!product) {
        return notFound();
    }

    // IDs de productos estáticos que necesitan opciones (compatibilidad)
    const notebookIds = [2, 5, 9, 11, 12, 13];
    const ficheroIds = [4, 7, 14];

    // Lógica para detectar si es cuaderno por nombre si no es ID estático
    const isNotebook = notebookIds.includes(Number(product.id)) || product.name.toLowerCase().includes('cuaderno') || product.name.toLowerCase().includes('libreta');
    const isFichero = ficheroIds.includes(Number(product.id)) || product.name.toLowerCase().includes('fichero');
    const isLibreta = product.name.toLowerCase().includes('libreta');

    const needsNotebookOptions = isNotebook;
    const needsFicheroOptions = isFichero;

    // Descripción introductoria cálida según categoría/producto
    const getIntroDescription = () => {
        const name = product.name || '';
        const cat = (product.category || '').toLowerCase();

        // Overrides específicos por producto
        if (name.includes('Notas borrables')) return 'Escribí, borrá y volvé a escribir. Perfectas para listas de tareas, recordatorios o mensajes temporales. Una forma práctica y sustentable de tener siempre a mano lo que necesitás recordar.';
        if (name.includes('Set Escolar')) return 'Todo lo que necesitás para arrancar las clases con la mejor onda. Un combo completo con cuaderno, separadores y stickers para que tengas todo organizado y lindo desde el primer día.';
        if (name.includes('Vaso')) return 'Llevá tu bebida favorita a todos lados con estilo argentino. Mantiene tus bebidas frías o calientes por más tiempo. Perfecto para el mate, el café o lo que más te guste.';
        if (name.includes('Planner')) return 'Planificá tu semana y tu mes con claridad y tranquilidad. Un planner pensado para ayudarte a organizar tus tiempos, metas y tareas diarias. Interior perpetuo: empezá a usarlo cuando quieras, sin fechas fijas.';

        // Por categoría (usando includes para cubrir variantes con emojis, plurales, etc.)
        if (cat.includes('cuaderno') && cat.includes('a4')) return 'Tu compañero ideal para la facu, el trabajo o tus proyectos creativos. Con sistema de discos inteligente, podés agregar, quitar y reorganizar hojas cuando quieras. Diseñado para acompañarte en cada idea, cada clase y cada momento de inspiración.';
        if (cat.includes('cuaderno') && cat.includes('a5')) return 'Compacto y versátil, perfecto para llevar a todos lados. Con sistema de discos inteligente que te permite personalizarlo a tu gusto. Ideal para tomar notas rápidas, hacer listas o dejar volar tu creatividad donde sea que estés.';
        if (cat.includes('libreta')) return 'Liviana y práctica, tu aliada para el día a día. Perfecta para anotar ideas sueltas, listas de pendientes o esos pensamientos que no querés olvidar. Llevala en la cartera, la mochila o tenela siempre a mano.';
        if (cat.includes('fichero')) return 'Organizá tus fichas de estudio con estilo. Ideal para resumir materias, repasar antes de un examen o tener tus notas siempre ordenadas. Con sistema de discos inteligente para agregar y reorganizar fichas fácilmente.';
        if (cat.includes('planner')) return 'Planificá tu semana y tu mes con claridad y tranquilidad. Un planner pensado para ayudarte a organizar tus tiempos, metas y tareas diarias. Interior perpetuo: empezá a usarlo cuando quieras, sin fechas fijas.';
        if (cat.includes('block')) return 'Hojas sueltas de alta calidad para darle rienda suelta a tu creatividad. Ideales para dibujar, escribir, hacer collages o usarlas como complemento de tus cuadernos y journals.';
        if (cat.includes('repuesto')) return 'Dale vida nueva a tu cuaderno o fichero con hojas de recambio de alta calidad. Papel suave y resistente que hace que escribir sea un placer. Porque tu cuaderno merece siempre hojas nuevas y frescas.';
        if (cat.includes('separador')) return 'Mantenelo todo organizado y fácil de encontrar. Los separadores te ayudan a dividir materias, proyectos o secciones de tu cuaderno para que nunca pierdas de vista lo importante.';
        if (cat.includes('sticker') || cat.includes('varios')) return 'Dale tu toque personal a todo lo que uses. Perfectos para decorar cuadernos, libretas, notebooks o cualquier superficie. Porque los detalles hacen la diferencia.';
        if (cat.includes('argentina') || cat.includes('cápsula')) return 'Llevá el orgullo argentino a todos lados. Diseños exclusivos inspirados en nuestra cultura y tradición, para que cada producto cuente una historia que nos representa.';

        return '';
    };

    const introDescription = getIntroDescription();

    const priceStr = product.price ? String(product.price) : "0";
    const numericPrice = parseFloat(priceStr.replace(/\./g, '')) || 0;
    const installmentPrice = ((numericPrice * quantity) / 3).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const transferPrice = ((numericPrice * quantity) * 0.8).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const handleAddToCart = () => {
        let productToAdd = { ...product, product_id: product.id };
        if (needsNotebookOptions) {
            productToAdd = {
                ...productToAdd,
                id: `${product.id}-${sheetType}-${paperType.replace(/\s+/g, '-')}`,
                name: `${product.name} (${sheetType}, ${paperType})`
            };
        } else if (needsFicheroOptions) {
            productToAdd = {
                ...productToAdd,
                id: `${product.id}-${paperType.replace(/\s+/g, '-')}`,
                name: `${product.name} (${paperType})`
            };
        }

        addToCart(productToAdd, quantity);
        openCart();
    };

    const imagesToDisplay = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);

    const decreaseQty = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
    const increaseQty = () => setQuantity(prev => prev + 1);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomOrigin(`${x}% ${y}%`);
    };

    const handleMouseLeave = () => {
        setZoomOrigin('center center');
    };

    const getCategorySlug = (cat) => {
        if (!cat) return "";
        return cat
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const categorySlug = product ? getCategorySlug(product.category) : "";
    const backUrl = categorySlug ? `/productos?categoria=${categorySlug}` : '/productos';
    const backLabel = product && product.category ? `Volver a ${product.category}` : 'Volver a todos los productos';

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-background py-16">
                <div className="container">
                    <div className="mb-6">
                        <Link href={backUrl} className="back-link">
                            ← {backLabel}
                        </Link>
                    </div>

                    <div className="product-detail-layout">
                        <div className="product-gallery">
                            {/* Imagen del Producto  con Zoom y Flechas */}
                            {product.category && product.category.toLowerCase().includes('planner') ? (
                                <div className="product-image-container group align-center relative" style={{ overflow: 'hidden' }}>
                                    <div 
                                        className="zoom-image-wrapper w-full h-full"
                                        style={{ position: 'relative', width: '100%', height: '100%' }}
                                    >
                                        <img
                                            src={product.image_url || product.image}
                                            alt={product.name}
                                            className="product-image"
                                            style={{ filter: 'blur(8px)', opacity: 0.6, mixBlendMode: 'normal' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                            zIndex: 10
                                        }}>
                                            <span style={{
                                                backgroundColor: '#D47792',
                                                color: 'white',
                                                fontWeight: '800',
                                                fontSize: '1rem',
                                                padding: '10px 20px',
                                                borderRadius: '20px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                boxShadow: '0 4px 12px rgba(212,119,146,0.3)'
                                            }}>
                                                Próximamente
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="product-image-container group align-center relative" style={{ overflow: 'hidden' }}>
                                        {imagesToDisplay.length > 0 ? (
                                            <>
                                                <div 
                                                    className="zoom-image-wrapper w-full h-full"
                                                    onMouseMove={handleMouseMove}
                                                    onMouseLeave={handleMouseLeave}
                                                    onClick={() => setIsLightboxOpen(true)}
                                                    style={{ cursor: 'zoom-in' }}
                                                >
                                                    <img
                                                        src={imagesToDisplay[selectedImage]}
                                                        alt={product.name}
                                                        className="product-image"
                                                        style={{ transformOrigin: zoomOrigin }}
                                                    />
                                                </div>
                                                {/* Flechas de navegación */}
                                                {imagesToDisplay.length > 1 && (
                                                    <>
                                                        <button
                                                            className="gallery-arrow left-arrow"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedImage(prev => prev === 0 ? imagesToDisplay.length - 1 : prev - 1);
                                                            }}
                                                            aria-label="Imagen anterior"
                                                        >
                                                            ❮
                                                        </button>
                                                        <button
                                                            className="gallery-arrow right-arrow"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedImage(prev => prev === imagesToDisplay.length - 1 ? 0 : prev + 1);
                                                            }}
                                                            aria-label="Siguiente imagen"
                                                        >
                                                            ❯
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="product-image-placeholder bg-green">
                                                <Logo size="large" color="#4A8C55" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Miniaturas */}
                                    {imagesToDisplay.length > 1 && (
                                        <div className="gallery-thumbnails">
                                            {imagesToDisplay.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    className={`thumbnail-btn ${selectedImage === idx ? 'active' : ''}`}
                                                    onClick={() => setSelectedImage(idx)}
                                                >
                                                    <img src={img} alt={`${product.name} miniatura ${idx + 1}`} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Detalles del Producto */}
                        <div className="product-info-container">
                            <h1 className="product-title font-quicksand">{product.name}</h1>

                            <div className="price-box">
                                <span className="main-price">${(numericPrice * quantity).toLocaleString('es-AR')}</span>
                                <div className="payment-methods">
                                    <p className="installments">💳 Hasta <strong>3 cuotas sin interés</strong> de ${installmentPrice}</p>
                                    <p className="transfer-discount">💸 <strong>${transferPrice}</strong> con transferencia bancaria <span className="badge-20">20% OFF</span></p>
                                    <button className="view-payment-btn" onClick={() => setShowPaymentModal(true)}>
                                        Ver cuotas y medios de pago
                                    </button>
                                </div>
                            </div>

                            <div className="description-box">
                                <h3 className="desc-title font-quicksand">Descripción</h3>
                                {introDescription && (
                                    <p className="intro-desc-text">{introDescription}</p>
                                )}
                                <div className="tech-desc-section">
                                    <h4 className="tech-desc-label font-quicksand">Detalle del producto</h4>
                                    <p className="desc-text">{product.description}</p>
                                </div>
                            </div>

                            <div className="actions-box">
                                {needsNotebookOptions && (
                                    <div className="sheet-selector-box">
                                        <h4 className="font-quicksand font-bold mb-2 text-gray-800">Tipo de hojas</h4>
                                        <div className="flex gap-3 flex-wrap">
                                            {isLibreta ? (
                                                <button className="sheet-btn active">Lisas</button>
                                            ) : (
                                                <>
                                                    <button className={`sheet-btn ${sheetType === 'rayadas' ? 'active' : ''}`} onClick={() => setSheetType('rayadas')}>Rayadas</button>
                                                    <button className={`sheet-btn ${sheetType === 'lisas' ? 'active' : ''}`} onClick={() => setSheetType('lisas')}>Lisas</button>
                                                    <button className={`sheet-btn ${sheetType === 'cuadriculadas' ? 'active' : ''}`} onClick={() => setSheetType('cuadriculadas')}>Cuadriculadas</button>
                                                    <button className={`sheet-btn ${sheetType === 'punteadas' ? 'active' : ''}`} onClick={() => setSheetType('punteadas')}>Punteadas</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {(needsNotebookOptions || needsFicheroOptions) && (
                                    <div className="sheet-selector-box">
                                        <h4 className="font-quicksand font-bold mb-2 text-gray-800">Tipo de papel</h4>
                                        <div className="flex gap-3">
                                            {isNotebook && !isLibreta && (
                                                <button className={`sheet-btn ${paperType === 'natural' ? 'active' : ''}`} onClick={() => setPaperType('natural')}>Natural</button>
                                            )}
                                            <button className={`sheet-btn ${paperType === 'blanco' ? 'active' : ''}`} onClick={() => { setPaperType('blanco'); }}>Blanco</button>
                                        </div>
                                    </div>
                                )}
                                <div className="quantity-selector">
                                    <button className="qty-btn" onClick={decreaseQty} aria-label="Disminuir cantidad" disabled={product.stock <= 0}>-</button>
                                    <span className="qty-display">{product.stock <= 0 ? 0 : quantity}</span>
                                    <button className="qty-btn" onClick={() => {
                                        if (quantity < product.stock) {
                                            increaseQty();
                                        }
                                    }} aria-label="Aumentar cantidad" disabled={product.stock <= 0 || quantity >= product.stock}>+</button>
                                </div>
                                <button 
                                    className="add-to-cart-btn-large" 
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    style={product.stock <= 0 ? { backgroundColor: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed', boxShadow: 'none' } : {}}
                                >
                                    {product.stock <= 0 ? 'Sin Stock' : 'Agregar al carrito'}
                                </button>
                                <div className="shipping-info">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <rect x="1" y="3" width="15" height="13"></rect>
                                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                    </svg>
                                    <span>Envíos a todo el país o retiro por General Rodríguez.</span>
                                </div>

                                <div className="production-delay-info">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {isFichero ? (
                                        <span><strong>Plazo de despacho:</strong> Dentro de las 72 hs hábiles (adicional al tiempo del correo).</span>
                                    ) : (
                                        <span><strong>Plazo de fabricación/despacho:</strong> De 7 a 14 días según disponibilidad de stock (adicional al tiempo del correo).</span>
                                    )}
                                </div>

                                <div className="shipping-calc-wrapper">
                                    <ShippingCalculator />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos Relacionados */}
                    {relatedProducts.length > 0 && (
                        <div className="related-products-section">
                            <h2 className="related-title font-quicksand">Productos Relacionados</h2>
                            <div className="related-grid">
                                {relatedProducts.map(relProd => (
                                    <Link key={relProd.id} href={`/productos/${relProd.id}`} style={{ textDecoration: 'none' }}>
                                        <div className="related-card">
                                            <div className="related-image-wrapper">
                                                <img src={relProd.image_url} alt={relProd.name} className="related-image" />
                                            </div>
                                            <h3 className="related-card-title">{relProd.name}</h3>
                                            <p className="related-card-desc">{relProd.short_description}</p>
                                            <span className="related-card-price">${relProd.price}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="product-page-disclaimer">Nota: Las imágenes son ilustrativas. Los colores pueden variar según pantalla. Los discos del sistema inteligente pueden variar según disponibilidad.</p>
                </div>
            </main>
            <Footer />

            {/* Payment Methods Modal */}
            {showPaymentModal && (
                <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setShowPaymentModal(false)}>×</button>
                        <h3 className="modal-title font-quicksand">Medios de Pago</h3>

                        <div className="payment-modal-methods">
                            <div className="pm-method">
                                <h4>💳 Mercado Pago</h4>
                                <p>Dinero en cuenta, tarjetas de débito o crédito. Hasta <strong>3 cuotas sin interés</strong>.</p>
                            </div>
                            <div className="pm-method border-t">
                                <h4>💸 Transferencia Bancaria</h4>
                                <p>Obtené un <strong>20% de descuento</strong> sobre el total de tu compra al instante.</p>
                            </div>
                        </div>

                        <button className="close-modal-btn-bottom" onClick={() => setShowPaymentModal(false)}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}
            
            {/* Fullscreen Lightbox Modal */}
            {isLightboxOpen && (
                <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
                    <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>×</button>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <img 
                            src={imagesToDisplay[selectedImage]} 
                            alt={product.name} 
                            className="lightbox-image" 
                        />
                        {imagesToDisplay.length > 1 && (
                            <>
                                <button
                                    className="lightbox-arrow left-arrow"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedImage(prev => prev === 0 ? imagesToDisplay.length - 1 : prev - 1);
                                    }}
                                >
                                    ❮
                                </button>
                                <button
                                    className="lightbox-arrow right-arrow"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedImage(prev => prev === imagesToDisplay.length - 1 ? 0 : prev + 1);
                                    }}
                                >
                                    ❯
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .product-detail-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    background: #fff;
                    padding: 3rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                }
                .product-gallery {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .product-image-container {
                    width: 100%;
                    aspect-ratio: 1;
                    border-radius: 15px;
                    overflow: hidden;
                    background-color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .zoom-image-wrapper {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.4s ease;
                }
                @media (hover: hover) {
                    .zoom-image-wrapper:hover {
                        transform: scale(1.4);
                        cursor: zoom-in;
                    }
                }
                .gallery-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.8);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: #555;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.2s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    opacity: 0;
                }
                .product-image-container:hover .gallery-arrow {
                    opacity: 1;
                }
                .gallery-arrow:hover {
                    background: white;
                    color: var(--pastel-pink);
                    transform: translateY(-50%) scale(1.1);
                }
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(255, 255, 255, 0.95);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                }
                .lightbox-content {
                    position: relative;
                    width: 90%;
                    height: 90%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lightbox-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 12px;
                    box-shadow: 0 15px 50px rgba(0,0,0,0.15);
                    animation: zoomIn 0.3s ease forwards;
                }
                @keyframes zoomIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .lightbox-close {
                    position: absolute;
                    top: 30px;
                    right: 40px;
                    font-size: 3rem;
                    color: #555;
                    background: none;
                    border: none;
                    cursor: pointer;
                    z-index: 10000;
                    transition: transform 0.2s, color 0.2s;
                }
                .lightbox-close:hover {
                    color: var(--pastel-pink);
                    transform: scale(1.1);
                }
                .lightbox-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    border: none;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    color: #333;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    transition: all 0.3s;
                    z-index: 10000;
                }
                .lightbox-arrow:hover {
                    background: var(--pastel-pink);
                    color: white;
                    transform: translateY(-50%) scale(1.1);
                }
                .left-arrow { left: 5%; }
                .right-arrow { right: 5%; }
                .product-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background-color: white;
                    mix-blend-mode: multiply;
                }
                .product-image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f3f4f6;
                }
                .gallery-thumbnails {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding-bottom: 5px;
                }
                .thumbnail-btn {
                    width: 80px;
                    height: 80px;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    padding: 0;
                    overflow: hidden;
                    cursor: pointer;
                    background-color: #fff;
                    flex-shrink: 0;
                    opacity: 0.6;
                    transition: all 0.2s ease;
                }
                .thumbnail-btn.active, .thumbnail-btn:hover {
                    opacity: 1;
                    border-color: var(--pastel-pink);
                }
                .thumbnail-btn img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    mix-blend-mode: multiply;
                }
                .product-info-container {
                    display: flex;
                    flex-direction: column;
                }
                .product-title {
                    font-size: 2.5rem;
                    color: #1f2937;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    line-height: 1.2;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
                .price-box {
                    background-color: #fafafa;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    border: 1px solid #eee;
                }
                .main-price {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #111;
                    display: block;
                    margin-bottom: 1rem;
                }
                .payment-methods {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .installments {
                    color: #4b5563;
                    font-size: 1rem;
                    margin: 0;
                }
                .transfer-discount {
                    color: #2F5D38;
                    font-size: 1rem;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .badge-20 {
                    background-color: var(--pastel-green);
                    color: #2F5D38;
                    font-size: 0.8rem;
                    font-weight: bold;
                    padding: 3px 8px;
                    border-radius: 6px;
                }
                .view-payment-btn {
                    background: none;
                    border: none;
                    color: var(--pastel-pink);
                    text-decoration: underline;
                    font-size: 0.95rem;
                    cursor: pointer;
                    padding: 0;
                    margin-top: 5px;
                    text-align: left;
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .view-payment-btn:hover {
                    color: #d18ab2;
                }
                .description-box {
                    margin-bottom: 2.5rem;
                }
                .desc-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #374151;
                    margin-bottom: 1rem;
                }
                .desc-text {
                    font-size: 1.05rem;
                    color: #6b7280;
                    line-height: 1.6;
                }
                .intro-desc-text {
                    font-size: 1.1rem;
                    color: #4b5563;
                    line-height: 1.7;
                    margin-bottom: 1.5rem;
                    padding: 1.2rem 1.4rem;
                    background: linear-gradient(135deg, #fff5f7 0%, #fdf2f8 100%);
                    border-left: 4px solid var(--pastel-pink);
                    border-radius: 0 12px 12px 0;
                    font-style: italic;
                }
                .product-page-disclaimer {
                    text-align: center;
                    font-size: 0.75rem;
                    color: #b0b0b0;
                    margin-top: 3rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #f0f0f0;
                    font-style: italic;
                }
                .tech-desc-section {
                    margin-top: 0.5rem;
                }
                .tech-desc-label {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.6rem;
                }
                .actions-box {
                    margin-top: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .sheet-selector-box {
                    margin-bottom: 0.5rem;
                }
                .sheet-btn {
                    padding: 8px 16px;
                    border: 1px solid #ccc;
                    background-color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.95rem;
                    color: #555;
                    transition: all 0.2s ease;
                }
                .sheet-btn:hover {
                    border-color: var(--pastel-pink);
                    color: var(--pastel-pink);
                }
                .sheet-btn.active {
                    background-color: var(--pastel-pink);
                    color: white;
                    border-color: var(--pastel-pink);
                    font-weight: 600;
                }
                .quantity-selector {
                    display: inline-flex;
                    align-items: center;
                    background-color: #fafafa;
                    border: 1px solid #eaeaea;
                    border-radius: 12px;
                    width: fit-content;
                    padding: 5px;
                }
                .qty-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--pastel-pink);
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s;
                    border-radius: 8px;
                }
                .qty-btn:hover {
                    background-color: #fff0f5;
                }
                .qty-display {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #333;
                    width: 40px;
                    text-align: center;
                }
                .add-to-cart-btn-large {
                    width: 100%;
                    padding: 18px;
                    background-color: var(--pastel-pink);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(212, 119, 146, 0.3);
                }
                .add-to-cart-btn-large:hover {
                    background-color: #df8aab;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(212, 119, 146, 0.4);
                }
                 .shipping-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #6b7280;
                    font-size: 0.95rem;
                    justify-content: center;
                    background-color: #f9fafb;
                    padding: 12px;
                    border-radius: 8px;
                }
                .production-delay-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #b45309;
                    font-size: 0.95rem;
                    justify-content: center;
                    background-color: #fffbeb;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #fef3c7;
                    margin-top: 0.8rem;
                    line-height: 1.4;
                }
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    color: #6b7280;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .back-link:hover {
                    color: var(--pastel-pink);
                }
                
                .shipping-calc-wrapper {
                    margin-top: 1rem;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(3px);
                }
                .modal-content {
                    background: #fff;
                    padding: 2.5rem;
                    border-radius: 20px;
                    width: 90%;
                    max-width: 450px;
                    position: relative;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .close-modal-btn {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 1.8rem;
                    color: #999;
                    cursor: pointer;
                    line-height: 1;
                    transition: color 0.2s;
                }
                .close-modal-btn:hover {
                    color: #333;
                }
                .modal-title {
                    font-size: 1.5rem;
                    color: #333;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    font-weight: 700;
                }
                .payment-modal-methods {
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                    margin-bottom: 2rem;
                }
                .pm-method h4 {
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.3rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .pm-method p {
                    font-size: 0.95rem;
                    color: #6b7280;
                    line-height: 1.4;
                    margin: 0;
                }
                .pm-method.border-t {
                    border-top: 1px dashed #eee;
                    padding-top: 1.2rem;
                }
                .close-modal-btn-bottom {
                    width: 100%;
                    padding: 12px;
                    background-color: var(--pastel-pink);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: bold;
                    font-size: 1.05rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .close-modal-btn-bottom:hover {
                    background-color: #d18ab2;
                }

                @media (max-width: 900px) {
                    .product-detail-layout {
                        display: flex;
                        flex-direction: column;
                        padding: 1.5rem;
                        gap: 2rem;
                        width: 100%;
                        overflow: hidden;
                    }
                    .product-title {
                        font-size: 1.8rem;
                        margin-bottom: 1rem;
                    }
                    .main-price {
                        font-size: 2rem;
                    }
                    .price-box {
                        padding: 1.2rem;
                        margin-bottom: 1.5rem;
                    }
                    .add-to-cart-btn-large {
                        font-size: 1.1rem;
                        padding: 15px;
                    }
                    .desc-text {
                        font-size: 0.95rem;
                    }
                    .sheet-btn {
                        padding: 6px 12px;
                        font-size: 0.85rem;
                    }
                }
                @media (max-width: 600px) {
                    .product-detail-layout {
                        padding: 1rem;
                        border-radius: 12px;
                        margin: 0 -10px; /* Expands to edges on small screens */
                    }
                    .product-title {
                        font-size: 1.5rem;
                    }
                    .main-price {
                        font-size: 1.8rem;
                    }
                    .installments, .transfer-discount {
                        font-size: 0.9rem;
                    }
                    .badge-20 {
                        font-size: 0.75rem;
                    }
                    .actions-box {
                        gap: 1rem;
                    }
                    .py-16 {
                        padding-top: 2rem;
                        padding-bottom: 2rem;
                    }
                }
                
                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .min-h-screen { min-height: 100vh; }
                .flex-grow { flex-grow: 1; }
                .bg-background { background-color: #fafafa; }
                .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
                 .mb-6 { margin-bottom: 1.5rem; }

                .related-products-section {
                    margin-top: 4rem;
                }
                .related-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 2rem;
                    border-bottom: 2px solid #eaeaea;
                    padding-bottom: 0.5rem;
                }
                .related-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                }
                .related-card {
                    background: #fff;
                    border-radius: 15px;
                    overflow: hidden;
                    padding: 1rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                    border: 1px solid #f0f0f0;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    cursor: pointer;
                }
                .related-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.06);
                }
                .related-image-wrapper {
                    aspect-ratio: 1;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    background: #fff;
                }
                .related-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    mix-blend-mode: multiply;
                }
                .related-card-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 0.5rem;
                    line-height: 1.3;
                    text-decoration: none;
                }
                .related-card-desc {
                    font-size: 0.8rem;
                    color: #777;
                    flex-grow: 1;
                    margin-bottom: 1rem;
                    line-height: 1.4;
                }
                .related-card-price {
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: #111;
                }
                @media (max-width: 900px) {
                    .related-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 600px) {
                    .related-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
