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
    <section 
      className="stationery-section"
      style={{
        width: "100%",
        padding: "4rem 2rem 2.5rem 2rem",
        backgroundColor: "var(--background, #FAFAFA)",
        boxSizing: "border-box"
      }}
    >
      <div 
        className="stationery-container"
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <div 
          className="stationery-grid"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "4rem",
            width: "100%"
          }}
        >
          {/* LADO IZQUIERDO: Imagen sola en GIGANTE */}
          <div 
            className="stationery-left"
            style={{
              flex: "1.7",
              minWidth: "0",
              width: "100%"
            }}
          >
            <Link
              href="/productos?categoria=articulos-para-sumar-a-tu-carrito"
              style={{
                display: "block",
                textDecoration: "none",
                borderRadius: "36px",
                overflow: "hidden",
                width: "100%"
              }}
            >
              <div 
                className="stationery-img-box"
                style={{
                  position: "relative",
                  width: "100%",
                  borderRadius: "36px",
                  overflow: "hidden",
                  boxShadow: "0 22px 55px rgba(255, 133, 161, 0.25)",
                  border: "4px solid #FFD1DC",
                  backgroundColor: "#FFF0F3"
                }}
              >
                <img
                  src="/images/banner_libreria.jpg"
                  alt="Artículos para sumar a tu carrito"
                  className="stationery-img"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                    transition: "transform 0.4s ease"
                  }}
                />
              </div>
            </Link>
          </div>

          {/* LADO DERECHO: Texto, Badge y Botón Rosa Lindo */}
          <div 
            className="stationery-right"
            style={{
              flex: "1",
              minWidth: "0",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "2.2rem",
              padding: "1rem 0"
            }}
          >
            <span 
              className="stationery-badge"
              style={{
                display: "inline-block",
                backgroundColor: "#FFF0F3",
                color: "#FF6F96",
                fontSize: "1rem",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "10px 24px",
                borderRadius: "30px",
                border: "2px solid #FFD1DC"
              }}
            >
              🌸 Nuevos Ingresos
            </span>
            <p 
              className="stationery-desc"
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "1.55rem",
                color: "#2D2D2D",
                lineHeight: "1.6",
                margin: "0",
                fontWeight: "600"
              }}
            >
              Resaltadores en tonos pastel, cintas correctoras, lapiceras y accesorios súper tiernos de papelería y deco para tu escritorio.
            </p>
            <Link
              href="/productos?categoria=articulos-para-sumar-a-tu-carrito"
              className="stationery-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                background: "linear-gradient(135deg, #FFA0BC 0%, #FF6F96 100%)",
                color: "#ffffff",
                padding: "20px 44px",
                borderRadius: "60px",
                border: "2px solid #FFD1DC",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "1.15rem",
                fontWeight: "800",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                boxShadow: "0 12px 32px rgba(255, 111, 150, 0.45)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
            >
              <span>Ver artículos para sumar a tu carrito</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .stationery-img:hover {
          transform: scale(1.025);
        }
        .stationery-btn:hover {
          background: linear-gradient(135deg, #FF8DAF 0%, #F55582 100%) !important;
          transform: translateY(-3px);
          box-shadow: 0 16px 42px rgba(255, 111, 150, 0.6) !important;
        }

        @media (max-width: 1024px) {
          .stationery-grid {
            flex-direction: column !important;
            gap: 2.5rem !important;
          }
          .stationery-left {
            width: 100% !important;
          }
          .stationery-right {
            width: 100% !important;
            padding: 0 !important;
          }
          .stationery-desc {
            font-size: 1.3rem !important;
          }
          .stationery-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }

        @media (max-width: 600px) {
          .stationery-section {
            padding: 2rem 1rem 1rem 1rem !important;
          }
          .stationery-img-box {
            border-radius: 22px !important;
          }
          .stationery-desc {
            font-size: 1.1rem !important;
          }
          .stationery-btn {
            padding: 16px 24px !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
