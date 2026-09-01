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
      link: "/productos",
      buttonText: "APROVECHAR",
    },
  ];

  return (
    <section className="hero-slider">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className={`hero-slide-bg ${index === 0 ? "first-slide" : "banner-slide"}`} 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="overlay"></div>
              <div className="hero-content">
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

        /* Primer slide: exactamente como estaba antes */
        .hero-slide-bg.first-slide {
          background-size: cover;
          background-position: center;
        }

        .hero-slide-bg.first-slide::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 160px;
          height: 40px;
          background: linear-gradient(to right, transparent, #f5f0eb 30%);
          z-index: 5;
        }

        /* Los otros 2 banners: centrados y ajustados */
        .hero-slide-bg.banner-slide {
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

        .hero-subtitle {
          font-size: 2.2rem;
          color: #333;
          font-weight: 700;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9);
          margin-bottom: 10px;
        }

        .cta-button {
          margin-top: 15px;
          background-color: var(--pastel-pink);
          color: #fff;
          border: none;
          padding: 15px 40px;
          font-size: 1rem;
          border-radius: 50px;
          font-weight: bold;
          cursor: pointer;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .cta-button:hover {
          background-color: var(--pastel-pink-hover);
          transform: translateY(-2px);
          color: white;
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
            min-height: 400px;
            height: 60vh;
          }
          .hero-slide-bg.banner-slide {
            background-position: center center;
          }
          .hero-subtitle {
            font-size: 1.6rem;
          }
          .cta-button {
            padding: 12px 30px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}
