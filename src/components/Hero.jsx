export default function Hero() {
  return (
    <section className="hero-static" style={{ backgroundImage: `url('/images/mflower_hero_desk_1772749167247.png')` }}>
      <div className="overlay"></div>
      <div className="hero-content">
        <p className="hero-subtitle">Todo lo que tu lado girly necesita.</p>
        <button className="cta-button">EXPLORAR COLECCIÓN</button>
      </div>

      <style>{`
        .hero-static {
          position: relative;
          width: 100vw;
          height: 70vh;
          min-height: 500px;
          background-size: cover;
          background-position: center;
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
          background: rgba(255, 255, 255, 0.2); /* Very subtle overlay, no heavy glows */
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
        }
        .cta-button:hover {
          background-color: var(--pastel-pink-hover);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
