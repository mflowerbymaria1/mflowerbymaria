"use client";
import { useState } from 'react';

export default function AccountModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock authentication
        alert(isLogin ? "Iniciando sesión..." : "Creando cuenta...");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    <h2 className="modal-title font-brand">M•flowerBymaria</h2>
                    <p className="modal-subtitle">{isLogin ? '¡Qué lindo verte de nuevo!' : 'Sumate a nuestra comunidad.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Nombre y Apellido</label>
                            <input type="text" placeholder="Ej. Flor Pérez" required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="email" placeholder="tucorreo@ejemplo.com" required />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="modal-btn">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="modal-footer">
                    <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? '¿No tenés cuenta? Registrate acá.' : '¿Ya tenés cuenta? Iniciá sesión.'}
                    </button>
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(2px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.2s ease;
                }
                .modal-content {
                    background: #fff;
                    padding: 2.5rem 2rem;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 380px;
                    position: relative;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    animation: scaleUp 0.3s ease;
                }
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #aaa;
                    cursor: pointer;
                }
                .modal-close:hover {
                    color: #333;
                }
                .modal-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .modal-title {
                    font-size: 2rem;
                    color: #D47792;
                    margin-bottom: 5px;
                }
                .modal-subtitle {
                    color: #777;
                    font-size: 0.95rem;
                }
                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .form-group label {
                    display: block;
                    font-size: 0.85rem;
                    color: #555;
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                .form-group input {
                    width: 100%;
                    padding: 10px 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-family: inherit;
                    outline: none;
                }
                .form-group input:focus {
                    border-color: var(--pastel-pink);
                }
                .modal-btn {
                    margin-top: 10px;
                    background-color: var(--pastel-pink);
                    color: #fff;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .modal-btn:hover {
                    background-color: #c96b83;
                }
                .modal-footer {
                    margin-top: 20px;
                    text-align: center;
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                }
                .toggle-btn {
                    background: none;
                    border: none;
                    color: #D47792;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                .toggle-btn:hover {
                    text-decoration: underline;
                }
                
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
