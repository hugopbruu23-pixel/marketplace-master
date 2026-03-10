import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, Plus, LogOut, Store, Package, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, store, isAdmin, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
              <input type="text" placeholder="Buscar anúncios, jogos ou categorias..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/categorias"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Categorias</Button></Link>
            <Link to="/como-funciona"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Como Funciona</Button></Link>

            {user ? (
              <>
                {store ? (
                  <Link to="/minha-loja"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><Store className="h-4 w-4 mr-1" />Minha Loja</Button></Link>
                ) : (
                  <Link to="/criar-loja"><Button size="sm" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"><Plus className="h-4 w-4 mr-1" />Criar Loja</Button></Link>
                )}
                {store && (
                  <Link to="/anunciar"><Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4 mr-1" />Anunciar</Button></Link>
                )}
                <Link to="/meus-pedidos"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><Package className="h-4 w-4 mr-1" />Pedidos</Button></Link>
                <Link to="/carrinho"><Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground"><ShoppingCart className="h-5 w-5" /></Button></Link>
                {isAdmin && (
                  <Link to="/admin"><Button variant="ghost" size="icon" className="text-primary"><Shield className="h-5 w-5" /></Button></Link>
                )}
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" /></Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/anunciar"><Button size="sm" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"><Plus className="h-4 w-4 mr-1" />Anunciar</Button></Link>
                <Link to="/carrinho"><Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground"><ShoppingCart className="h-5 w-5" /></Button></Link>
                <Link to="/login"><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><User className="h-5 w-5" /></Button></Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-foreground">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-4 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </form>
            <div className="flex flex-col gap-2">
              <Link to="/categorias" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start text-muted-foreground">Categorias</Button></Link>
              <Link to="/como-funciona" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start text-muted-foreground">Como Funciona</Button></Link>
              {user ? (
                <>
                  {store ? (
                    <Link to="/minha-loja" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start text-muted-foreground">Minha Loja</Button></Link>
                  ) : (
                    <Link to="/criar-loja" onClick={() => setMobileMenuOpen(false)}><Button className="w-full gradient-primary text-primary-foreground">Criar Loja</Button></Link>
                  )}
                  <Link to="/meus-pedidos" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start text-muted-foreground">Meus Pedidos</Button></Link>
                  <Link to="/carrinho" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start text-muted-foreground">Carrinho</Button></Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start text-primary">Admin</Button></Link>}
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}>Sair</Button>
                </>
              ) : (
                <>
                  <Link to="/anunciar" onClick={() => setMobileMenuOpen(false)}><Button className="w-full gradient-primary text-primary-foreground">Anunciar</Button></Link>
                  <Link to="/carrinho" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start text-muted-foreground">Carrinho</Button></Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start text-muted-foreground">Entrar</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
