"use client";
import { useState, useRef } from 'react';
import { useFavorites } from '../store/FavoritesContext';

const favoritesList = [
  {
    id: 1,
    name: "Cuaderno Sistema de Discos",
    image: "/images/mflower_prod_cuaderno_1772749182939.png"
  },
  {
    id: 2,
    name: "Planner Anual",
    image: "/images/mflower_prod_planner_1772749261418.png"
  },
  {
    id: 3,
    name: "Ficheros con Separadores",
    image: "/images/mflower_prod_fichero_1772749276913.png"
  },
  {
    id: 4,
    name: "Vaso con Onda",
    image: "/images/mflower_prod_vaso_1772749196170.png"
  },
  {
    id: 5,
    name: "Stickers Varios",
    image: "/images/mflower_prod_stickers_1772749221956.png"
  }
];

export default function ProductCarousel() {
  const scrollRef = useRef(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="favorites-section">
      <div className="container">
        <h2 className="section-title font-brand text-pink">Nuestros Favoritos</h2>

        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={scrollLeft} aria-label="Desplazar a la izquierda">
            &#10094;
          </button>

          <div className="carousel-tracks" ref={scrollRef}>
            {favoritesList.map((product) => {
              const isFav = isFavorite(product.id);
              return (
                <div className="product-card-aesthetic" key={product.id}>
                  <div className="product-image-wrapper">
                    <button
                      className={`favorite-heart-btn ${isFav ? 'active' : ''}`}
                      onClick={() => toggleFavorite(product)}
                      aria-label="Agregar a favoritos"
                    >
                      <svg width="24" height="24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </div>
                  <div className="product-info-aesthetic">
                    <h3 className="product-title-aesthetic">{product.name}</h3>
                    <button className="ver-mas-btn">Ver más</button>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-arrow right" onClick={scrollRight} aria-label="Desplazar a la derecha">
            &#10095;
          </button>
        </div>
      </div>

      <style>{`
        .favorites-section {
          padding: 5rem 1rem;
          background-color: #fafafa; /* Soft contrast from pure white */
        }
        .section-title {
          font-family: var(--font-quicksand), sans-serif;
          font-weight: 700;
          font-size: 3rem;
          text-align: center;
          margin-bottom: 3rem;
          color: #D47792;
        }
        .carousel-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
        }
        .carousel-arrow {
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          color: #777;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          position: absolute;
          z-index: 10;
        }
        .carousel-arrow:hover {
          background-color: var(--pastel-pink);
          color: #fff;
          border-color: var(--pastel-pink);
        }
        .carousel-arrow.left {
          left: -20px;
        }
        .carousel-arrow.right {
          right: -20px;
        }
        .carousel-tracks {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          padding: 1rem 5px 2rem 5px; /* specific padding for shadow bleed */
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .carousel-tracks::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        .product-card-aesthetic {
          min-width: 260px;
          flex: 0 0 auto;
          scroll-snap-align: start;
          background-color: #fff;
          border-radius: 20px; /* Very rounded borders */
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06); /* Soft shadow */
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .product-card-aesthetic:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .product-image-wrapper {
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background-color: #f7f7f7;
          position: relative;
        }
        .favorite-heart-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          color: #999;
          backdrop-filter: blur(2px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .favorite-heart-btn:hover {
          transform: scale(1.1);
        }
        .favorite-heart-btn.active {
          color: var(--pastel-pink);
          background: white;
        }
        .product-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card-aesthetic:hover .product-image-wrapper img {
          transform: scale(1.05);
        }
        .product-info-aesthetic {
          padding: 1.5rem 1.2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .product-title-aesthetic {
          font-size: 1.1rem;
          color: #444;
          font-weight: 500;
          margin: 0;
        }
        .ver-mas-btn {
          background-color: var(--pastel-green); /* Verde Menta */
          color: #2F5D38; /* Darker green text for contrast */
          border: none;
          padding: 10px 25px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 80%;
        }
        .ver-mas-btn:hover {
          background-color: var(--pastel-green-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(178, 242, 187, 0.4);
        }

        @media (max-width: 768px) {
          .carousel-arrow {
            display: none; /* Hide arrows on mobile, rely on touch swipe */
          }
          .carousel-tracks {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
