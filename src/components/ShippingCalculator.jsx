"use client";
import { useState } from 'react';

export default function ShippingCalculator({ onSelectShipping, selectedProvider }) {
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
                if (onSelectShipping) {
                    onSelectShipping(data.quotes[0]); // Select first result by default
                }
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
                        <div
                            key={idx}
                            className={`shipping-option ${selectedProvider === quote.provider ? 'selected' : ''}`}
                            onClick={() => onSelectShipping && onSelectShipping(quote)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="shipping-option-left">
                                <span className="provider font-bold">{quote.provider}</span>
                                <span className="time text-xs text-gray-500">Demora prod: {quote.days}</span>
                            </div>
                            <div className="shipping-option-right">
                                <span className="cost font-bold text-pink">${quote.price.toLocaleString('es-AR')}</span>
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
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    transition: border-color 0.2s;
                }
                .shipping-form:focus-within {
                    border-color: var(--pastel-pink);
                }
                .shipping-input {
                    flex: 1;
                    padding: 10px 15px;
                    border: none;
                    outline: none;
                    width: 100%; /* Force it to take space */
                }
                .shipping-btn {
                    padding: 10px 18px;
                    background-color: var(--pastel-green);
                    border: none;
                    color: #2F5D38;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    flex-shrink: 0;
                    white-space: nowrap;
                    margin-left: -5px; /* Pull it a bit to the left so it doesn't clip */
                    border-radius: 0 8px 8px 0; /* Match parent's right corners */
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
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .shipping-option:hover {
                    border-color: #ccc;
                    background: #f0f0f0;
                }
                .shipping-option.selected {
                    border: 2px solid var(--pastel-pink);
                    background: rgba(255, 209, 220, 0.1);
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
