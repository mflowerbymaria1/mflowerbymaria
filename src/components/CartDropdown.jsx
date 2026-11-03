"use client";
import Link from "next/link";
import { useCart } from "../store/CartContext";
import { calculate3x2Discount } from "../lib/promotions";
import { useState, useEffect } from "react";

export default function CartDropdown({ isOpen, onClose }) {
  const { cartItems, cartCount, removeFromCart } = useCart();
  const [isWholesale, setIsWholesale] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('mflower_wholesale_session')) {
        setIsWholesale(true);
      }
    } catch(e) {}
  }, []);

  if (!isOpen) return null;

  const rawTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const promo3x2 = calculate3x2Discount(cartItems, isWholesale);
  const finalTotal = Math.max(0, rawTotal - promo3x2.discount);
  const transferPrice = finalTotal * 0.8;

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-dropdown">
        <div className="cart-header">
        <h3>Mi Carrito ({cartCount} {cartCount === 1 ? 'artículo' : 'artículos'})</h3>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar carrito">×</button>
      </div>

      <div className="cart-items custom-scrollbar">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <svg width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <Link href={`/productos/${item.product_id || item.id}`} className="item-img-placeholder" onClick={onClose}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                ) : (
                  <span style={{ fontSize: '10px' }}>Imagen</span>
                )}
              </Link>
              <div className="item-details">
                <div className="item-details-header">
                  <Link href={`/productos/${item.product_id || item.id}`} className="item-title-link" onClick={onClose}>
                    <h4>{item.name}</h4>
                  </Link>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <p className="item-quantity">Cant: {item.quantity}</p>
                <p className="item-price">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-footer">
          {/* Cyber Monday 3x2 Banner / Alerta */}
          {!isWholesale && (
            <div className={`cyber-cart-promo-box ${promo3x2.freeItemsCount > 0 ? 'active' : 'hint'}`}>
              <div className="cyber-cart-promo-title">
                <span>🔥</span>
                <strong>PROMO 3x2 CYBER MONDAY</strong>
              </div>
              {promo3x2.freeItemsCount > 0 ? (
                <p className="cyber-cart-promo-text">
                  ¡Genial! Tenés <strong>{promo3x2.freeItemsCount} {promo3x2.freeItemsCount === 1 ? 'producto GRATIS' : 'productos GRATIS'}</strong> ({promo3x2.neededForNext === 3 ? '¡Sumá 3 más para otro gratis!' : `¡Sumá ${promo3x2.neededForNext} más para otro gratis!`})
                </p>
              ) : (
                <p className="cyber-cart-promo-text">
                  {promo3x2.neededForNext === 1 
                    ? '¡Agregá 1 producto más y el 3ro te queda GRATIS!' 
                    : '¡Agregá 2 productos más y llevate 1 GRATIS!'}
                </p>
              )}
            </div>
          )}

          <div className="shipping-progress">
            <p className="shipping-text">
              {finalTotal >= 60000
                ? "✨ ¡Tenés envío gratis!"
                : `🚚 Te faltan $${(60000 - finalTotal).toLocaleString('es-AR')} para envío gratis`}
            </p>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(100, (finalTotal / 60000) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="cart-totals-breakdown">
            {promo3x2.discount > 0 && (
              <>
                <div className="cart-subtotal-row">
                  <span>Subtotal:</span>
                  <span className="strikethrough">${rawTotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="cart-discount-row">
                  <span>🔥 Descuento 3x2:</span>
                  <span className="discount-amount">-${promo3x2.discount.toLocaleString('es-AR')}</span>
                </div>
              </>
            )}
            <div className="cart-total">
              <span>Total:</span>
              <span className="final-total-amount">${finalTotal.toLocaleString('es-AR')}</span>
            </div>
            {!isWholesale && (
              <p className="cart-transfer-hint">
                💸 <strong>${transferPrice.toLocaleString('es-AR')}</strong> con transferencia (20% OFF)
              </p>
            )}
          </div>

          <div className="cart-actions">
            <button className="continue-btn" onClick={onClose}>Seguir comprando</button>
            <Link href="/checkout" className="checkout-btn" onClick={onClose}>Finalizar compra</Link>
          </div>
        </div>
      )}

      <style>{`
        .cart-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 1000;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cart-dropdown {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 380px;
          max-width: 100vw;
          background: #ffffff;
          box-shadow: -10px 0 30px rgba(0,0,0,0.1);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: default;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eaeaea;
          background: #fafafa;
        }
        .cart-header h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: #333;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
          line-height: 1;
          padding: 0;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: #333;
        }

        .cart-items {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dcdcdc; 
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c0c0c0; 
        }

        .empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #888;
          padding: 30px 0;
          gap: 15px;
        }
        .empty-cart p {
          margin: 0;
          font-size: 0.95rem;
        }

        .cart-item {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f5f5f5;
        }
        .cart-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .item-img-placeholder {
          width: 60px;
          height: 80px;
          background: #f0f0f0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          flex-shrink: 0;
          text-decoration: none;
          overflow: hidden;
        }
        .cart-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-title-link {
          text-decoration: none;
        }
        .item-title-link:hover h4 {
          color: var(--pastel-pink);
        }
        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .item-details-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
        }
        .item-details h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 500;
          color: #333;
          padding-right: 10px;
        }
        .remove-item-btn {
          background: none;
          border: none;
          color: #bbb;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .remove-item-btn:hover {
          color: #ff4d4f;
        }
        .item-quantity {
          margin: 0 0 5px 0;
          font-size: 0.8rem;
          color: #666;
        }
        .item-price {
          margin: 0;
          font-weight: 600;
          color: #222;
        }

        .cart-footer {
          padding: 20px;
          border-top: 1px solid #eaeaea;
          background: #fff;
        }

        .cyber-cart-promo-box {
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 14px;
          animation: pulseBox 2s infinite ease-in-out;
        }
        .cyber-cart-promo-box.active {
          background: linear-gradient(135deg, #FFF0F3 0%, #FFE4E9 100%);
          border: 1.5px solid #F5C6D0;
        }
        .cyber-cart-promo-box.hint {
          background: #F8FAFC;
          border: 1.5px dashed #CBD5E1;
        }
        .cyber-cart-promo-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #be185d;
          font-weight: 800;
          letter-spacing: 0.02em;
          margin-bottom: 4px;
        }
        .cyber-cart-promo-text {
          margin: 0;
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.35;
        }
        .cyber-cart-promo-box.active .cyber-cart-promo-text strong {
          color: #be185d;
        }

        .cart-totals-breakdown {
          margin: 12px 0 16px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cart-subtotal-row, .cart-discount-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #64748b;
        }
        .cart-discount-row {
          color: #be185d;
          font-weight: 700;
        }
        .strikethrough {
          text-decoration: line-through;
          color: #94a3b8;
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 1px dashed #e2e8f0;
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e293b;
        }
        .final-total-amount {
          color: var(--pastel-pink);
          font-size: 1.25rem;
        }
        .cart-transfer-hint {
          margin: 4px 0 0 0;
          font-size: 0.78rem;
          color: #059669;
          text-align: right;
        }
        .shipping-progress {
          margin-bottom: 15px;
        }
        .shipping-text {
          font-size: 0.85rem;
          color: #444;
          margin: 0 0 6px 0;
          text-align: center;
          font-weight: 500;
        }
        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background-color: #eee;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background-color: var(--pastel-green);
          border-radius: 4px;
          transition: width 0.4s ease;
        }
        .cart-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .checkout-btn, .continue-btn {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .checkout-btn {
          background-color: var(--pastel-pink);
          color: white;
          text-decoration: none;
        }
        .checkout-btn:hover {
          background-color: #d18ab2;
        }
        .continue-btn {
          background-color: white;
          border: 1px solid #ccc;
          color: #555;
        }
        .continue-btn:hover {
          background-color: #f9f9f9;
          color: #333;
        }
      `}</style>
      </div>
    </>
  );
}
