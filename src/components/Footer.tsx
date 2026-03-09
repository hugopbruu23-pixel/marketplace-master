import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">P</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Pay<span className="text-gradient">blox</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A maior plataforma de compra e venda de itens digitais do Brasil.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li><Link to="/categorias" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Categorias</Link></li>
              <li><Link to="/como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como Funciona</Link></li>
              <li><Link to="/anunciar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Anunciar</Link></li>
              <li><Link to="/buscar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Buscar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><Link to="/como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Comunidade</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discord</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter/X</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Payblox. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Pagamentos seguros via PIX, Cartão e Boleto</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
