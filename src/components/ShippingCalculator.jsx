"use client";
import { useState } from 'react';

export default function ShippingCalculator() {
    const [zipCode, setZipCode] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateShipping = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const res = await fetch('/api/shipping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetZip: zipCode })
            });
            const data = await res.json();

            if (data.success && data.quotes.length > 0) {
                setResults(data.quotes);
            } else {
                setError('No pudimos calcular el envío para ese CP.');
            }
        } catch (err) {
            setError('Hubo un error al calcular el envío.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shipping-calculator">
            <h4 className="flex items-center gap-2 mb-3 text-lg font-bold text-gray-800">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                Calculá tu envío
            </h4>
            <p className="text-sm text-gray-500 mb-4">Ingresá tu Código Postal. Punto de origen: General Rodríguez.</p>

            <form onSubmit={calculateShipping} className="shipping-form">
                <input
                    type="text"
                    placeholder="Tu código postal"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    maxLength={8}
                    className="shipping-input"
                />
                <button type="submit" disabled={loading} className="shipping-btn">
                    {loading ? 'Calculando...' : 'Calcular'}
                </button>
            </form>

            {error && <p className="shipping-error mt-3">{error}</p>}

            {results && (
                <div className="shipping-results mt-4">
                    {results.map((quote, idx) => (
                        <div key={idx} className="shipping-option">
                            <div className="shipping-option-left">
                                <span className="provider font-bold">{quote.provider}</span>
                                <span className="time text-xs text-gray-500">Demora prod: {quote.days}</span>
                            </div>
                            <div className="shipping-option-right">
                                <span className="cost font-bold text-pink">${quote.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .shipping-calculator {
                    background: #fff;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #f0f0f0;
                    margin-top: 1.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .flex { display: flex; }
                .items-center { align-items: center; }
                .gap-2 { gap: 0.5rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mb-4 { margin-bottom: 1rem; }
                .text-lg { font-size: 1.125rem; }
                .font-bold { font-weight: 700; }
                .text-gray-800 { color: #1f2937; }
                .text-gray-500 { color: #6b7280; }
                .text-sm { font-size: 0.875rem; }
                .text-xs { font-size: 0.75rem; }
                .mt-3 { margin-top: 0.75rem; }
                .mt-4 { margin-top: 1rem; }
                .text-pink { color: var(--pastel-pink); }
                
                .shipping-form {
                    display: flex;
                    gap: 10px;
                }
                .shipping-input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .shipping-input:focus {
                    border-color: var(--pastel-pink);
                }
                .shipping-btn {
                    padding: 10px 20px;
                    background-color: var(--pastel-green);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    color: #2F5D38;
                }
                .shipping-btn:hover {
                    background-color: var(--pastel-green-hover);
                }
                .shipping-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .shipping-error {
                    color: #e53e3e;
                    font-size: 0.85rem;
                }
                .shipping-results {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .shipping-option {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border: 1px dashed #ddd;
                    border-radius: 8px;
                    background: #fafafa;
                }
                .shipping-option-left {
                    display: flex;
                    flex-direction: column;
                }
                .provider { color: #333; }
                .cost { font-size: 1.1rem; }
            `}</style>
        </div>
    );
}
