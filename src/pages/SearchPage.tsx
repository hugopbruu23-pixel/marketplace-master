import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/mockData";
import { Search, SlidersHorizontal } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  let filtered = products.filter((p) => {
    const matchesQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.categorySlug === selectedCategory;
    const matchesType = selectedType === "all" || p.type === selectedType;
    return matchesQuery && matchesCategory && matchesType;
  });

  if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered.sort((a, b) => b.seller.rating - a.seller.rating);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          {query ? `Resultados para "${query}"` : "Todos os Anúncios"}
        </h1>
        <p className="text-muted-foreground mb-8">{filtered.length} anúncios encontrados</p>

        <div className="flex flex-wrap gap-3 mb-8 gradient-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mr-4">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtros:</span>
          </div>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">Todas Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">Todos os Tipos</option>
            <option value="conta">Contas</option>
            <option value="item">Itens</option>
            <option value="gift-card">Gift Cards</option>
            <option value="gold">Gold/Moedas</option>
            <option value="servico">Serviços</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="recent">Mais Recentes</option>
            <option value="price-low">Menor Preço</option>
            <option value="price-high">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-foreground font-display font-semibold mb-2">Nenhum resultado encontrado</p>
            <p className="text-muted-foreground">Tente buscar com outros termos ou filtros.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
