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
      image: "/images/banner_hero_collage.png",
      subtitle: "",
      link: "/productos",
      buttonText: "EXPLORAR COLECCIÓN",
    },
    {
      image: "/images/banner_capsula.png",
      subtitle: "",
      link: "/productos?categoria=capsula-argentina",
      buttonText: "VER CÁPSULA",
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

        /* Primer slide (Collage Papelería): se adapta sin cortarse */
        .hero-slide-bg.slide-0 {
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
          background-color: #F8F3F1;
        }

        /* Segundo slide (Cápsula Argentina): se adapta sin cortarse */
        .hero-slide-bg.slide-1 {
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
          background-color: #E2D7CC;
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

        /* En el primer slide ubicamos el botón abajo para no tapar el collage */
        .content-slide-0 {
          margin-top: 260px;
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
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
            background-color: #F8F3F1;
          }
          .hero-slide-bg.slide-1 {
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
            background-color: #E2D7CC;
          }

          /* Slide 0 (Collage principal): botón bien nítido, chiquito y ubicado abajo */
          .content-slide-0 {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
            position: absolute;
            top: 82%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
          }

          /* Slide 1 (Cápsula Argentina): botón bien nítido, chiquito y ubicado justo debajo de '20% Off transferencia' */
          .content-slide-1 {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
            position: absolute;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
          }

          .hero-subtitle {
            font-size: 1.1rem;
            margin-bottom: 2px;
          }

          /* Botones para celulares: bien chicos, súper nítidos y sin sombras borrosas */
          .content-slide-0 .cta-button,
          .content-slide-1 .cta-button {
            padding: 4px 12px !important;
            font-size: 0.65rem !important;
            letter-spacing: 0.5px !important;
            font-weight: 800 !important;
            border-radius: 16px !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2) !important;
            margin: 0 !important;
          }

          .hero-content {
            padding: 0 10px;
            gap: 6px;
          }
          .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
    </section>
  );
}
