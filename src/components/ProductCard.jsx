"use client";
import { useState, useEffect } from "react";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoritesContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

export default function ProductCard({ product }) {
  const { addToCart, openCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const [isHeartBumping, setIsHeartBumping] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [sheetType, setSheetType] = useState(product.name.toLowerCase().includes('libreta') ? 'lisas' : 'rayadas');
  const [paperType, setPaperType] = useState(product.name.toLowerCase().includes('libreta') ? 'blanco' : 'natural');
  
  const [activeImage, setActiveImage] = useState(product.image);

  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  const notebookIds = [2, 5, 9, 11, 12, 13];
  const ficheroIds = [4, 7, 14];

  const isNotebook = notebookIds.includes(Number(product.id)) || product.name.toLowerCase().includes('cuaderno') || product.name.toLowerCase().includes('libreta');
  const isFichero = ficheroIds.includes(Number(product.id)) || product.name.toLowerCase().includes('fichero');
  const isLibreta = product.name.toLowerCase().includes('libreta');

  const isFav = isFavorite(product.id);
  const needsNotebookOptions = isNotebook;
  const needsFicheroOptions = isFichero;
  const needsOptions = needsNotebookOptions || needsFicheroOptions;

  // Format price helper (assuming price string like "18.500")
  const priceStr = product.price ? String(product.price) : "0";
  const numericPrice = parseFloat(priceStr.replace(/\./g, '')) || 0;
  const installmentPrice = (numericPrice / 3).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const transferPrice = (numericPrice * 0.8).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    setIsHeartBumping(true);
    setTimeout(() => setIsHeartBumping(false), 300);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsOptions) {
      setShowOptionsModal(true);
    } else {
      performAddToCart(product);
    }
  };

  const confirmOptionsAndAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let variantId = `${product.id}`;
    let variantName = `${product.name}`;
    
    if (needsNotebookOptions) {
        variantId += `-${sheetType}-${paperType.replace(/\s+/g, '-')}`;
        variantName += ` (${sheetType}, ${paperType})`;
    } else if (needsFicheroOptions) {
        variantId += `-${paperType.replace(/\s+/g, '-')}`;
        variantName += ` (${paperType})`;
    }

    const productToAdd = {
      ...product,
      id: variantId,
      name: variantName
    };
    performAddToCart(productToAdd);
    setShowOptionsModal(false);
  };

  const performAddToCart = (item) => {
    addToCart(item);
    openCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const goToProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/productos/${product.id}`);
  };

  return (
    <div className="product-card relative group cursor-pointer" onClick={goToProduct} onMouseLeave={() => setActiveImage(product.image)}>
      
      <div className="product-image-wrapper">
        <button
          className={`favorite-heart-btn relative z-20 ${isFav ? 'active' : ''} ${isHeartBumping ? 'btn-bump' : ''}`}
          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(e); }}
          aria-label="Agregar a favoritos"
        >
          <svg width="24" height="24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        {activeImage ? (
          product.category && product.category.toLowerCase().includes('planner') ? (
            <div className="relative w-full h-full" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img 
                src={activeImage} 
                alt={product.name} 
                style={{ filter: 'blur(5px)', opacity: 0.6 }}
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
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 12px rgba(212,119,146,0.3)'
                }}>
                  Próximamente
                </span>
              </div>
            </div>
          ) : (
            <img src={activeImage} alt={product.name} />
          )
        ) : (
          <div className="product-image-placeholder bg-green h-full w-full relative z-0">
            <Logo size="medium" color="#4A8C55" />
          </div>
        )}
        {product.isBestSeller && (
          <div className="bestseller-badge">🔥 Más Vendido</div>
        )}
      </div>
      
      {/* Miniaturas de vista previa */}
      {(() => {
        const uniqueImages = Array.from(new Set([product.image, ...(product.gallery || [])].filter(Boolean))).slice(0, 5);
        if (uniqueImages.length <= 1) return null;
        return (
          <div className="card-thumbnails-preview" onClick={(e) => e.stopPropagation()}>
            {uniqueImages.map((imgUrl, index) => (
              <div 
                key={index} 
                className={`card-thumbnail-item ${activeImage === imgUrl ? 'active' : ''}`}
                onMouseEnter={() => setActiveImage(imgUrl)}
                onClick={() => setActiveImage(imgUrl)}
              >
                <img src={imgUrl} alt={`${product.name} miniatura ${index + 1}`} />
              </div>
            ))}
          </div>
        );
      })()}
      <div className="product-info flex flex-col flex-grow select-none">
        <h3 className="product-title relative z-20 cursor-pointer">{product.name}</h3>
        <p className="product-desc">{product.shortDescription}</p>

        <div className="price-container">
          <span className="product-price">${product.price}</span>
          <span className="installments">💳 3 cuotas sin interés de <strong>${installmentPrice}</strong></span>
          <span className="discount-price">💸 <strong>${transferPrice}</strong> con transferencia <span className="badge-20">20% OFF</span></span>
        </div>

        <div className="product-bottom-actions relative z-20">
          <button className="view-details-btn cursor-pointer">
            Ver Detalles
          </button>
          <button 
            className={`add-to-cart-btn-small relative z-20 ${product.stock <= 0 ? 'out-of-stock' : (isAdded ? 'added' : 'btn-bump')}`} 
            onClick={(e) => { 
                e.stopPropagation(); 
                if (product.stock > 0) handleAddToCartClick(e); 
            }}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? 'Sin Stock' : (isAdded ? '✓ ¡Agregado!' : 'Agregar')}
          </button>
        </div>
      </div>
      

      {/* Options Modal */}
      {showOptionsModal && (
        <div className="card-modal-overlay" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowOptionsModal(false); }}>
          <div className="card-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowOptionsModal(false)}>×</button>
            <h4 className="card-modal-title">Elegir opciones</h4>
            
            {needsNotebookOptions && (
              <div className="options-group">
                <label>Tipo de hoja:</label>
                <select value={sheetType} onChange={(e) => setSheetType(e.target.value)} className="options-select">
                  {isLibreta ? (
                    <option value="lisas">Lisas</option>
                  ) : (
                    <>
                      <option value="rayadas">Rayadas</option>
                      <option value="lisas">Lisas</option>
                      <option value="cuadriculadas">Cuadriculadas</option>
                      <option value="punteadas">Punteadas</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {(needsNotebookOptions || needsFicheroOptions) && (
              <div className="options-group">
                <label>Tipo de papel:</label>
                <select value={paperType} onChange={(e) => setPaperType(e.target.value)} className="options-select">
                  {isLibreta ? (
                    <option value="blanco">Blanco</option>
                  ) : (
                    <>
                      <option value="natural">Natural</option>
                      <option value="blanco">Blanco</option>
                    </>
                  )}
                </select>
              </div>
            )}

            <button className="confirm-add-btn" onClick={confirmOptionsAndAdd}>Confirmar Agregar</button>
          </div>
        </div>
      )}

      <style>{`
        .product-card {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #fff;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px rgba(0,0,0,0.04); /* Soft shadow like carousel */
          cursor: pointer !important;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.08);
        }
        .product-image-wrapper {
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background-color: #fff;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .favorite-heart-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          color: #999;
          backdrop-filter: blur(2px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .favorite-heart-btn:hover {
          transform: scale(1.1);
        }
        .favorite-heart-btn.active {
          color: var(--pastel-pink); /* Turns pastel pink when active */
          background: white;
        }
        .product-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.5s ease;
          mix-blend-mode: multiply;
        }
        .product-card:hover .product-image-wrapper img {
          transform: scale(1.05);
        }
        .product-image-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--pastel-green); /* pastel green */
          color: rgba(255,255,255,0.8);
          opacity: 0.7;
        }
        .placeholder-text {
          font-size: 2rem;
          color: #4A8C55;
        }
        .bestseller-badge {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background-color: var(--pastel-pink);
          color: white;
          font-weight: 800;
          font-size: 0.70rem;
          padding: 6px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          z-index: 5;
        }
        .product-info {
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .product-title {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 8px;
          font-weight: 600;
          cursor: pointer !important;
        }
        .product-desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.4;
          margin-bottom: 12px;
          flex-grow: 1;
        }
        .price-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 15px;
        }
        .product-price {
          font-weight: 800;
          font-size: 1.4rem;
          color: #222; /* Black principal price */
        }
        .installments {
          font-size: 0.8rem;
          color: #555;
        }
        .discount-price {
          font-size: 0.85rem;
          color: #2F5D38; /* Green for discount */
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .badge-20 {
          background-color: var(--pastel-green);
          color: #2F5D38;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .product-bottom-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }
        .view-details-btn {
          flex: 1;
          padding: 10px 0;
          border-radius: 20px;
          border: 1px solid var(--pastel-pink);
          background-color: transparent;
          color: var(--pastel-pink);
          font-size: 0.9rem;
          font-weight: bold;
          text-align: center;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer !important;
        }
        .view-details-btn:hover {
          background-color: var(--pastel-pink);
          color: white;
        }
        .add-to-cart-btn-small {
          flex: 1;
          padding: 10px 0;
          border-radius: 20px;
          border: none;
          background-color: var(--pastel-pink);
          color: white;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .add-to-cart-btn-small:hover {
          background-color: #df8aab; /* Slightly darker pink */
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(212, 119, 146, 0.4);
        }
        .add-to-cart-btn-small.out-of-stock {
          background-color: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
        }
        .add-to-cart-btn-small.out-of-stock:hover {
          transform: none;
          background-color: #e5e7eb;
        }
        .product-title-link {
          text-decoration: none;
        }
        .product-title-link:hover .product-title {
          color: var(--pastel-pink);
        }

        @keyframes cardBump {
          0% { transform: translateY(-2px) scale(1); }
          50% { transform: translateY(-2px) scale(1.25); }
          100% { transform: translateY(-2px) scale(1); }
        }
        .btn-bump {
          animation: cardBump 0.3s ease-out;
        }

        .add-to-cart-btn-small.added {
          background-color: #c46b91; /* Dark pink */
          color: white;
          transform: translateY(0);
          box-shadow: 0 4px 10px rgba(196, 107, 145, 0.4);
        }

        /* Modal Styles */
        .card-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
          cursor: default;
        }
        .card-modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 15px;
          width: 90%;
          max-width: 350px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .card-modal-title {
          font-family: var(--font-quicksand), sans-serif;
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 1.2rem;
          font-weight: 700;
          text-align: center;
        }
        .options-group {
          margin-bottom: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-align: left;
        }
        .options-group label {
          font-size: 0.9rem;
          color: #555;
          font-weight: 600;
        }
        .options-select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #333;
          background-color: #fafafa;
          outline: none;
          transition: border-color 0.2s;
        }
        .options-select:focus {
          border-color: var(--pastel-pink);
        }
        .confirm-add-btn {
          width: 100%;
          padding: 12px;
          background-color: var(--pastel-pink);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 10px;
        }
        .confirm-add-btn:hover {
          background-color: #d18ab2;
          transform: translateY(-2px);
        }
        .close-modal-btn {
          position: absolute;
          top: 10px; right: 15px;
          background: none; border: none;
          font-size: 1.5rem; color: #999;
          cursor: pointer; line-height: 1;
        }
        .close-modal-btn:hover { color: #333; }

        .card-thumbnails-preview {
          display: flex;
          gap: 8px;
          justify-content: center;
          padding: 10px 12px;
          background: #fff;
          border-bottom: 1.5px solid #fcfcfc;
          flex-wrap: wrap;
        }
        .card-thumbnail-item {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          overflow: hidden;
          border: 1.5px solid #eee;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
        }
        .card-thumbnail-item:hover, .card-thumbnail-item.active {
          border-color: var(--pastel-pink);
          transform: scale(1.05);
        }
        .card-thumbnail-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          mix-blend-mode: multiply;
        }
      `}</style>
    </div>
  );
}
