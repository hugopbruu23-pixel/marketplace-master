import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Shield, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, typeLabels } from "@/data/mockData";

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const related = products.filter((p) => p.id !== id && p.categorySlug === product?.categorySlug).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Produto não encontrado</h1>
          <Link to="/"><Button>Voltar ao Início</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
          <span>/</span>
          <Link to={`/categoria/${product.categorySlug}`} className="hover:text-foreground transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl mb-6">
              <img src={product.image} alt={product.title} className="w-full aspect-video object-cover" />
              {discount && (
                <Badge className="absolute top-4 left-4 gradient-primary text-primary-foreground border-0 text-lg px-4 py-1">
                  -{discount}%
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">{product.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{typeLabels[product.type]}</Badge>
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-border text-muted-foreground">{tag}</Badge>
              ))}
            </div>

            <div className="gradient-card rounded-xl border border-border p-6 mb-6">
              <h3 className="font-display font-semibold text-foreground mb-3">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="gradient-card rounded-xl border border-border p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Vendedor</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
                  <span className="font-bold text-primary-foreground">{product.seller.avatar}</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{product.seller.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm text-foreground font-medium">{product.seller.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">• {product.seller.sales} vendas</span>
                  </div>
                </div>
                <Button variant="outline" className="ml-auto border-border text-foreground hover:bg-secondary">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 gradient-card rounded-xl border border-border p-6">
              <div className="mb-6">
                {product.originalPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </p>
                )}
                <p className="text-3xl font-display font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </p>
                {discount && (
                  <p className="text-sm text-success mt-1">Você economiza R$ {(product.originalPrice! - product.price).toFixed(2)}</p>
                )}
              </div>

              <Link to={`/pagamento/${product.id}`}>
                <Button className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity text-lg py-6 mb-3">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Comprar Agora
                </Button>
              </Link>

              <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary mb-6">
                Adicionar ao Carrinho
              </Button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Compra Protegida</p>
                    <p className="text-xs text-muted-foreground">Garantia de entrega ou reembolso</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Entrega Rápida</p>
                    <p className="text-xs text-muted-foreground">Geralmente em até 30 minutos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Anúncios Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
