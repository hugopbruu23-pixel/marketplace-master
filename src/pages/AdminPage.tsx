import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Store, Package, ShoppingBag, AlertTriangle, LayoutDashboard, Ban, CheckCircle, XCircle, Eye, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Tab = "overview" | "users" | "stores" | "products" | "orders" | "disputes";

const AdminPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) { navigate("/"); return; }
    fetchAll();
  }, [user, isAdmin, authLoading]);

  const fetchAll = async () => {
    setLoading(true);
    const [u, s, p, o, d] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("stores").select("*, profiles(name)").order("created_at", { ascending: false }),
      supabase.from("store_products").select("*, stores(name)").order("created_at", { ascending: false }),
      supabase.from("orders").select("*, store_products(title), profiles!orders_buyer_id_fkey(name)").order("created_at", { ascending: false }),
      supabase.from("order_disputes").select("*, orders(id, total_price), profiles!order_disputes_opened_by_fkey(name)").order("created_at", { ascending: false }),
    ]);
    setUsers(u.data || []);
    setStores(s.data || []);
    setProducts(p.data || []);
    setOrders(o.data || []);
    setDisputes(d.data || []);
    setLoading(false);
  };

  const toggleBan = async (profile: any) => {
    const { error } = await supabase.from("profiles").update({ is_banned: !profile.is_banned, ban_reason: !profile.is_banned ? "Banido pelo admin" : null }).eq("id", profile.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: profile.is_banned ? "Usuário desbanido" : "Usuário banido" }); fetchAll(); }
  };

  const toggleStoreStatus = async (store: any) => {
    const newStatus = store.status === "active" ? "suspended" : "active";
    const { error } = await supabase.from("stores").update({ status: newStatus }).eq("id", store.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: `Loja ${newStatus === "active" ? "ativada" : "suspensa"}` }); fetchAll(); }
  };

  const toggleProductActive = async (product: any) => {
    const { error } = await supabase.from("store_products").update({ is_active: !product.is_active }).eq("id", product.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: product.is_active ? "Produto desativado" : "Produto ativado" }); fetchAll(); }
  };

  const toggleProductFeatured = async (product: any) => {
    const { error } = await supabase.from("store_products").update({ is_featured: !product.is_featured }).eq("id", product.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: product.is_featured ? "Removido dos destaques" : "Adicionado aos destaques" }); fetchAll(); }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("store_products").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Produto removido" }); fetchAll(); }
  };

  const resolveDispute = async (disputeId: string, resolution: "resolved_refund" | "resolved_denied", notes: string) => {
    const { error } = await supabase.from("order_disputes").update({ status: resolution, admin_notes: notes, resolved_by: user!.id }).eq("id", disputeId);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      if (resolution === "resolved_refund") {
        const dispute = disputes.find(d => d.id === disputeId);
        if (dispute) {
          await supabase.from("orders").update({ order_status: "refunded", payment_status: "refunded" }).eq("id", dispute.order_id);
        }
      }
      toast({ title: "Disputa resolvida" }); fetchAll();
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Carregando...</div><Footer /></div>
  );

  const tabs: { id: Tab; label: string; icon: any; count: number }[] = [
    { id: "overview", label: "Visão Geral", icon: LayoutDashboard, count: 0 },
    { id: "users", label: "Usuários", icon: Users, count: users.length },
    { id: "stores", label: "Lojas", icon: Store, count: stores.length },
    { id: "products", label: "Produtos", icon: Package, count: products.length },
    { id: "orders", label: "Pedidos", icon: ShoppingBag, count: orders.length },
    { id: "disputes", label: "Disputas", icon: AlertTriangle, count: disputes.filter(d => d.status === "open").length },
  ];

  const totalRevenue = orders.filter(o => o.payment_status === "paid").reduce((s, o) => s + Number(o.platform_fee || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Painel Admin</h1>
            <p className="text-muted-foreground">Gerencie todo o marketplace</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <Button key={t.id} variant={tab === t.id ? "default" : "ghost"} size="sm" onClick={() => setTab(t.id)}
              className={tab === t.id ? "gradient-primary text-primary-foreground" : "text-muted-foreground"}>
              <t.icon className="h-4 w-4 mr-1" /> {t.label} {t.count > 0 && <span className="ml-1 text-xs opacity-70">({t.count})</span>}
            </Button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Usuários", value: users.length, icon: Users },
              { label: "Lojas", value: stores.length, icon: Store },
              { label: "Produtos", value: products.length, icon: Package },
              { label: "Receita (Taxa)", value: `R$ ${totalRevenue.toFixed(2)}`, icon: ShoppingBag },
            ].map((s, i) => (
              <div key={i} className="gradient-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"><s.icon className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-display font-bold text-foreground">{s.value}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="gradient-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{u.name || "Sem nome"}</p>
                  <p className="text-sm text-muted-foreground">ID: {u.user_id.slice(0, 8)}... · {new Date(u.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="flex items-center gap-2">
                  {u.is_banned && <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">Banido</span>}
                  <Button variant="outline" size="sm" onClick={() => toggleBan(u)} className={u.is_banned ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"}>
                    <Ban className="h-4 w-4 mr-1" /> {u.is_banned ? "Desbanir" : "Banir"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stores */}
        {tab === "stores" && (
          <div className="space-y-3">
            {stores.map((s) => (
              <div key={s.id} className="gradient-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-sm text-muted-foreground">Dono: {s.profiles?.name || "?"} · PIX: {s.pix_key || "Sem chave"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${s.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{s.status === "active" ? "Ativa" : "Suspensa"}</span>
                  <Button variant="outline" size="sm" onClick={() => toggleStoreStatus(s)} className="border-border text-foreground">
                    {s.status === "active" ? "Suspender" : "Ativar"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="gradient-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {p.image_url && <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />}
                  <div>
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="text-sm text-muted-foreground">Loja: {p.stores?.name} · R$ {Number(p.price).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleProductFeatured(p)} className={p.is_featured ? "text-yellow-400" : "text-muted-foreground"}>
                    ★ {p.is_featured ? "Destaque" : "Normal"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleProductActive(p)} className="border-border text-foreground">
                    {p.is_active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="gradient-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{o.store_products?.title || "Produto"}</p>
                  <p className="text-sm text-muted-foreground">Comprador: {o.profiles?.name || "?"} · {new Date(o.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-primary">R$ {Number(o.total_price).toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${o.payment_status === "paid" ? "bg-green-500/20 text-green-400" : o.payment_status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                    {o.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disputes */}
        {tab === "disputes" && (
          <div className="space-y-3">
            {disputes.length === 0 ? (
              <div className="gradient-card rounded-xl border border-border p-12 text-center"><p className="text-muted-foreground">Nenhuma disputa</p></div>
            ) : disputes.map((d) => (
              <div key={d.id} className="gradient-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{d.reason}</p>
                    <p className="text-sm text-muted-foreground">Por: {d.profiles?.name || "?"} · Pedido: #{d.order_id.slice(0, 8)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${d.status === "open" ? "bg-orange-500/20 text-orange-400" : d.status === "resolved_refund" ? "bg-green-500/20 text-green-400" : d.status === "resolved_denied" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {d.status}
                  </span>
                </div>
                {d.description && <p className="text-sm text-muted-foreground mb-3">{d.description}</p>}
                {d.status === "open" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => resolveDispute(d.id, "resolved_refund", "Reembolso aprovado pelo admin")} className="bg-green-600 hover:bg-green-700 text-primary-foreground">
                      <CheckCircle className="h-4 w-4 mr-1" /> Reembolsar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => resolveDispute(d.id, "resolved_denied", "Disputa negada pelo admin")} className="border-red-500/50 text-red-400">
                      <XCircle className="h-4 w-4 mr-1" /> Negar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
