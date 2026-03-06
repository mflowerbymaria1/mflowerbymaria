"use client";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoritesContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(product.id);

  // Format price helper (assuming price string like "18.500")
  const numericPrice = parseFloat(product.price.replace('.', ''));
  const installmentPrice = (numericPrice / 3).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const transferPrice = (numericPrice * 0.8).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <button
          className={`favorite-heart-btn ${isFav ? 'active' : ''}`}
          onClick={() => toggleFavorite(product)}
          aria-label="Agregar a favoritos"
        >
          <svg width="24" height="24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-image-placeholder bg-green">
            <span className="font-brand placeholder-text">M•flowerBymaria</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="price-container">
          <span className="product-price">${product.price}</span>
          <span className="installments">💳 3 cuotas sin interés de <strong>${installmentPrice}</strong></span>
          <span className="discount-price">💸 <strong>${transferPrice}</strong> con transferencia <span className="badge-20">20% OFF</span></span>
        </div>

        <div className="product-bottom">
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Agregar al carrito</button>
        </div>
      </div>

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
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.08);
        }
        .product-image-wrapper {
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background-color: #f7f7f7;
          position: relative;
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
          z-index: 10;
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
          object-fit: cover;
          transition: transform 0.5s ease;
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
        .product-bottom {
          display: flex;
          justify-content: stretch;
          margin-top: auto;
        }
        .add-to-cart-btn {
          width: 100%;
          padding: 12px;
          border-radius: 25px;
          border: none;
          background-color: #fff;
          color: var(--pastel-pink);
          border: 2px solid var(--pastel-pink);
          font-size: 0.95rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .add-to-cart-btn:hover {
          background-color: var(--pastel-pink);
          color: white;
        }
      `}</style>
    </div>
  );
}
