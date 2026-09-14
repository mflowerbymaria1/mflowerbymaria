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
          {/* LADO IZQUIERDO: Texto, Badge y Botón */}
          <div className="stationery-left">
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

          {/* LADO DERECHO: Imagen sola en grande */}
          <div className="stationery-right">
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
        </div>
      </div>

      <style jsx>{`
        .stationery-section {
          width: 100%;
          padding: 3.5rem 1.5rem 1.5rem 1.5rem;
          background-color: var(--background, #FAFAFA);
        }
        .stationery-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        .stationery-grid {
          display: grid;
          grid-template-columns: 1fr 1.55fr;
          gap: 4.5rem;
          align-items: center;
        }
        .stationery-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2.2rem;
          padding: 1rem 0;
        }
        .stationery-badge {
          display: inline-block;
          background: #FFF0F3;
          color: #D47792;
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
          font-size: 1.5rem;
          color: #2D2D2D;
          line-height: 1.6;
          margin: 0;
          font-weight: 600;
        }
        .stationery-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #D47792;
          color: #fff !important;
          padding: 20px 42px;
          border-radius: 60px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          box-shadow: 0 10px 30px rgba(212, 119, 146, 0.45);
          transition: all 0.3s ease;
        }
        .stationery-btn:hover {
          background: #c25f7c;
          transform: translateY(-3px);
          box-shadow: 0 16px 45px rgba(212, 119, 146, 0.6);
        }
        .stationery-right {
          width: 100%;
        }
        .stationery-img-link {
          display: block;
          text-decoration: none;
          border-radius: 32px;
          overflow: hidden;
          width: 100%;
        }
        .stationery-img-box {
          position: relative;
          width: 100%;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(212, 119, 146, 0.22);
          border: 3px solid #F5C6D0;
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

        @media (max-width: 1024px) {
          .stationery-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .stationery-left {
            order: 2;
            width: 100%;
          }
          .stationery-right {
            order: 1;
            width: 100%;
          }
          .stationery-desc {
            font-size: 1.25rem;
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
            border-radius: 20px;
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
