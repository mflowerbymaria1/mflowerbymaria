import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCarousel from "../components/ProductCarousel";
import StoreFeatures from "../components/StoreFeatures";
import StationeryPromoBanner from "../components/StationeryPromoBanner";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductCarousel />
        <StoreFeatures />
        <StationeryPromoBanner />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
