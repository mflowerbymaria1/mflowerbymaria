"use client";
import { useState } from 'react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AccountModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (isForgotPassword) {
                const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/nueva-clave`,
                });
                if (error) throw error;
                setSuccessMsg('Te enviamos un correo con un link para recuperar tu contraseña. Por favor, revisá tu bandeja de entrada.');
                return;
            } else if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onClose();
                router.push('/perfil');
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: name } }
                });
                if (error) throw error;
                if (!data.session) {
                    setSuccessMsg('¡Ya casi! Te enviamos un correo de confirmación. Por favor, revisá tu bandeja de entrada (o correo no deseado) y hacé clic en el link para poder iniciar sesión.');
                    return;
                }
                onClose();
                router.push('/perfil');
            }
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="modal-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Logo size="medium" color="#D47792" className="mb-2" />
                    <p className="modal-subtitle">
                        {isForgotPassword ? 'Recuperar contraseña' : (isLogin ? '¡Qué lindo verte de nuevo!' : 'Sumate a nuestra comunidad.')}
                    </p>
                </div>

                {successMsg ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✉️</div>
                        <h3 style={{ color: '#D47792', marginBottom: '15px' }}>{isForgotPassword ? '¡Correo Enviado!' : '¡Registro Exitoso!'}</h3>
                        <p style={{ color: '#555', lineHeight: '1.5', marginBottom: '20px' }}>{successMsg}</p>
                        <button onClick={() => {
                            if (isForgotPassword) {
                                setIsForgotPassword(false);
                                setSuccessMsg('');
                            } else {
                                onClose();
                            }
                        }} className="modal-btn" style={{ width: '100%' }}>Entendido</button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="modal-form">
                            {!isLogin && !isForgotPassword && (
                                <div className="form-group">
                                    <label>Nombre y Apellido</label>
                                    <input type="text" placeholder="Ej. Flor Pérez" value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                            )}
                            <div className="form-group">
                                <label>E-mail</label>
                                <input type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            
                            {!isForgotPassword && (
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label>Contraseña</label>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        required 
                                        style={{ paddingRight: '45px' }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '10px', top: '32px', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '5px' }}
                                        aria-label="Ver contraseña"
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                    </button>
                                </div>
                            )}

                            {isLogin && !isForgotPassword && (
                                <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '15px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsForgotPassword(true); setErrorMsg(''); }}
                                        style={{ background: 'none', border: 'none', color: '#D47792', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            )}

                            {errorMsg && (
                                <p style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
                                    {errorMsg === 'Invalid login credentials' ? 'Email o contraseña incorrectos.' :
                                     errorMsg.includes('rate limit') ? 'Hiciste muchos intentos seguidos. Por favor, esperá un ratito (aprox. 1 hora) antes de volver a intentar o revisá tu correo.' :
                                     errorMsg.includes('already registered') ? 'Este correo ya tiene una cuenta. Elegí "Iniciá sesión".' :
                                     errorMsg.includes('at least 6 characters') ? 'La contraseña debe tener al menos 6 caracteres.' :
                                     'Ocurrió un error. Por favor, revisá los datos e intentá de nuevo.'}
                                </p>
                            )}

                            <button type="submit" className="modal-btn" disabled={loading}>
                                {loading ? 'Cargando...' : (isForgotPassword ? 'Enviar link de recuperación' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'))}
                            </button>
                        </form>

                        <div className="modal-footer">
                            <button className="toggle-btn" onClick={() => { setIsLogin(!isLogin); setIsForgotPassword(false); setErrorMsg(''); setSuccessMsg(''); }}>
                                {isForgotPassword ? 'Volver a Iniciar Sesión' : (isLogin ? '¿No tenés cuenta? Registrate acá.' : '¿Ya tenés cuenta? Iniciá sesión.')}
                            </button>
                        </div>
                    </>
                )}
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
