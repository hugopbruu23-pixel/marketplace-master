import { Link } from "react-router-dom";
import { categories } from "@/data/mockData";

const CategoryGrid = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Categorias Populares
          </h2>
          <Link to="/categorias" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/categoria/${category.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display font-bold text-foreground text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} anúncios</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
