"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { supabase } from "../lib/supabase";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data.map(p => ({
          ...p,
          image: p.image_url,
          shortDescription: p.short_description,
          isBestSeller: p.is_best_seller,
          // Format price for display (Supabase stores as number)
          price: typeof p.price === 'number'
            ? p.price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
            : p.price
        })));
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const [isWholesale, setIsWholesale] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('mflower_wholesale_session')) {
        setIsWholesale(true);
      }
    } catch(e) {}
  }, []);

  return (
    <section className="product-grid-section">
      <div className="container">
        {/* Banner Artículos de librería para llevar */}
        {!isWholesale && (
          <div className="stationery-promo-banner">
            <div className="banner-row-container">
              {/* Left Column: Image Banner */}
              <Link 
                href="/productos?categoria=articulos-de-libreria-para-llevar" 
                className="banner-image-link"
              >
                <div className="banner-img-wrapper">
                  <img 
                    src="/images/banner_libreria.jpg" 
                    alt="Artículos de librería para llevar" 
                    className="banner-img"
                  />
                </div>
              </Link>

              {/* Right Column: Text & CTA Button */}
              <div className="banner-right-content">
                <div className="banner-text-block">
                  <span className="banner-badge">🌸 Nuevos Ingresos</span>
                  <p className="banner-description">
                    Resaltadores en tonos pastel, cintas correctoras, lapiceras y accesorios súper tiernos de papelería y deco para tu escritorio.
                  </p>
                </div>
                <Link 
                  href="/productos?categoria=articulos-de-libreria-para-llevar" 
                  className="banner-cta-btn"
                >
                  <span>Ver artículos de librería</span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="creative-space-header">
          {isWholesale ? (
            <>
              <h2 className="creative-title" style={{ color: '#D47792' }}>WEB MAYORISTA</h2>
              <p className="creative-subtitle" style={{ color: '#000', fontSize: '1.1rem', fontWeight: '500' }}>
                Encontrá todo lo que buscas acá
              </p>
            </>
          ) : (
            <>
              <h2 className="creative-title">Tu espacio creativo empieza acá.</h2>
              <p className="creative-subtitle">
                En M•flower by Maria vas a encontrar herramientas pensadas con amor para organizar tu mundo y hacerlo un poquito mas lindo, para que tus ideas tengan el lugar que se merecen.
              </p>
            </>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid var(--pastel-pink)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div className="grid-container">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .product-grid-section {
          padding: 5rem 1rem;
          background-color: var(--background);
        }
        .stationery-promo-banner {
          margin: 0 auto 5.5rem auto;
          width: 100%;
        }
        .banner-row-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3.5rem;
          background: #ffffff;
          padding: 1.8rem;
          border-radius: 32px;
          border: 2.5px solid #F5C6D0;
          box-shadow: 0 16px 45px rgba(212, 119, 146, 0.14);
        }
        .banner-image-link {
          flex: 1.35;
          min-width: 0;
          display: block;
          text-decoration: none;
          border-radius: 24px;
          overflow: hidden;
        }
        .banner-img-wrapper {
          position: relative;
          width: 100%;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          background: #FFF0F3;
        }
        .banner-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .banner-image-link:hover .banner-img {
          transform: scale(1.025);
        }
        .banner-right-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 1.8rem;
          padding-right: 1rem;
        }
        .banner-text-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
        .banner-badge {
          display: inline-block;
          background: #FFF0F3;
          color: #D47792;
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 7px 18px;
          border-radius: 30px;
          border: 1.5px solid #F5C6D0;
        }
        .banner-description {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.15rem;
          color: #444;
          line-height: 1.65;
          margin: 0;
          font-weight: 500;
        }
        .banner-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #D47792;
          color: #fff !important;
          padding: 18px 36px;
          border-radius: 50px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          box-shadow: 0 8px 25px rgba(212, 119, 146, 0.4);
          transition: all 0.3s ease;
        }
        .banner-cta-btn:hover {
          background: #c25f7c;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(212, 119, 146, 0.5);
        }
        .creative-space-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem auto;
        }
        .creative-title {
          font-family: var(--font-quicksand), sans-serif;
          font-size: 3.5rem;
          color: #D47792;
          margin-bottom: 1rem;
          font-weight: 700; /* Bold para destacar el titulo */
        }
        .creative-subtitle {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #666;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .banner-row-container {
            flex-direction: column;
            gap: 2rem;
            padding: 1.2rem;
          }
          .banner-right-content {
            padding-right: 0;
            width: 100%;
          }
          .banner-cta-btn {
            width: 100%;
            justify-content: center;
          }
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
          .stationery-promo-banner {
            margin-bottom: 3.5rem;
          }
        }
        @media (max-width: 600px) {
          .banner-row-container {
            border-radius: 24px;
            padding: 1rem;
            gap: 1.5rem;
          }
          .banner-img-wrapper {
            border-radius: 18px;
          }
          .banner-description {
            font-size: 1rem;
          }
          .banner-cta-btn {
            padding: 15px 22px;
            font-size: 0.95rem;
          }
          .stationery-promo-banner {
            margin-bottom: 2.5rem;
          }
          .grid-container {
            grid-template-columns: 1fr;
          }
          .creative-title {
            font-size: 2.2rem;
          }
          .creative-subtitle {
            font-size: 1rem;
          }
          .creative-space-header {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
