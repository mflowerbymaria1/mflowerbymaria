"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function NuevaClavePage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Handle the fragment in the URL if needed, though Supabase handles the session automatically
        // when the user is redirected back with access_token in the URL.
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                // The user is ready to type a new password
                console.log("Ready for password recovery");
            }
        });
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMsg('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccessMsg('¡Contraseña actualizada con éxito! Ya podés usar tu cuenta.');
            setTimeout(() => {
                router.push('/perfil');
            }, 3000);

        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-background py-12">
                <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '400px', width: '90%' }}>
                    <h1 style={{ fontFamily: 'var(--font-quicksand)', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: '1.5rem' }}>
                        Crear nueva contraseña 🔒
                    </h1>

                    {successMsg ? (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#2e7d32', background: '#e8f5e9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                                {successMsg}
                            </p>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Redirigiendo a tu perfil...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword}>
                            <div className="form-group" style={{ position: 'relative', marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#555' }}>Nueva Contraseña</label>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '10px', paddingRight: '45px', border: '1px solid #ddd', borderRadius: '8px' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '28px', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '5px' }}
                                    aria-label="Ver contraseña"
                                >
                                    {showPassword ? 'Ocultar' : 'Ver'}
                                </button>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#555' }}>Repetir Contraseña</label>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                                />
                            </div>

                            {errorMsg && <p style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center', marginBottom: '15px' }}>{errorMsg}</p>}

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ width: '100%', background: '#D47792', color: 'white', padding: '12px', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
