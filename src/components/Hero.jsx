import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero-static">
      <div className="overlay"></div>
      <div className="hero-content">
        <p className="hero-subtitle">Todo lo que tu lado girly necesita.</p>
        <Link href="/productos" className="cta-button">EXPLORAR COLECCIÓN</Link>
      </div>

      <style>{`
        .hero-static {
          position: relative;
          width: 100vw;
          height: 98vh;
          min-height: 600px;
          background-image: url('/images/mflower_hero_desk_new.jpg');
          background-size: cover;
          background-position: center top;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0); /* Removed the white filter */
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
        }
        .hero-subtitle {
          font-size: 2.2rem;
          color: #333;
          font-weight: 700;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9); /* Subdued shadow for legibility only */
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

        @media (max-width: 768px) {
          .hero-static {
            min-height: 400px;
            height: 60vh;
          }
          .hero-subtitle {
            font-size: 1.6rem;
            padding: 0 15px;
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
