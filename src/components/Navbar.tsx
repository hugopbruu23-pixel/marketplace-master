import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">P</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Pay<span className="text-gradient">blox</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar anúncios, jogos ou categorias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/categorias">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Categorias
              </Button>
            </Link>
            <Link to="/como-funciona">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Como Funciona
              </Button>
            </Link>
            <Link to="/anunciar">
              <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4 mr-1" />
                Anunciar
              </Button>
            </Link>
            <Link to="/carrinho">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  0
                </span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-4 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
            <div className="flex flex-col gap-2">
              <Link to="/categorias" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Categorias</Button>
              </Link>
              <Link to="/como-funciona" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Como Funciona</Button>
              </Link>
              <Link to="/anunciar" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gradient-primary text-primary-foreground">Anunciar</Button>
              </Link>
              <Link to="/carrinho" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Carrinho</Button>
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Entrar</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
