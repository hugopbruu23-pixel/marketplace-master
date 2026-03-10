import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Store, Star, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

const StorePage = () => {
  const { id } = useParams();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchStore = async () => {
      const [storeRes, prodRes] = await Promise.all([
        supabase.from("stores").select("*, profiles(name, avatar_url)").eq("id", id).single(),
        supabase.from("store_products").select("*").eq("store_id", id).eq("is_active", true).order("created_at", { ascending: false }),
      ]);
      setStore(storeRes.data);
      setProducts(prodRes.data || []);
      setLoading(false);
    };
    fetchStore();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Carregando...</div>
      <Footer />
    </div>
  );

  if (!store) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-bold text-foreground">Loja não encontrada</h1>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="gradient-card rounded-xl border border-border p-8 mb-8">
          <div className="flex items-center gap-6">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="w-20 h-20 rounded-xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-xl gradient-primary flex items-center justify-center">
                <Store className="h-10 w-10 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{store.name}</h1>
              {store.description && <p className="text-muted-foreground mt-1">{store.description}</p>}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-foreground">{Number(store.rating || 0).toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">{store.total_sales} vendas</span>
                <span className="text-sm text-muted-foreground">{products.length} produtos</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-display font-semibold text-foreground mb-6">Produtos</h2>
        {products.length === 0 ? (
          <div className="gradient-card rounded-xl border border-border p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Esta loja ainda não tem produtos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} to={`/produto/${p.id}`}>
                <div className="gradient-card rounded-xl border border-border overflow-hidden hover-lift transition-all cursor-pointer">
                  <div className="aspect-video bg-secondary">
                    {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-foreground line-clamp-2 mb-2">{p.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-primary">R$ {Number(p.price).toFixed(2)}</span>
                      {p.original_price && (
                        <span className="text-xs text-muted-foreground line-through">R$ {Number(p.original_price).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StorePage;
