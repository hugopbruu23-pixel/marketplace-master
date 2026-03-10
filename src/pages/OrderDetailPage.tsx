import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!id) return;
    const fetchOrder = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*, store_products(title, image_url, description), stores(name)")
        .eq("id", id)
        .single();
      setOrder(orderData);

      if (orderData) {
        const { data: disputeData } = await supabase
          .from("order_disputes")
          .select("*")
          .eq("order_id", id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        setDispute(disputeData);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id, user]);

  const handleOpenDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      toast({ title: "Erro", description: "Informe o motivo", variant: "destructive" });
      return;
    }
    if (!user || !order) return;
    setSubmitting(true);
    const { error } = await supabase.from("order_disputes").insert({
      order_id: order.id,
      opened_by: user.id,
      reason: disputeReason.trim(),
      description: disputeDescription.trim() || null,
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      await supabase.from("orders").update({ order_status: "dispute_open" }).eq("id", order.id);
      toast({ title: "Disputa aberta!", description: "Um administrador irá analisar seu caso." });
      setShowDisputeForm(false);
      // Refresh
      const { data } = await supabase.from("order_disputes").select("*").eq("order_id", order.id).order("created_at", { ascending: false }).limit(1).single();
      setDispute(data);
      setOrder({ ...order, order_status: "dispute_open" });
    }
    setSubmitting(false);
  };

  if (!user) return null;

  if (loading) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Carregando...</div><Footer /></div>
  );

  if (!order) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-display font-bold text-foreground">Pedido não encontrado</h1></div><Footer /></div>
  );

  const canDispute = ["paid", "delivered", "processing"].includes(order.order_status) && !dispute;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/meus-pedidos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar aos Pedidos
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Detalhes do Pedido</h1>

        <div className="gradient-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
            {order.store_products?.image_url && (
              <img src={order.store_products.image_url} alt={order.store_products.title} className="w-20 h-20 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <h2 className="font-display font-semibold text-foreground text-lg">{order.store_products?.title}</h2>
              <p className="text-sm text-muted-foreground">{order.stores?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Pedido</p><p className="text-foreground font-medium">#{order.id.slice(0, 8)}</p></div>
            <div><p className="text-sm text-muted-foreground">Data</p><p className="text-foreground font-medium">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p></div>
            <div><p className="text-sm text-muted-foreground">Método</p><p className="text-foreground font-medium">{order.payment_method === "pix" ? "PIX" : order.payment_method === "cartao" ? "Cartão" : "Boleto"}</p></div>
            <div><p className="text-sm text-muted-foreground">Total</p><p className="text-primary font-display font-bold">R$ {Number(order.total_price).toFixed(2)}</p></div>
            <div><p className="text-sm text-muted-foreground">Status Pagamento</p><p className={`font-medium ${order.payment_status === "paid" ? "text-green-400" : order.payment_status === "pending" ? "text-yellow-400" : "text-red-400"}`}>{order.payment_status === "paid" ? "Pago" : order.payment_status === "pending" ? "Pendente" : order.payment_status}</p></div>
            <div><p className="text-sm text-muted-foreground">Status Pedido</p><p className="text-foreground font-medium capitalize">{order.order_status.replace("_", " ")}</p></div>
          </div>

          {order.delivery_data && order.payment_status === "paid" && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-display font-semibold text-foreground mb-2">Dados de Entrega</h3>
              <div className="bg-secondary rounded-lg p-4"><p className="text-foreground text-sm whitespace-pre-wrap">{order.delivery_data}</p></div>
            </div>
          )}
        </div>

        {/* Dispute section */}
        {dispute && (
          <div className="gradient-card rounded-xl border border-border p-6 mb-6">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" /> Disputa
            </h3>
            <div className="space-y-2">
              <div><p className="text-sm text-muted-foreground">Motivo</p><p className="text-foreground">{dispute.reason}</p></div>
              {dispute.description && <div><p className="text-sm text-muted-foreground">Descrição</p><p className="text-foreground">{dispute.description}</p></div>}
              <div><p className="text-sm text-muted-foreground">Status</p><p className={`font-medium ${dispute.status === "open" ? "text-orange-400" : dispute.status === "resolved_refund" ? "text-green-400" : dispute.status === "resolved_denied" ? "text-red-400" : "text-blue-400"}`}>{dispute.status === "open" ? "Aberta" : dispute.status === "under_review" ? "Em Análise" : dispute.status === "resolved_refund" ? "Reembolsado" : dispute.status === "resolved_denied" ? "Negada" : "Fechada"}</p></div>
              {dispute.admin_notes && <div><p className="text-sm text-muted-foreground">Resposta do Admin</p><p className="text-foreground">{dispute.admin_notes}</p></div>}
            </div>
          </div>
        )}

        {canDispute && !showDisputeForm && (
          <Button onClick={() => setShowDisputeForm(true)} variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 mr-2" /> Abrir Disputa / Solicitar Reembolso
          </Button>
        )}

        {showDisputeForm && (
          <div className="gradient-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Abrir Disputa</h3>
            <form onSubmit={handleOpenDispute} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Motivo *</label>
                <select value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecionar motivo...</option>
                  <option value="Produto não entregue">Produto não entregue</option>
                  <option value="Produto diferente do anunciado">Produto diferente do anunciado</option>
                  <option value="Produto com defeito">Produto com defeito</option>
                  <option value="Vendedor não responde">Vendedor não responde</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label>
                <textarea value={disputeDescription} onChange={(e) => setDisputeDescription(e.target.value)} placeholder="Descreva o problema..." rows={3} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowDisputeForm(false)} className="text-muted-foreground">Cancelar</Button>
                <Button type="submit" disabled={submitting} className="gradient-primary text-primary-foreground shadow-glow">
                  {submitting ? "Enviando..." : "Enviar Disputa"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;
