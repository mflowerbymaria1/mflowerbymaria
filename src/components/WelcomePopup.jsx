"use client";
import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [showCode, setShowCode] = useState(false);

    useEffect(() => {
        // Show after a short delay on initial visit if not seen before
        const hasSeen = localStorage.getItem('mflower_welcome_seen');
        if (!hasSeen) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('mflower_welcome_seen', 'true');
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setShowCode(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="popup-close" onClick={handleClose}>&times;</button>
                <div className="popup-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <Logo size="large" color="#D47792" />
                    <p className="popup-subtitle">Suscribite y llevate un <strong>10% OFF</strong> en tu primera compra.</p>
                </div>

                {!showCode ? (
                    <form onSubmit={handleSubscribe} className="popup-form">
                        <input
                            type="email"
                            placeholder="Tu mail más lindo..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="popup-input"
                        />
                        <button type="submit" className="popup-btn">¡Lo quiero!</button>
                    </form>
                ) : (
                    <div className="popup-success">
                        <p>¡Gracias por sumarte!</p>
                        <p>Tu código de descuento es:</p>
                        <div className="discount-code">Bienvenida26</div>
                        <button className="popup-btn mt-3" onClick={handleClose}>Ir a la tienda</button>
                    </div>
                )}
            </div>

            <style>{`
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(3px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }
                .popup-content {
                    background: #FDFBF7; /* Crema base */
                    padding: 2.5rem 2rem;
                    border-radius: 20px;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
                    border: 2px solid var(--pastel-pink);
                    animation: slideUp 0.4s ease;
                }
                .popup-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #999;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                }
                .popup-close:hover {
                    color: #333;
                }
                .popup-title {
                    font-size: 3rem;
                    color: #D47792;
                    margin-bottom: 5px;
                }
                .popup-subtitle {
                    font-size: 1rem;
                    color: #555;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                .popup-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .popup-input {
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    border-radius: 25px;
                    font-size: 0.95rem;
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .popup-input:focus {
                    border-color: var(--pastel-pink);
                }
                .popup-btn {
                    padding: 12px 20px;
                    background-color: var(--pastel-green);
                    color: #2F5D38;
                    border: none;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .popup-btn:hover {
                    background-color: var(--pastel-green-hover);
                    transform: translateY(-2px);
                }
                .popup-success {
                    color: #333;
                }
                .discount-code {
                    font-family: var(--font-quicksand), sans-serif;
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #D47792;
                    background: #fff;
                    padding: 10px;
                    border-radius: 10px;
                    border: 2px dashed var(--pastel-pink);
                    display: inline-block;
                    margin: 10px 0;
                    letter-spacing: 2px;
                }
                .mt-3 { margin-top: 15px; }
                
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
