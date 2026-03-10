import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CreditCard, QrCode, FileText, Shield, CheckCircle, Clock, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type PaymentMethod = "pix" | "cartao" | "boleto";
type PaymentStatus = "selecting" | "pending" | "checking" | "confirmed" | "failed";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [status, setStatus] = useState<PaymentStatus>("selecting");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState("");
  const [pixQrBase64, setPixQrBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const FEE_RATE = 0.05;

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!id) return;

    const fetchProduct = async () => {
      const { data } = await supabase.from("store_products").select("*, stores(id, user_id, name, pix_key)").eq("id", id).single();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();

    return () => { if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); };
  }, [id, user]);

  if (!user) return null;

  const subtotal = product ? Number(product.price) : 0;
  const fee = subtotal * FEE_RATE;
  const totalAmount = subtotal + fee;

  const startPayment = async () => {
    if (!product) return;
    setStatus("pending");

    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          product_id: product.id,
          amount: totalAmount,
          description: product.title,
          buyer_email: user.email,
        },
      });

      if (error) throw error;

      setPaymentId(data.payment_id);
      setPixCode(data.qr_code || "");
      setPixQrBase64(data.qr_code_base64 || null);

      // Create order record
      const { error: orderError } = await supabase.from("orders").insert({
        buyer_id: user.id,
        seller_id: product.stores.user_id,
        product_id: product.id,
        store_id: product.stores.id,
        unit_price: product.price,
        total_price: totalAmount,
        platform_fee: fee,
        payment_method: method,
        payment_id: data.payment_id,
        payment_status: "pending",
        order_status: "pending",
      });

      if (orderError) console.error("Order creation error:", orderError);

      // Start polling for payment status
      pollIntervalRef.current = setInterval(async () => {
        try {
          const { data: checkData } = await supabase.functions.invoke("check-payment", {
            body: { payment_id: data.payment_id },
          });

          if (checkData?.status === "approved") {
            clearInterval(pollIntervalRef.current!);
            pollIntervalRef.current = null;
            setStatus("confirmed");

            // Update order
            await supabase.from("orders")
              .update({ payment_status: "paid", order_status: "paid" })
              .eq("payment_id", data.payment_id);

            toast({ title: "Pagamento confirmado!", description: "Seu pagamento foi detectado automaticamente." });
          } else {
            setStatus("checking");
          }
        } catch (err) {
          console.error("Poll error:", err);
        }
      }, 5000);

    } catch (err: any) {
      setStatus("failed");
      toast({ title: "Erro no pagamento", description: err.message, variant: "destructive" });
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({ title: "Código copiado!", description: "Cole no app do seu banco para pagar." });
  };

  if (loading) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Carregando...</div><Footer /></div>
  );

  if (!product) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-display font-bold text-foreground">Produto não encontrado</h1></div><Footer /></div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to={`/produto/${product.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">Pagamento</h1>

        {status === "confirmed" ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Pagamento Confirmado!</h2>
            <p className="text-muted-foreground mb-8">Seu pedido foi processado. O vendedor será notificado.</p>
            <div className="gradient-card rounded-xl border border-border p-6 mb-6 text-left">
              <div className="flex justify-between mb-2"><span className="text-muted-foreground">Produto</span><span className="text-foreground font-medium truncate ml-4">{product.title}</span></div>
              <div className="flex justify-between mb-2"><span className="text-muted-foreground">Método</span><span className="text-foreground font-medium">{method === "pix" ? "PIX" : method === "cartao" ? "Cartão" : "Boleto"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="text-primary font-display font-bold">R$ {totalAmount.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link to="/meus-pedidos"><Button variant="outline" className="border-border text-foreground">Meus Pedidos</Button></Link>
              <Link to="/"><Button className="gradient-primary text-primary-foreground shadow-glow">Voltar ao Início</Button></Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Method Selection */}
              <div className="gradient-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Método de Pagamento</h3>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: "pix" as const, label: "PIX", icon: QrCode, desc: "Aprovação instantânea" },
                    { id: "cartao" as const, label: "Cartão", icon: CreditCard, desc: "Crédito ou débito" },
                    { id: "boleto" as const, label: "Boleto", icon: FileText, desc: "Até 3 dias úteis" },
                  ]).map((m) => (
                    <button key={m.id} onClick={() => { setMethod(m.id); setStatus("selecting"); }}
                      className={`p-4 rounded-xl border transition-all text-center ${method === m.id ? "border-primary bg-primary/10 shadow-glow" : "border-border hover:border-primary/50"}`}>
                      <m.icon className={`h-6 w-6 mx-auto mb-2 ${method === m.id ? "text-primary" : "text-muted-foreground"}`} />
                      <p className={`text-sm font-medium ${method === m.id ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* PIX Payment */}
              {method === "pix" && status === "selecting" && (
                <div className="gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Pagar com PIX</h3>
                  <p className="text-sm text-muted-foreground mb-4">O QR Code será gerado e o pagamento é detectado automaticamente.</p>
                  <Button onClick={startPayment} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
                    <QrCode className="h-5 w-5 mr-2" /> Gerar PIX
                  </Button>
                </div>
              )}

              {method === "pix" && (status === "pending" || status === "checking") && (
                <div className="gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">QR Code PIX</h3>
                  <div className="flex flex-col items-center gap-4">
                    {pixQrBase64 ? (
                      <img src={`data:image/png;base64,${pixQrBase64}`} alt="QR Code PIX" className="w-48 h-48 rounded-xl" />
                    ) : (
                      <div className="w-48 h-48 bg-foreground rounded-xl flex items-center justify-center p-4">
                        <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-foreground" />
                        </div>
                      </div>
                    )}

                    {pixCode && (
                      <div className="w-full">
                        <p className="text-sm text-muted-foreground mb-2">Código Copia e Cola:</p>
                        <div className="flex gap-2">
                          <input type="text" readOnly value={pixCode.length > 50 ? pixCode.slice(0, 50) + "..." : pixCode} className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-xs" />
                          <Button variant="outline" size="sm" onClick={copyPixCode} className="border-border text-foreground"><Copy className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      {status === "pending" && (<><Clock className="h-4 w-4 text-yellow-400 animate-pulse" /><span className="text-yellow-400">Aguardando pagamento...</span></>)}
                      {status === "checking" && (<><Clock className="h-4 w-4 text-blue-400 animate-spin" /><span className="text-blue-400">Verificando pagamento...</span></>)}
                    </div>

                    <p className="text-xs text-muted-foreground text-center">O pagamento é detectado automaticamente a cada 5 segundos. Não feche esta página.</p>
                  </div>
                </div>
              )}

              {/* Card / Boleto */}
              {method === "cartao" && status === "selecting" && (
                <div className="gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Dados do Cartão</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Número do Cartão</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-foreground mb-1.5 block">Validade</label><input type="text" placeholder="MM/AA" className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                      <div><label className="text-sm font-medium text-foreground mb-1.5 block">CVV</label><input type="text" placeholder="123" className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                    </div>
                    <Button onClick={startPayment} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
                      <CreditCard className="h-5 w-5 mr-2" /> Pagar R$ {totalAmount.toFixed(2)}
                    </Button>
                  </div>
                </div>
              )}

              {method === "boleto" && status === "selecting" && (
                <div className="gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Pagar com Boleto</h3>
                  <p className="text-sm text-muted-foreground mb-4">O boleto pode levar até 3 dias úteis para compensar.</p>
                  <Button onClick={startPayment} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
                    <FileText className="h-5 w-5 mr-2" /> Gerar Boleto
                  </Button>
                </div>
              )}

              {(status === "pending" || status === "checking") && method !== "pix" && (
                <div className="gradient-card rounded-xl border border-border p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-foreground font-display font-semibold">Processando pagamento...</p>
                </div>
              )}

              {status === "failed" && (
                <div className="gradient-card rounded-xl border border-destructive p-6 text-center">
                  <p className="text-destructive font-display font-semibold mb-4">Falha no pagamento</p>
                  <Button onClick={() => setStatus("selecting")} variant="outline" className="border-border text-foreground">Tentar Novamente</Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-24 gradient-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Resumo</h3>
                <div className="flex gap-3 mb-4 pb-4 border-b border-border">
                  {product.image_url && <img src={product.image_url} alt={product.title} className="w-16 h-16 rounded-lg object-cover" />}
                  <div>
                    <p className="text-sm font-medium text-foreground line-clamp-2">{product.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{product.stores?.name}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">R$ {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Taxa ({(FEE_RATE * 100).toFixed(0)}%)</span><span className="text-foreground">R$ {fee.toFixed(2)}</span></div>
                  <div className="border-t border-border pt-2 flex justify-between"><span className="font-display font-semibold text-foreground">Total</span><span className="font-display font-bold text-primary text-xl">R$ {totalAmount.toFixed(2)}</span></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" /> Compra protegida com garantia
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
