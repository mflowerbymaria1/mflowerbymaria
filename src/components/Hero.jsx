"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function Hero() {
  const slides = [
    {
      image: "/images/mflower_hero_desk_new.jpg",
      subtitle: "Todo lo que tu lado girly necesita.",
      link: "/productos",
      buttonText: "EXPLORAR COLECCIÓN",
    },
    {
      image: "/images/banner_capsula.png",
      subtitle: "",
      link: "/productos?categoria=capsula-argentina",
      buttonText: "VER CÁPSULA",
    },
    {
      image: "/images/banner_maestro.png",
      subtitle: "",
      link: "/productos?categoria=sets-dia-del-maestro",
      buttonText: "APROVECHAR",
    },
  ];

  return (
    <section className="hero-slider">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={800}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className={`hero-slide-bg slide-${index}`} 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="overlay"></div>
              <div className={`hero-content content-slide-${index}`}>
                {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
                <Link href={slide.link} className="cta-button">
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-slider {
          position: relative;
          width: 100vw;
          height: 85vh;
          min-height: 600px;
        }

        .hero-swiper {
          width: 100%;
          height: 100%;
        }

        .hero-slide-bg {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* Primer slide: exactamente como estaba antes (cover) */
        .hero-slide-bg.slide-0 {
          background-size: cover;
          background-position: center;
        }

        .hero-slide-bg.slide-0::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 160px;
          height: 40px;
          background: linear-gradient(to right, transparent, #f5f0eb 30%);
          z-index: 5;
        }

        /* Segundo slide (Cápsula Argentina): se adapta sin cortarse */
        .hero-slide-bg.slide-1 {
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
          background-color: #E2D7CC;
        }

        /* Tercer slide (Día del Maestro) */
        .hero-slide-bg.slide-2 {
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0); 
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 0 20px;
        }

        /* En el segundo slide levantamos el botón para que no tape los productos */
        .content-slide-1 {
          margin-bottom: 130px;
        }

        .hero-subtitle {
          font-size: 2.2rem;
          color: #333;
          font-weight: 700;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9);
          margin-bottom: 10px;
        }

        .cta-button {
          margin-top: 10px;
          background-color: var(--pastel-pink);
          color: #fff;
          border: none;
          padding: 11px 28px;
          font-size: 0.88rem;
          border-radius: 30px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.8px;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(212, 119, 146, 0.35);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .cta-button:hover {
          background-color: var(--pastel-pink-hover);
          transform: translateY(-2px);
          color: white;
          box-shadow: 0 6px 18px rgba(212, 119, 146, 0.45);
        }

        .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.7;
          width: 10px;
          height: 10px;
        }

        .swiper-pagination-bullet-active {
          background: var(--pastel-pink);
          opacity: 1;
        }

        @media (max-width: 768px) {
          .hero-slider {
            min-height: 220px;
            height: 48vw; /* Proporción panorámica para que los banners encajen perfecto en celular */
            max-height: 320px;
          }
          .hero-slide-bg {
            background-size: cover;
            background-position: center center;
          }
          .hero-slide-bg.slide-0 {
            background-size: cover;
            background-position: center center;
          }
          .hero-slide-bg.slide-1 {
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
            background-color: #E2D7CC;
          }
          .hero-slide-bg.slide-2 {
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
            background-color: #F8C3D2; /* Color de fondo rosa de los costados del banner maestro */
          }
          .content-slide-1, .content-slide-2 {
            margin-bottom: 0;
            margin-top: auto;
            padding-bottom: 16px;
          }
          .hero-subtitle {
            font-size: 1.1rem;
            margin-bottom: 2px;
          }
          .cta-button {
            padding: 7px 18px;
            font-size: 0.75rem;
            margin-top: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          .hero-content {
            padding: 0 10px;
            gap: 8px;
          }
          .swiper-pagination-bullet {
            width: 7px;
            height: 7px;
          }
        }
      `}</style>
    </section>
  );
}
