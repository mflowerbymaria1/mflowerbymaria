"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CyberPromoBanner() {
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
    <section className="cyber-promo-strip">
      <div className="cyber-container">
        <div className="cyber-content">
          <div className="cyber-badge-bubble">
            <span className="fire-icon">🔥</span>
            <span>CYBER MONDAY EXCLUSIVO</span>
          </div>

          <h2 className="cyber-title font-quicksand">
            ¡3x2 EN TODA LA TIENDA!
          </h2>

          <p className="cyber-subtitle">
            Llevás 3 productos y solo pagás 2. <strong>¡El de menor valor es 100% GRATIS!</strong><br />
            Podés combinar cuadernos, agendas, libretas, recetarios y más como vos quieras.
          </p>

          <div className="cyber-steps-grid">
            <div className="cyber-step-card">
              <span className="cyber-step-icon">🛍️</span>
              <div className="cyber-step-info">
                <strong>1. Elegí 3 productos</strong>
                <span>O múltiplos de 3 (llevás 6, pagás 4)</span>
              </div>
            </div>

            <div className="cyber-step-card">
              <span className="cyber-step-icon">🎁</span>
              <div className="cyber-step-info">
                <strong>2. El menor es GRATIS</strong>
                <span>Descuento automático en tu carrito</span>
              </div>
            </div>

            <div className="cyber-step-card">
              <span className="cyber-step-icon">💸</span>
              <div className="cyber-step-info">
                <strong>3. +20% OFF Transferencia</strong>
                <span>¡Descuentos acumulables y 3 cuotas!</span>
              </div>
            </div>
          </div>

          <div className="cyber-cta-wrap">
            <Link href="/productos" className="cyber-cta-btn">
              Aprovechar 3x2 Ahora ✨
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cyber-promo-strip {
          background: linear-gradient(135deg, #fff5f8 0%, #fdf2f8 35%, #f5f3ff 100%);
          border-top: 2px solid #ffd6e7;
          border-bottom: 2px solid #ffd6e7;
          padding: 2.8rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .cyber-promo-strip::before {
          content: "";
          position: absolute;
          top: -50px;
          right: -50px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(255, 0, 127, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .cyber-container {
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .cyber-badge-bubble {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #ff007f 0%, #7928ca 100%);
          color: white;
          font-weight: 800;
          font-size: 0.78rem;
          letter-spacing: 1px;
          padding: 6px 16px;
          border-radius: 50px;
          box-shadow: 0 4px 15px rgba(255, 0, 127, 0.3);
          margin-bottom: 1rem;
          text-transform: uppercase;
        }

        .fire-icon {
          font-size: 1rem;
        }

        .cyber-title {
          font-size: 2.3rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 0.8rem 0;
          letter-spacing: -0.5px;
        }

        .cyber-subtitle {
          font-size: 1.05rem;
          color: #4b5563;
          margin: 0 auto 2rem auto;
          max-width: 650px;
          line-height: 1.5;
        }

        .cyber-subtitle strong {
          color: #c41d7f;
        }

        .cyber-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          margin-bottom: 2rem;
        }

        .cyber-step-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 173, 210, 0.5);
          border-radius: 16px;
          padding: 1.2rem 1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .cyber-step-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 0, 127, 0.12);
        }

        .cyber-step-icon {
          font-size: 1.8rem;
          line-height: 1;
        }

        .cyber-step-info {
          display: flex;
          flex-direction: column;
        }

        .cyber-step-info strong {
          color: #1f2937;
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .cyber-step-info span {
          color: #6b7280;
          font-size: 0.8rem;
        }

        .cyber-cta-wrap {
          display: flex;
          justify-content: center;
        }

        .cyber-cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #e91e63 0%, #d81b60 100%);
          color: white;
          font-weight: 700;
          font-size: 0.98rem;
          padding: 12px 32px;
          border-radius: 30px;
          box-shadow: 0 6px 20px rgba(233, 30, 99, 0.35);
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .cyber-cta-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 25px rgba(233, 30, 99, 0.45);
          background: linear-gradient(135deg, #d81b60 0%, #c2185b 100%);
        }

        @media (max-width: 768px) {
          .cyber-title {
            font-size: 1.7rem;
          }
          .cyber-subtitle {
            font-size: 0.92rem;
          }
          .cyber-steps-grid {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }
          .cyber-step-card {
            padding: 1rem;
          }
          .cyber-promo-strip {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </section>
  );
}
