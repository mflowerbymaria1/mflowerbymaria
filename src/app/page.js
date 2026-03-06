import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCarousel from "../components/ProductCarousel";
import StoreFeatures from "../components/StoreFeatures";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import ShippingCalculator from "../components/ShippingCalculator";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductCarousel />
        <StoreFeatures />
        <section className="bg-background py-8">
          <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <ShippingCalculator />
          </div>
        </section>
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
