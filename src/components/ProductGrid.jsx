import ProductCard from "./ProductCard";

const mockProducts = [
  {
    id: 1,
    name: "Cuaderno Sistema de Discos",
    description: "Tapa plastificada. Hojas reposicionables 100gr.",
    price: "18.500",
    image: "/images/mflower_prod_cuaderno_1772749182939.png"
  },
  {
    id: 2,
    name: "Planner Anual",
    description: "Formato horizontal. Anillado y con stickers.",
    price: "22.000",
    image: "/images/mflower_prod_planner_1772749261418.png"
  },
  {
    id: 3,
    name: "Ficheros con Separadores",
    description: "Organiza todo por materia o mes.",
    price: "15.000",
    image: "/images/mflower_prod_fichero_1772749276913.png"
  },
  {
    id: 4,
    name: "Vaso de Vidrio Aesthetic",
    description: "Con tapa de bambú y sorbete de vidrio.",
    price: "12.000",
    image: "/images/mflower_prod_vaso_1772749196170.png"
  },
  {
    id: 5,
    name: "Stickers Varios",
    description: "Plancha de stickers troquelados mate.",
    price: "4.500",
    image: "/images/mflower_prod_stickers_1772749221956.png"
  },
  {
    id: 6,
    name: "Libreta A5 Notas",
    description: "Ideal para la cartera, 60 hojas rayadas.",
    price: "8.500",
    image: "/images/mflower_prod_cuaderno_1772749182939.png" // reusing image for demo
  }
];

export default function ProductGrid() {
  return (
    <section className="product-grid-section">
      <div className="container">
        <div className="creative-space-header">
          <h2 className="creative-title">Tu espacio creativo empieza acá.</h2>
          <p className="creative-subtitle">
            En M•flowerBymaria vas a encontrar herramientas pensadas con amor para organizar tu mundo y hacerlo un poquito mas lindo, para que tus ideas tengan el lugar que se merecen.
          </p>
        </div>

        <div className="grid-container">
          {mockProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <style>{`
        .product-grid-section {
          padding: 5rem 1rem;
          background-color: var(--background);
        }
        .creative-space-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem auto;
        }
        .creative-title {
          font-family: var(--font-quicksand), sans-serif;
          font-size: 3.5rem;
          color: #D47792;
          margin-bottom: 1rem;
          font-weight: 700; /* Bold para destacar el titulo */
        }
        .creative-subtitle {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #666;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .grid-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
