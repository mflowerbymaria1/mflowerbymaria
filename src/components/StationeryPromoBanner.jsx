"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StationeryPromoBanner() {
  const [isWholesale, setIsWholesale] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("mflower_wholesale_session")) {
        setIsWholesale(true);
      }
    } catch (e) {}
  }, []);

  if (isWholesale) return null;

  return (
    <section className="stationery-section">
      <div className="stationery-container">
        <div className="stationery-grid">
          {/* LADO IZQUIERDO: Imagen sola en grande */}
          <div className="stationery-left">
            <Link
              href="/productos?categoria=articulos-de-libreria-para-llevar"
              className="stationery-img-link"
            >
              <div className="stationery-img-box">
                <img
                  src="/images/banner_libreria.jpg"
                  alt="Artículos de librería para llevar"
                  className="stationery-img"
                />
              </div>
            </Link>
          </div>

          {/* LADO DERECHO: Texto, Badge y Botón Rosa */}
          <div className="stationery-right">
            <span className="stationery-badge">🌸 Nuevos Ingresos</span>
            <p className="stationery-desc">
              Resaltadores en tonos pastel, cintas correctoras, lapiceras y accesorios súper tiernos de papelería y deco para tu escritorio.
            </p>
            <Link
              href="/productos?categoria=articulos-de-libreria-para-llevar"
              className="stationery-btn"
            >
              <span>Ver artículos de librería</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stationery-section {
          width: 100%;
          padding: 4rem 1.5rem 2rem 1.5rem;
          background-color: var(--background, #FAFAFA);
        }
        .stationery-container {
          max-width: 1440px;
          margin: 0 auto;
        }
        .stationery-grid {
          display: grid;
          grid-template-columns: 1.65fr 1fr;
          gap: 4.5rem;
          align-items: center;
        }
        .stationery-left {
          width: 100%;
        }
        .stationery-img-link {
          display: block;
          text-decoration: none;
          border-radius: 36px;
          overflow: hidden;
          width: 100%;
        }
        .stationery-img-box {
          position: relative;
          width: 100%;
          border-radius: 36px;
          overflow: hidden;
          box-shadow: 0 22px 55px rgba(212, 119, 146, 0.22);
          border: 3.5px solid #F5C6D0;
          background: #FFF0F3;
        }
        .stationery-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .stationery-img-link:hover .stationery-img {
          transform: scale(1.03);
        }
        .stationery-right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2.2rem;
          padding: 1rem 0.5rem 1rem 0;
        }
        .stationery-badge {
          display: inline-block;
          background: #FFF0F3;
          color: #E85B81;
          font-size: 1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 10px 24px;
          border-radius: 30px;
          border: 2px solid #F5C6D0;
        }
        .stationery-desc {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.55rem;
          color: #2D2D2D;
          line-height: 1.6;
          margin: 0;
          font-weight: 600;
        }
        .stationery-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #FF7597 0%, #E85B81 100%);
          color: #ffffff !important;
          padding: 22px 46px;
          border-radius: 60px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          box-shadow: 0 12px 32px rgba(232, 91, 129, 0.42);
          transition: all 0.3s ease;
        }
        .stationery-btn:hover {
          background: linear-gradient(135deg, #ff5c84 0%, #d44369 100%);
          transform: translateY(-3px);
          box-shadow: 0 16px 42px rgba(232, 91, 129, 0.55);
        }

        @media (max-width: 1024px) {
          .stationery-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .stationery-left {
            width: 100%;
          }
          .stationery-right {
            width: 100%;
            padding: 0;
          }
          .stationery-desc {
            font-size: 1.3rem;
          }
          .stationery-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 600px) {
          .stationery-section {
            padding: 2rem 1rem 1rem 1rem;
          }
          .stationery-img-box {
            border-radius: 22px;
          }
          .stationery-desc {
            font-size: 1.1rem;
          }
          .stationery-btn {
            padding: 16px 24px;
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
