import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="main-footer container">
        <div className="footer-col">
          <h5>Medios de Envío</h5>
          <div className="shipping-methods">
            <div className="shipping-icon-wrapper" title="Correo Argentino">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>Correo Arg.</span>
            </div>
            <div className="shipping-icon-wrapper" title="Andreani">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Andreani</span>
            </div>
            <div className="shipping-icon-wrapper" title="Moto Mensajería">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Mensajería Exprés</span>
            </div>
          </div>
        </div>
        <div className="footer-col">
          <h5>Sobre Nosotros</h5>
          <ul>
            <li><a href="#">Historia</a></li>
            <li><Link href="/politicas-envio">Políticas de Envío</Link></li>
            <li><Link href="/faq">Preguntas Frecuentes (FAQ)</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contacto</h5>
          <ul>
            <li><a href="https://www.instagram.com/mflowerbymaria/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.facebook.com/p/Mflower-by-Maria-100084824422779/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://wa.me/541141817424?text=Hola!%20Vengo%20de%20la%20tienda%20online%20y%20tengo%20una%20consulta." target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <Logo size="small" color="#999" />
        <p>&copy; {new Date().getFullYear()} M•flower. Todos los derechos reservados.</p>
      </div>

      <style>{`
        .footer-wrapper {
          border-top: 1px solid #eaeaea;
          background-color: #fff;
        }
        .final-message-section {
          padding: 5rem 1rem;
          background-color: rgba(255, 209, 220, 0.15); /* Very soft hint of pastel pink */
          text-align: center;
        }
        .holi-flor-title {
          font-size: 3rem;
          color: var(--pastel-pink);
          margin-bottom: 0.5rem;
        }
        .tu-espacio-title {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.5rem;
          color: #555;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        .final-message-text {
          max-width: 650px;
          margin: 0 auto;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1rem; /* Smaller, comfortable reading size */
          line-height: 1.6;
          color: #666;
          font-weight: 400;
        }
        .main-footer {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          padding: 4rem 1rem;
        }
        .shipping-methods {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .shipping-icon-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .shipping-icon-wrapper svg {
          width: 24px;
          height: 24px;
          color: var(--pastel-pink);
        }
        .footer-col h5 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: #333;
          font-weight: 600;
        }
        .footer-col ul {
          list-style: none;
        }
        .footer-col ul li {
          margin-bottom: 10px;
        }
        .footer-col ul a {
          color: #777;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .footer-col ul a:hover {
          color: var(--pastel-pink);
        }
        .footer-bottom {
          text-align: center;
          padding: 1.5rem;
          border-top: 1px solid #eaeaea;
          font-size: 0.85rem;
          color: #999;
          background-color: #fafafa;
        }

        @media (max-width: 768px) {
          .main-footer {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
            padding: 3rem 1rem;
          }
          .shipping-methods {
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
}
