import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CreditCard, QrCode, FileText, Shield, CheckCircle, Clock, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

type PaymentMethod = "pix" | "cartao" | "boleto";
type PaymentStatus = "selecting" | "pending" | "checking" | "confirmed";

const PaymentPage = () => {
  const { id } = useParams();
  const product = id === "carrinho" ? null : products.find((p) => p.id === id);
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [status, setStatus] = useState<PaymentStatus>("selecting");
  const [pixCode] = useState("00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540" + (product ? product.price.toFixed(2) : "379.80") + "5802BR5925PAYBLOX LTDA6009SAO PAULO62070503***6304ABCD");

  const totalAmount = product ? product.price * 1.05 : 379.80;

  const handlePayment = () => {
    if (method === "pix") {
      setStatus("pending");
      // Simulate PIX auto-detection
      setTimeout(() => setStatus("checking"), 3000);
      setTimeout(() => {
        setStatus("confirmed");
        toast({ title: "Pagamento confirmado!", description: "Seu pagamento via PIX foi detectado automaticamente." });
      }, 8000);
    } else {
      setStatus("pending");
      setTimeout(() => {
        setStatus("confirmed");
        toast({ title: "Pagamento confirmado!", description: `Pagamento via ${method === "cartao" ? "cartão" : "boleto"} processado.` });
      }, 3000);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({ title: "Código copiado!", description: "Cole no app do seu banco para pagar." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to={product ? `/produto/${product.id}` : "/carrinho"} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">Pagamento</h1>

        {status === "confirmed" ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Pagamento Confirmado!</h2>
            <p className="text-muted-foreground mb-8">Seu pedido foi processado com sucesso. O vendedor será notificado para realizar a entrega.</p>
            <div className="gradient-card rounded-xl border border-border p-6 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Pedido</span>
                <span className="text-foreground font-medium">#PBX{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Método</span>
                <span className="text-foreground font-medium">{method === "pix" ? "PIX" : method === "cartao" ? "Cartão" : "Boleto"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-primary font-display font-bold">R$ {totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/">
              <Button className="gradient-primary text-primary-foreground shadow-glow">Voltar ao Início</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <div className="gradient-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Método de Pagamento</h3>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: "pix" as const, label: "PIX", icon: QrCode, desc: "Aprovação instantânea" },
                    { id: "cartao" as const, label: "Cartão", icon: CreditCard, desc: "Crédito ou débito" },
                    { id: "boleto" as const, label: "Boleto", icon: FileText, desc: "Até 3 dias úteis" },
                  ]).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setMethod(m.id); setStatus("selecting"); }}
                      className={`p-4 rounded-xl border transition-all text-center ${
                        method === m.id
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
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
                  <p className="text-sm text-muted-foreground mb-4">Ao clicar em "Gerar PIX", um QR Code e código copia e cola serão gerados. O pagamento é detectado automaticamente.</p>
                  <Button onClick={handlePayment} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
                    <QrCode className="h-5 w-5 mr-2" />
                    Gerar PIX
                  </Button>
                </div>
              )}

              {method === "pix" && (status === "pending" || status === "checking") && (
                <div className="gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">QR Code PIX</h3>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-48 bg-foreground rounded-xl flex items-center justify-center p-4">
                      <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-foreground" />
                      </div>
                    </div>

                    <div className="w-full">
                      <p className="text-sm text-muted-foreground mb-2">Código Copia e Cola:</p>
                      <div className="flex gap-2">
                        <input type="text" readOnly value={pixCode.slice(0, 50) + "..."} className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-xs" />
                        <Button variant="outline" size="sm" onClick={copyPixCode} className="border-border text-foreground">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      {status === "pending" && (
                        <>
                          <Clock className="h-4 w-4 text-warning animate-pulse" />
                          <span className="text-warning">Aguardando pagamento...</span>
                        </>
                      )}
                      {status === "checking" && (
                        <>
                          <Clock className="h-4 w-4 text-info animate-spin" />
                          <span className="text-info">Verificando pagamento...</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      O pagamento é detectado automaticamente. Não feche esta página.
                    </p>
                  </div>
                </div>
              )}

              {/* Credit Card */}
              {method === "cartao" && status === "selecting" && (
                <div className="gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Dados do Cartão</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Número do Cartão</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Validade</label>
                        <input type="text" placeholder="MM/AA" className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">CVV</label>
                        <input type="text" placeholder="123" className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Nome no Cartão</label>
                      <input type="text" placeholder="Nome como está no cartão" className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <Button onClick={handlePayment} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pagar R$ {totalAmount.toFixed(2)}
                    </Button>
                  </div>
                </div>
              )}

              {/* Boleto */}
              {method === "boleto" && status === "selecting" && (
                <div className="gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Pagar com Boleto</h3>
                  <p className="text-sm text-muted-foreground mb-4">O boleto será gerado e pode levar até 3 dias úteis para ser compensado.</p>
                  <Button onClick={handlePayment} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
                    <FileText className="h-5 w-5 mr-2" />
                    Gerar Boleto
                  </Button>
                </div>
              )}

              {(method === "cartao" || method === "boleto") && status === "pending" && (
                <div className="gradient-card rounded-xl border border-border p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-foreground font-display font-semibold">Processando pagamento...</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-24 gradient-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Resumo</h3>
                {product ? (
                  <div className="flex gap-3 mb-4 pb-4 border-b border-border">
                    <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{product.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{product.seller.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4 pb-4 border-b border-border">Itens do carrinho</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {(totalAmount / 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa (5%)</span>
                    <span className="text-foreground">R$ {(totalAmount - totalAmount / 1.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-display font-semibold text-foreground">Total</span>
                    <span className="font-display font-bold text-primary text-xl">R$ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  Compra protegida com garantia
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
