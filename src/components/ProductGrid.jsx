"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "../lib/supabase";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data.map(p => ({
          ...p,
          image: p.image_url,
          shortDescription: p.short_description,
          isBestSeller: p.is_best_seller,
          // Format price for display (Supabase stores as number)
          price: typeof p.price === 'number'
            ? p.price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
            : p.price
        })));
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <section className="product-grid-section">
      <div className="container">
        <div className="creative-space-header">
          <h2 className="creative-title">Tu espacio creativo empieza acá.</h2>
          <p className="creative-subtitle">
            En M•flower by Maria vas a encontrar herramientas pensadas con amor para organizar tu mundo y hacerlo un poquito mas lindo, para que tus ideas tengan el lugar que se merecen.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid var(--pastel-pink)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div className="grid-container">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .product-grid-section {
          padding: 5rem 1rem;
          background-color: var(--background);
        }
        .creative-space-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem auto;
        }
        .creative-title {
          font-family: var(--font-quicksand), sans-serif;
          font-size: 3.5rem;
          color: #D47792;
          margin-bottom: 1rem;
          font-weight: 700; /* Bold para destacar el titulo */
        }
        .creative-subtitle {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #666;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .grid-container {
            grid-template-columns: 1fr;
          }
          .creative-title {
            font-size: 2.2rem;
          }
          .creative-subtitle {
            font-size: 1rem;
          }
          .creative-space-header {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
