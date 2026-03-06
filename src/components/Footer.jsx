export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="main-footer container">
        <div className="footer-col">
          <p className="footer-origin"><strong>Envíos a todo el país</strong><br />Desde General Rodríguez,<br />Buenos Aires 🇦🇷</p>
        </div>
        <div className="footer-col">
          <h5>Sobre Nosotros</h5>
          <ul>
            <li><a href="#">Historia</a></li>
            <li><a href="#">Políticas de Envío</a></li>
            <li><a href="#">FAQ</a></li>
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

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} M•flowerBymaria. Todos los derechos reservados.</p>
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
        .footer-origin {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
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
      `}</style>
    </footer>
  );
}
