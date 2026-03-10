import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pendente", color: "text-yellow-400 bg-yellow-500/20", icon: Clock },
  paid: { label: "Pago", color: "text-green-400 bg-green-500/20", icon: CheckCircle },
  processing: { label: "Processando", color: "text-blue-400 bg-blue-500/20", icon: Clock },
  delivered: { label: "Entregue", color: "text-green-400 bg-green-500/20", icon: CheckCircle },
  completed: { label: "Concluído", color: "text-green-400 bg-green-500/20", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "text-red-400 bg-red-500/20", icon: XCircle },
  dispute_open: { label: "Disputa Aberta", color: "text-orange-400 bg-orange-500/20", icon: AlertTriangle },
  refunded: { label: "Reembolsado", color: "text-purple-400 bg-purple-500/20", icon: CheckCircle },
};

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, store_products(title, image_url), stores(name)")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">Meus Pedidos</h1>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Carregando...</div>
        ) : orders.length === 0 ? (
          <div className="gradient-card rounded-xl border border-border p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
            <Link to="/"><Button className="gradient-primary text-primary-foreground shadow-glow">Explorar Produtos</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const cfg = statusConfig[order.order_status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              return (
                <Link key={order.id} to={`/pedido/${order.id}`}>
                  <div className="gradient-card rounded-xl border border-border p-4 flex items-center gap-4 hover-lift transition-all cursor-pointer">
                    {order.store_products?.image_url && (
                      <img src={order.store_products.image_url} alt={order.store_products.title} className="w-16 h-16 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{order.store_products?.title || "Produto"}</p>
                      <p className="text-sm text-muted-foreground">{order.stores?.name} · {new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="font-display font-bold text-primary">R$ {Number(order.total_price).toFixed(2)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${cfg.color}`}>
                        <StatusIcon className="h-3 w-3" /> {cfg.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
