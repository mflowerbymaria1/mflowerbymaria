export default function MantenimientoPage() {
    return (
      <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FDFBF7',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        <div style={{
            background: '#D47792',
            color: 'white',
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '900',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(212, 119, 146, 0.4)'
        }}>M</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333', marginBottom: '1rem' }}>
            Estamos trabajando 🛠️
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '500px', lineHeight: '1.6' }}>
            Nuestra tienda está temporalmente en pausa mientras subimos los productos y dejamos todo perfecto para vos. ¡Volvé prontito que se vienen cosas hermosas! 🌸
        </p>
      </div>
    );
  }
  
