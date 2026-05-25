"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('mflower_cart');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure prices are parsed as correct JS numbers, bypassing dot thousands-separators
                const sanitized = parsed.map(item => {
                    const priceStr = item.price != null ? String(item.price) : "0";
                    let numericPrice = parseFloat(priceStr.replace(/\./g, '').replace(/,/g, '.')) || 0;

                    // Auto-fix for users stuck with old broken prices (e.g., 15 instead of 15000)
                    if (numericPrice > 0 && numericPrice < 100) {
                        numericPrice = numericPrice * 1000;
                    }

                    return { ...item, price: numericPrice };
                });
                setCartItems(sanitized);
            } catch (e) {
                console.error("Could not parse cart", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('mflower_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            // Sanitize incoming product price
            const priceStr = product.price != null ? String(product.price) : "0";
            const numericPrice = parseFloat(priceStr.replace(/\./g, '').replace(/,/g, '.')) || 0;

            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity, price: numericPrice } : item);
            }
            return [...prev, { ...product, price: numericPrice, quantity: quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount, isCartOpen, setIsCartOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
