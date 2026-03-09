import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Gift } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 gradient-surface" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[80px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">A maior plataforma de itens digitais do Brasil</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">Compre e Venda</span>
            <br />
            <span className="text-gradient">Itens Digitais</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Contas, jogos, gift cards, gold, itens digitais e muito mais.
            Compra segura com garantia de entrega.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/categorias">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-all text-lg px-8 py-6">
                Explorar Categorias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/como-funciona">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-lg px-8 py-6">
                Como Funciona?
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 justify-center p-4 rounded-xl bg-card/50 border border-border">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="font-display font-semibold text-foreground text-sm">Compra Segura</p>
                <p className="text-xs text-muted-foreground">Garantia ou dinheiro de volta</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center p-4 rounded-xl bg-card/50 border border-border">
              <Zap className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="font-display font-semibold text-foreground text-sm">Suporte 24h</p>
                <p className="text-xs text-muted-foreground">Atendimento sempre disponível</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center p-4 rounded-xl bg-card/50 border border-border">
              <Gift className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="font-display font-semibold text-foreground text-sm">Recompensas</p>
                <p className="text-xs text-muted-foreground">Ganhe bônus em cada compra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
