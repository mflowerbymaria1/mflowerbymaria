import { Montserrat, Quicksand } from "next/font/google";
import { CartProvider } from "../store/CartContext";
import { FavoritesProvider } from "../store/FavoritesContext";
import WelcomePopup from "../components/WelcomePopup";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata = {
  title: "M•flower by Maria | Tienda Online",
  description: "✨ Todo lo que tu lado girly necesita. Tu espacio creativo empieza acá.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${quicksand.variable} font-sans`}>
        <CartProvider>
          <FavoritesProvider>
            <WelcomePopup />
            {children}
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
