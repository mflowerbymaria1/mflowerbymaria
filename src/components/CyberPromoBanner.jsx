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
    <section className="cyber-promo-strip" id="cyber-monday-promo">
      <div className="cyber-container">
        <div className="cyber-content">
          {/* Tag llamativo y grande */}
          <div className="cyber-eyebrow">
            <span className="fire-icon">🔥</span>
            <span className="cyber-tag-text">CYBER MONDAY</span>
            <span className="fire-icon">🔥</span>
          </div>

          {/* Título Principal Gigante */}
          <h2 className="cyber-main-title font-quicksand">
            ¡SÚPER PROMO <span className="highlight-3x2">3x2</span> EN TODA LA TIENDA!
          </h2>

          {/* Subtítulo destacado tipo cinta */}
          <div className="cyber-ribbon">
            <span>✨ LLEVÁS 3 PRODUCTOS Y PAGÁS SOLO 2 · <strong>EL DE MENOR VALOR ES 100% GRATIS</strong> ✨</span>
          </div>

          <p className="cyber-desc">
            Podés combinar cuadernos A4, A5, agendas, recetarios, libretas o accesorios como más te guste.<br className="desktop-break" />
            ¡El descuento se calcula y aplica <strong>automáticamente en tu carrito</strong>!
          </p>

          {/* 3 Pasos bien visibles */}
          <div className="cyber-steps-grid">
            <div className="cyber-step-card">
              <div className="cyber-step-icon">🛍️</div>
              <div className="cyber-step-info">
                <span className="step-number">PASO 1</span>
                <strong>Elegí 3 productos</strong>
                <p>O múltiplos de 3: si llevás 6 pagás 4, si llevás 9 pagás 6.</p>
              </div>
            </div>

            <div className="cyber-step-card featured-step">
              <div className="cyber-step-icon">🎁</div>
              <div className="cyber-step-info">
                <span className="step-number step-free">BENEFICIO 100% FREE</span>
                <strong>El de menor valor es GRATIS</strong>
                <p>Cobramos los más caros y el más barato te queda en $0.</p>
              </div>
            </div>

            <div className="cyber-step-card">
              <div className="cyber-step-icon">💸</div>
              <div className="cyber-step-info">
                <span className="step-number">PASO 3</span>
                <strong>+20% OFF Transferencia</strong>
                <p>¡Descuento extra acumulable y hasta 3 cuotas sin interés!</p>
              </div>
            </div>
          </div>

          {/* Botón CTA Grande y Llamativo */}
          <div className="cyber-cta-wrap">
            <Link href="/productos" className="cyber-cta-btn">
              🛍️ ¡APROVECHAR EL 3x2 AHORA!
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cyber-promo-strip {
          width: 100%;
          background: linear-gradient(135deg, #fff0f5 0%, #ffe4ee 30%, #fdf2f8 70%, #f5f0ff 100%);
          border-top: 3px solid #ff75a0;
          border-bottom: 3px solid #ff75a0;
          padding: 4rem 1.5rem;
          position: relative;
          box-sizing: border-box;
          clear: both;
          box-shadow: 0 10px 30px rgba(255, 117, 160, 0.15);
        }

        .cyber-container {
          max-width: 1180px;
          margin: 0 auto;
          text-align: center;
        }

        /* Eyebrow de Cyber Monday mucho más grande */
        .cyber-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #ff007f 0%, #d81b60 50%, #7928ca 100%);
          color: #ffffff;
          font-weight: 900;
          font-size: 1.15rem;
          letter-spacing: 2.5px;
          padding: 10px 26px;
          border-radius: 50px;
          box-shadow: 0 6px 20px rgba(255, 0, 127, 0.4);
          margin-bottom: 1.3rem;
          text-transform: uppercase;
          animation: pulseGlow 2.5s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 6px 20px rgba(255, 0, 127, 0.4);
          }
          50% {
            transform: scale(1.04);
            box-shadow: 0 8px 28px rgba(255, 0, 127, 0.6);
          }
        }

        .fire-icon {
          font-size: 1.4rem;
        }

        .cyber-tag-text {
          font-family: var(--font-quicksand), sans-serif;
          font-weight: 900;
        }

        /* Título principal gigante */
        .cyber-main-title {
          font-size: 3.2rem;
          font-weight: 900;
          color: #1a1a24;
          margin: 0 0 1.2rem 0;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .highlight-3x2 {
          background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 3.6rem;
          font-weight: 950;
          text-shadow: 0 4px 20px rgba(233, 30, 99, 0.2);
        }

        /* Cinta destacada */
        .cyber-ribbon {
          display: inline-block;
          background: #ffffff;
          border: 2px dashed #ff4081;
          border-radius: 50px;
          padding: 10px 24px;
          color: #b71556;
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 1.2rem;
          box-shadow: 0 4px 15px rgba(255, 64, 129, 0.12);
        }

        .cyber-ribbon strong {
          color: #d81b60;
          text-decoration: underline;
        }

        .cyber-desc {
          font-size: 1.15rem;
          color: #4b5563;
          margin: 0 auto 2.5rem auto;
          max-width: 780px;
          line-height: 1.6;
        }

        .cyber-desc strong {
          color: #1f2937;
        }

        /* Grid de 3 Pasos */
        .cyber-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.8rem;
        }

        .cyber-step-card {
          background: #ffffff;
          border: 2px solid #ffd4e5;
          border-radius: 20px;
          padding: 1.8rem 1.4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          position: relative;
        }

        .cyber-step-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(255, 0, 127, 0.15);
          border-color: #ff80ab;
        }

        .cyber-step-card.featured-step {
          background: linear-gradient(180deg, #ffffff 0%, #fff7fb 100%);
          border: 2.5px solid #ff007f;
          box-shadow: 0 8px 24px rgba(255, 0, 127, 0.18);
        }

        .cyber-step-icon {
          font-size: 2.6rem;
          margin-bottom: 0.8rem;
          line-height: 1;
        }

        .step-number {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: #888888;
          background: #f3f4f6;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 8px;
        }

        .step-number.step-free {
          background: linear-gradient(135deg, #ff007f 0%, #d81b60 100%);
          color: #ffffff;
          font-weight: 900;
        }

        .cyber-step-info strong {
          display: block;
          color: #1a1a24;
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .cyber-step-info p {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.45;
          margin: 0;
        }

        /* Botón de llamada a la acción */
        .cyber-cta-wrap {
          display: flex;
          justify-content: center;
        }

        .cyber-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #ff007f 0%, #d81b60 50%, #ad1457 100%);
          color: #ffffff !important;
          font-weight: 900;
          font-size: 1.2rem;
          letter-spacing: 0.5px;
          padding: 16px 42px;
          border-radius: 50px;
          box-shadow: 0 8px 25px rgba(233, 30, 99, 0.45);
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .cyber-cta-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 32px rgba(233, 30, 99, 0.6);
          background: linear-gradient(135deg, #d81b60 0%, #c2185b 50%, #880e4f 100%);
        }

        @media (max-width: 900px) {
          .cyber-main-title {
            font-size: 2.4rem;
          }
          .highlight-3x2 {
            font-size: 2.8rem;
          }
          .cyber-steps-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .desktop-break {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .cyber-promo-strip {
            padding: 3rem 1.2rem;
          }
          .cyber-eyebrow {
            font-size: 0.95rem;
            padding: 8px 18px;
            letter-spacing: 1.5px;
          }
          .cyber-main-title {
            font-size: 1.9rem;
          }
          .highlight-3x2 {
            font-size: 2.3rem;
          }
          .cyber-ribbon {
            font-size: 0.92rem;
            padding: 8px 16px;
            border-radius: 20px;
          }
          .cyber-desc {
            font-size: 1rem;
          }
          .cyber-cta-btn {
            font-size: 1.05rem;
            padding: 14px 28px;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
