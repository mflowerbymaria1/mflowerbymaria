"use client";
import { useState, useRef, useEffect } from 'react';
import { useFavorites } from '../store/FavoritesContext';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function ProductCarousel() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_best_seller', true)
            .limit(6);
        
        if (!error && data) {
            setFavoritesList(data.map(p => ({
                ...p,
                image: p.image_url
            })));
        }
        setLoading(false);
    }
    fetchFavorites();
  }, []);
  const scrollRef = useRef(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -242, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 242, behavior: 'smooth' });
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      aria-label="Agregar a favoritos"
                    >
                      <svg width="24" height="24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    {product.category && product.category.toLowerCase().includes('planner') ? (
                      <div className="relative w-full h-full" style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          loading="lazy" 
                          style={{ filter: 'blur(8px)', opacity: 0.6, mixBlendMode: 'normal' }} 
                        />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.4)',
                          zIndex: 10
                        }}>
                          <span style={{
                            backgroundColor: '#D47792',
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '0.8rem',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 4px 10px rgba(212,119,146,0.3)'
                          }}>
                            Próximamente
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img src={product.image} alt={product.name} loading="lazy" />
                    )}
                  </div>
                  <div className="product-info-aesthetic">
                    <h3 className="product-title-aesthetic">{product.name}</h3>
                    <Link href={`/productos/${product.id}`} className="ver-mas-btn text-center" style={{ textDecoration: 'none', display: 'inline-block' }}>Ver más</Link>
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
          width: 100%;
          max-width: 1000px;
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
          width: 100%;
        }
        .carousel-tracks::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        .product-card-aesthetic {
          min-width: 260px;
          max-width: 280px;
          flex: 0 0 auto;
          scroll-snap-align: center;
          background-color: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%; /* Ensure all cards stretch to same height */
        }
        .product-card-aesthetic:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .product-card-aesthetic .product-image-wrapper {
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background-color: #fff;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
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
        .product-card-aesthetic .product-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.5s ease;
          mix-blend-mode: multiply;
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
          justify-content: space-between; /* Push button to bottom */
          gap: 12px;
          flex-grow: 1; /* Take up remaining height */
        }
        .product-title-aesthetic {
          font-size: 1.1rem;
          color: #444;
          font-weight: 500;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Limit to 2 lines max */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: 2.5em; /* Ensure uniform height for title area */
        }
        .ver-mas-btn {
          background-color: var(--pastel-green);
          color: #2F5D38;
          border: none;
          padding: 10px 25px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 80%;
          margin-top: auto; /* Push to very bottom if space exists */
        }
        .ver-mas-btn:hover {
          background-color: var(--pastel-green-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(178, 242, 187, 0.4);
        }

        @media (max-width: 768px) {
          .carousel-arrow {
            display: none;
          }
          .carousel-tracks {
            padding-left: 1rem;
            padding-right: 1rem;
            gap: 1rem;
          }
          .product-card-aesthetic {
             min-width: 240px; /* Even smaller on mobile */
             max-width: 260px;
          }
        }
      `}</style>
    </section>
  );
}
