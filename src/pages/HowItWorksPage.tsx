import { Shield, Zap, CreditCard, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { icon: "1", title: "Escolha seu produto", description: "Navegue por milhares de anúncios em diversas categorias. Use os filtros para encontrar exatamente o que precisa." },
  { icon: "2", title: "Compre com segurança", description: "Realize o pagamento via PIX, cartão de crédito ou boleto. Seu dinheiro fica protegido até a entrega ser confirmada." },
  { icon: "3", title: "Receba seu item", description: "O vendedor entrega o item digital diretamente para você. Confirme o recebimento e avalie a compra." },
  { icon: "4", title: "Suporte sempre presente", description: "Caso tenha qualquer problema, nossa equipe de suporte está disponível 24 horas para te ajudar." },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Como <span className="text-gradient">Funciona</span>?
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprar e vender itens digitais nunca foi tão fácil e seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {steps.map((step, i) => (
            <div key={i} className="gradient-card rounded-xl border border-border p-8 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <span className="font-display font-bold text-primary-foreground text-xl">{step.icon}</span>
              </div>
              <h3 className="font-display font-bold text-foreground text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">Por que escolher a Payblox?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Shield, title: "100% Seguro", desc: "Transações protegidas com garantia de reembolso." },
            { icon: Zap, title: "Entrega Rápida", desc: "Itens digitais entregues em minutos." },
            { icon: CreditCard, title: "Pagamento Flexível", desc: "PIX, cartão, boleto e mais opções." },
            { icon: MessageCircle, title: "Suporte 24/7", desc: "Atendimento humano sempre disponível." },
          ].map((feature, i) => (
            <div key={i} className="text-center p-6 gradient-card rounded-xl border border-border">
              <feature.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center gradient-card rounded-2xl border border-border p-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">Pronto para começar?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Junte-se a milhares de usuários que já compram e vendem itens digitais com segurança na Payblox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/categorias">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                Explorar Categorias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/anunciar">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                Começar a Vender
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
