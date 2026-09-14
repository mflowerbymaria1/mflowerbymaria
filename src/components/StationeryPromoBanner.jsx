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
        <div className="stationery-card">
          {/* Lado Izquierdo: Imagen en Grande */}
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

          {/* Lado Derecho: Texto y Botón */}
          <div className="stationery-content">
            <div className="stationery-text-group">
              <span className="stationery-badge">🌸 Nuevos Ingresos</span>
              <p className="stationery-desc">
                Resaltadores en tonos pastel, cintas correctoras, lapiceras y accesorios súper tiernos de papelería y deco para tu escritorio.
              </p>
            </div>
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
          max-width: 1400px;
          margin: 0 auto;
        }
        .stationery-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4rem;
          background: #ffffff;
          padding: 2.5rem 3rem;
          border-radius: 40px;
          border: 3px solid #F5C6D0;
          box-shadow: 0 20px 60px rgba(212, 119, 146, 0.18);
        }
        .stationery-img-link {
          flex: 1.6;
          min-width: 0;
          display: block;
          text-decoration: none;
          border-radius: 30px;
          overflow: hidden;
        }
        .stationery-img-box {
          position: relative;
          width: 100%;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
          background: #FFF0F3;
        }
        .stationery-img {
          width: 100%;
          height: auto;
          min-height: 420px;
          max-height: 580px;
          display: block;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .stationery-img-link:hover .stationery-img {
          transform: scale(1.03);
        }
        .stationery-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 2.5rem;
          padding: 1rem 0;
        }
        .stationery-text-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.4rem;
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
          font-size: 1.45rem;
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
          padding: 22px 48px;
          border-radius: 60px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          box-shadow: 0 12px 35px rgba(212, 119, 146, 0.45);
          transition: all 0.3s ease;
        }
        .stationery-btn:hover {
          background: #c25f7c;
          transform: translateY(-3px);
          box-shadow: 0 16px 45px rgba(212, 119, 146, 0.6);
        }

        @media (max-width: 1100px) {
          .stationery-card {
            flex-direction: column;
            gap: 2.5rem;
            padding: 2rem;
          }
          .stationery-img-link {
            width: 100%;
          }
          .stationery-img {
            min-height: auto;
          }
          .stationery-content {
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
          .stationery-card {
            border-radius: 28px;
            padding: 1.2rem;
            gap: 1.8rem;
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
