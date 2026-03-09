import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/mockData";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">Todas as Categorias</h1>
        <p className="text-muted-foreground mb-10">Explore todas as categorias de jogos e itens digitais disponíveis.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              to={`/categoria/${category.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] hover-lift animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display font-bold text-foreground text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} anúncios</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
