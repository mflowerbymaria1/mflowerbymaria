export default function StoreFeatures() {
    return (
        <section className="store-features">
            <div className="container features-grid">
                <div className="feature-item">
                    <div className="feature-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </div>
                    <p className="feature-text">Envíos a todo el país</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                    </div>
                    <p className="feature-text">Contáctanos</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                    </div>
                    <p className="feature-text">Medios de pago<br /><span className="feature-subtext">3 cuotas s/interés o transferencia</span></p>
                </div>
            </div>

            <style>{`
        .store-features {
          padding: 3rem 1rem;
          background-color: #fff;
          border-bottom: 1px solid #eaeaea;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          text-align: center;
        }
        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        .feature-icon {
          width: 50px;
          height: 50px;
          background-color: var(--pastel-pink);
          color: #7A3F51;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .feature-item:hover .feature-icon {
          transform: translateY(-5px);
        }
        .feature-text {
          font-weight: 500;
          color: #444;
          font-size: 1rem;
          line-height: 1.4;
        }
        .feature-subtext {
          font-size: 0.85rem;
          color: #777;
          font-weight: 400;
        }
        
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}</style>
        </section>
    );
}
