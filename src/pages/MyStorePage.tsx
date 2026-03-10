import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, DollarSign, ShoppingBag, Plus, Settings, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const MyStorePage = () => {
  const { user, store } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"products" | "orders" | "settings">("products");
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!store) { navigate("/criar-loja"); return; }
    fetchData();
  }, [user, store]);

  const fetchData = async () => {
    if (!store) return;
    setLoading(true);
    const [prodRes, ordRes, storeRes] = await Promise.all([
      supabase.from("store_products").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
      supabase.from("orders").select("*, store_products(title), profiles!orders_buyer_id_fkey(name)").eq("store_id", store.id).order("created_at", { ascending: false }),
      supabase.from("stores").select("*").eq("id", store.id).single(),
    ]);
    setProducts(prodRes.data || []);
    setOrders(ordRes.data || []);
    setStoreData(storeRes.data);
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("store_products").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Produto removido!" });
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const totalEarnings = orders.filter(o => o.payment_status === "paid").reduce((sum, o) => sum + Number(o.total_price) - Number(o.platform_fee), 0);

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Carregando...</div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{storeData?.name || "Minha Loja"}</h1>
            <p className="text-muted-foreground">Gerencie seus produtos e vendas</p>
          </div>
          <Link to="/anunciar">
            <Button className="gradient-primary text-primary-foreground shadow-glow">
              <Plus className="h-4 w-4 mr-1" /> Novo Produto
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="gradient-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"><Package className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Produtos</p>
                <p className="text-2xl font-display font-bold text-foreground">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="gradient-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"><ShoppingBag className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Vendas</p>
                <p className="text-2xl font-display font-bold text-foreground">{orders.filter(o => o.payment_status === "paid").length}</p>
              </div>
            </div>
          </div>
          <div className="gradient-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"><DollarSign className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Ganhos</p>
                <p className="text-2xl font-display font-bold text-primary">R$ {totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["products", "orders", "settings"] as const).map((t) => (
            <Button key={t} variant={tab === t ? "default" : "ghost"} size="sm" onClick={() => setTab(t)} className={tab === t ? "gradient-primary text-primary-foreground" : "text-muted-foreground"}>
              {t === "products" ? "Produtos" : t === "orders" ? "Vendas" : "Configurações"}
            </Button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="gradient-card rounded-xl border border-border p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhum produto cadastrado</p>
                <Link to="/anunciar"><Button className="gradient-primary text-primary-foreground shadow-glow">Criar Primeiro Produto</Button></Link>
              </div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="gradient-card rounded-xl border border-border p-4 flex items-center gap-4">
                  {p.image_url && <img src={p.image_url} alt={p.title} className="w-16 h-16 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{p.title}</p>
                    <p className="text-sm text-muted-foreground">R$ {Number(p.price).toFixed(2)} · Estoque: {p.stock}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {p.is_active ? "Ativo" : "Inativo"}
                    </span>
                    <Link to={`/produto/${p.id}`}><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="gradient-card rounded-xl border border-border p-12 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma venda ainda</p>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="gradient-card rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{o.store_products?.title || "Produto"}</p>
                    <p className="text-sm text-muted-foreground">Comprador: {o.profiles?.name || "Anônimo"} · {new Date(o.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-primary">R$ {Number(o.total_price).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${o.payment_status === "paid" ? "bg-green-500/20 text-green-400" : o.payment_status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                      {o.payment_status === "paid" ? "Pago" : o.payment_status === "pending" ? "Pendente" : o.payment_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {tab === "settings" && storeData && (
          <div className="gradient-card rounded-xl border border-border p-6 max-w-xl">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Settings className="h-5 w-5" /> Configurações da Loja</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="text-foreground font-medium">{storeData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`text-xs px-2 py-1 rounded-full ${storeData.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{storeData.status === "active" ? "Ativa" : storeData.status}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chave PIX</p>
                <p className="text-foreground font-medium">{storeData.pix_key || "Não cadastrada"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo da Chave</p>
                <p className="text-foreground font-medium">{storeData.pix_key_type?.toUpperCase() || "-"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyStorePage;
