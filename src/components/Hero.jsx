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
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.link} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
              <div 
                className={`hero-slide-bg slide-${index}`} 
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="overlay"></div>
                <div className={`hero-content content-slide-${index}`}>
                  {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
                  <span className="cta-button">
                    {slide.buttonText}
                  </span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-slider {
          position: relative;
          width: 100%;
          height: 50vw;
          aspect-ratio: 2 / 1;
          overflow: hidden;
        }

        .hero-swiper {
          width: 100%;
          height: 100%;
        }

        .hero-slide-bg {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background-size: 100% 100%;
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
          position: absolute;
          z-index: 10;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: auto;
          padding: 0 20px;
        }

        /* Slide 0 (Collage Papelería): botón ubicado abajo */
        .content-slide-0 {
          top: 84%;
        }

        /* Slide 1 (Cápsula Argentina): botón ubicado debajo de '20% Off transferencia' */
        .content-slide-1 {
          top: 43%;
        }

        .hero-subtitle {
          font-size: 2.2rem;
          color: #333;
          font-weight: 700;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9);
          margin-bottom: 10px;
        }

        .cta-button {
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

        .swiper-pagination {
          bottom: 6px !important;
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
            width: 100%;
            height: 50vw;
            aspect-ratio: 2 / 1;
          }

          .content-slide-0 {
            top: 84%;
          }

          .content-slide-1 {
            top: 43%;
          }

          /* Botones para celulares: bien chicos, súper nítidos y sin sombras borrosas */
          .content-slide-0 .cta-button,
          .content-slide-1 .cta-button {
            padding: 4px 12px !important;
            font-size: 0.62rem !important;
            letter-spacing: 0.5px !important;
            font-weight: 800 !important;
            border-radius: 16px !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2) !important;
            margin: 0 !important;
          }

          .swiper-pagination {
            bottom: 3px !important;
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
