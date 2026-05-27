import { Montserrat, Quicksand } from "next/font/google";
import { CartProvider } from "../store/CartContext";
import { FavoritesProvider } from "../store/FavoritesContext";
import WelcomePopup from "../components/WelcomePopup";
import Script from "next/script";
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
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID; // Se configurará en Vercel

  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${quicksand.variable} font-sans`}>
        {/* Meta Pixel Code */}
        {pixelId && (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {/* End Meta Pixel Code */}

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
