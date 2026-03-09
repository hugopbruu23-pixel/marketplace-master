import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "@/data/mockData";

const FeaturedProducts = () => {
  const featured = products.filter((p) => p.featured);
  const latest = products.slice(0, 6);

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Em Destaque
            </h2>
            <Link to="/buscar?featured=true" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              Ver mais →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Mais Recentes
            </h2>
            <Link to="/buscar" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latest.map((product, i) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;
