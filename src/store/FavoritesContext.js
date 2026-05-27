"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('mflower_favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Could not parse favorites", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('mflower_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (product) => {
        setFavorites(prev => {
            const exists = prev.some(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id); // Remove
            } else {
                return [...prev, product]; // Add
            }
        });
    };

    const isFavorite = (productId) => {
        return favorites.some(item => item.id === productId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);
