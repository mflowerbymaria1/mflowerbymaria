"use client";
import Link from "next/link";
import { useCart } from "../store/CartContext";
import { useState } from "react";
import AccountModal from "./AccountModal";

export default function Header() {
  const { cartCount } = useCart();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="header-wrapper">
      {/* Announcement Bar */}
      <div className="announcement-bar bg-green">
        <p>💸 20% OFF Transferencia | 💳 3 CUOTAS SIN INTERÉS</p>
      </div>

      {/* Main Header */}
      <div className="main-header container">
        <div className="header-left">
          <span className="country-flag" title="Argentina">🇦🇷</span>
          <nav className="main-nav">
            <Link href="/">Inicio</Link>
            <Link href="/productos">Productos</Link>
          </nav>
        </div>

        <div className="header-center">
          <h1 className="logo font-brand">M•flowerBymaria</h1>
        </div>

        <div className="header-right">
          <button className="icon-btn" aria-label="Buscar">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button className="icon-btn" aria-label="Mi Cuenta" onClick={() => setIsAccountOpen(true)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <Link href="/favoritos" className="icon-btn" aria-label="Favoritos">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Link>
          <button className="icon-btn cart-btn" aria-label="Carrito">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      <style>{`
        .header-wrapper {
          border-bottom: 1px solid #eaeaea;
          position: sticky;
          top: 0;
          background: var(--background);
          z-index: 100;
        }
        .announcement-bar {
          text-align: center;
          padding: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          background-color: #F8F1EB; /* Cream / Beige Lino */
          color: #5C4B51; /* Softer dark text for contrast */
        }
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 1rem; /* Increased padding to push hero down */
        }
        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
        }
        .main-nav {
          display: flex;
          gap: 20px;
          margin-left: 20px;
        }
        .main-nav a {
          font-weight: 500;
          font-size: 0.95rem;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .main-nav a:hover {
          color: var(--pastel-pink);
        }
        .header-left { justify-content: flex-start; }
        .header-right { justify-content: flex-end; }
        .header-center {
          flex: 2;
          text-align: center;
        }
        .logo {
          font-size: 1.4rem; /* Achicado */
          margin: 0;
          line-height: 1;
          color: #000;
        }
        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--foreground);
          display: flex;
          align-items: center;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .icon-btn:hover {
          transform: scale(1.1);
          color: var(--pastel-pink);
        }
        .cart-btn {
          position: relative;
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: var(--pastel-pink);
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }
        .country-flag {
          font-size: 1.2rem;
          margin-right: 10px;
        }
      `}</style>
    </header>
  );
}
