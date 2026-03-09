import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/data/mockData";

const CategoryPage = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {category ? (
          <>
            <div className="relative overflow-hidden rounded-2xl mb-10">
              <img src={category.image} alt={category.name} className="w-full h-48 md:h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40 flex items-center">
                <div className="p-8">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{category.name}</h1>
                  <p className="text-muted-foreground">{category.count.toLocaleString()} anúncios disponíveis</p>
                </div>
              </div>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">Nenhum anúncio encontrado nesta categoria.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">Categoria não encontrada</h1>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
