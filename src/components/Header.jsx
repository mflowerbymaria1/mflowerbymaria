"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoritesContext";
import { useState, useRef, useEffect } from "react";
import AccountModal from "./AccountModal";
import CartDropdown from "./CartDropdown";
import Logo from "./Logo";
import { supabase } from "../lib/supabase";

export default function Header() {
  const router = useRouter();
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { favorites } = useFavorites();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartRef = useRef(null);
  const searchRef = useRef(null);

  const [isCartBumping, setIsCartBumping] = useState(false);
  const [isFavBumping, setIsFavBumping] = useState(false);
  const [categories, setCategories] = useState([]);
  const isInitialMountCart = useRef(true);
  const isInitialMountFav = useRef(true);

  useEffect(() => {
    if (isInitialMountCart.current) {
      isInitialMountCart.current = false;
      return;
    }
    setIsCartBumping(true);
    const timer = setTimeout(() => setIsCartBumping(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  useEffect(() => {
    if (isInitialMountFav.current) {
      isInitialMountFav.current = false;
      return;
    }
    setIsFavBumping(true);
    const timer = setTimeout(() => setIsFavBumping(false), 300);
    return () => clearTimeout(timer);
  }, [favorites.length]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch categories from Supabase for the dropdown menu
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data) {
        setCategories(data);
      }
    }
    fetchCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="header-wrapper">
      {/* Announcement Bar */}
      <div className="announcement-bar bg-green">
        <div className="announcement-text-wrapper">
          <span>💸 20% OFF Transferencia | 💳 3 CUOTAS SIN INTERÉS</span>
          <span aria-hidden="true">💸 20% OFF Transferencia | 💳 3 CUOTAS SIN INTERÉS</span>
          <span aria-hidden="true">💸 20% OFF Transferencia | 💳 3 CUOTAS SIN INTERÉS</span>
          <span aria-hidden="true">💸 20% OFF Transferencia | 💳 3 CUOTAS SIN INTERÉS</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header container">
        <div className="header-left">
          <span className="country-flag" title="Argentina">🇦🇷</span>
          <nav className="main-nav">
            <Link href="/">Inicio</Link>
            <div className="nav-item-dropdown">
              <Link href="/productos" className="nav-link-dropdown">Productos</Link>
              <div className="dropdown-menu">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/productos?categoria=${cat.slug}`}
                    className="dropdown-item"
                    title={cat.name}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/productos?categoria=repuestos" className="nav-link">Repuestos</Link>
          </nav>
        </div>

        <div className="header-center">
          <Logo size="small" link={true} />
        </div>

        <div className="header-right" style={{ position: 'relative' }} ref={cartRef}>
          <div className="search-container" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className={`search-form ${isSearchOpen ? 'open' : ''}`}>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>
            <button className="icon-btn search-icon-btn" aria-label="Buscar" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <button className="icon-btn" aria-label="Mi Cuenta" onClick={() => setIsAccountOpen(true)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <Link href="/favoritos" className={`icon-btn ${isFavBumping ? 'bump' : ''}`} aria-label="Favoritos">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Link>
          <button className={`icon-btn cart-btn ${isCartBumping ? 'bump' : ''}`} aria-label="Carrito" onClick={() => setIsCartOpen(!isCartOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
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
          padding: 8px 0;
          font-size: 0.85rem;
          font-weight: 600;
          background-color: #F8F1EB;
          color: #5C4B51;
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }

        .announcement-text-wrapper {
          display: inline-flex;
          animation: marquee 10s linear infinite;
        }

        .announcement-text-wrapper span {
          padding: 0 40px; /* Space between the repeating texts */
          white-space: nowrap;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%); /* Perfect seamless loop for 4 elements */
          }
        }
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 1rem; /* Reduced padding to move logo up */
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
        .nav-item-dropdown {
          position: relative;
          display: inline-block;
          height: 100%;
        }
        .nav-link-dropdown {
          display: inline-block;
          padding-bottom: 5px; /* Adds space for hover tracking */
        }
        .dropdown-menu {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: 100%;
          left: -20px;
          background-color: #fff;
          min-width: 250px;
          max-height: 60vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 10px 0;
          z-index: 200;
          border: 1px solid #f0f0f0;
          transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Custom scrollbar for dropdown */
        .dropdown-menu::-webkit-scrollbar {
          width: 6px;
        }
        .dropdown-menu::-webkit-scrollbar-thumb {
          background-color: #ddd;
          border-radius: 10px;
        }
        .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background-color: #bbb;
        }
        /* Create an invisible bridge to prevent losing hover */
        .nav-item-dropdown::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: 15px; /* Bridge gap between link and dropdown */
        }
        .nav-item-dropdown:hover .dropdown-menu {
          visibility: visible;
          opacity: 1;
          transform: translateY(5px);
        }
        .dropdown-item {
          display: block;
          padding: 12px 20px;
          color: #555 !important;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-transform: none !important;
          letter-spacing: normal !important;
        }
        .dropdown-item:hover {
          background-color: #fcfcfc;
          color: var(--pastel-pink) !important;
          border-left-color: var(--pastel-pink);
          padding-left: 25px;
        }
        .header-left { justify-content: flex-start; }
        .header-right { justify-content: flex-end; }
        .header-center {
          flex: 2;
          display: flex;
          justify-content: center;
        }
        .logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: inherit;
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

        .search-container {
          display: flex;
          align-items: center;
          position: relative;
        }
        .search-form {
          width: 0;
          overflow: hidden;
          transition: width 0.3s ease, margin-right 0.3s ease, opacity 0.3s ease;
          opacity: 0;
          margin-right: 0;
        }
        .search-form.open {
          width: 200px;
          opacity: 1;
          margin-right: 10px;
        }
        .search-input {
          width: 100%;
          padding: 8px 15px;
          border: 1px solid #eaeaea;
          border-radius: 20px;
          outline: none;
          font-family: inherit;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        .search-input:focus {
          border-color: var(--pastel-pink);
        }
        .search-icon-btn {
          z-index: 2;
        }

        @keyframes bump {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .bump {
          animation: bump 0.3s ease-out;
        }

        @media (max-width: 768px) {
          .announcement-bar {
            font-size: 0.75rem;
          }
          .main-header {
            flex-direction: column;
            gap: 15px;
            padding: 15px 1rem;
          }
          .header-left, .header-center, .header-right {
            width: 100%;
            justify-content: center;
            flex: none;
          }
          .header-left {
            order: 2;
          }
          .header-center {
            order: 1;
          }
          .header-right {
            order: 3;
            gap: 20px;
          }
          .main-nav {
            margin-left: 0;
            gap: 15px;
            width: 100%;
            justify-content: space-evenly;
          }
          .main-nav a, .dropdown-item {
            font-size: 0.85rem;
          }
          .country-flag {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
