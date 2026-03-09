import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/mockData";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { product: products[0], quantity: 1 },
    { product: products[2], quantity: 1 },
  ]);

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.product.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
          <ShoppingCart className="inline h-7 w-7 mr-2 text-primary" />
          Carrinho
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="gradient-card rounded-xl border border-border p-4 flex gap-4">
                  <img src={item.product.image} alt={item.product.title} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/produto/${item.product.id}`} className="font-display font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{item.product.seller.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-display font-bold text-primary">R$ {item.product.price.toFixed(2)}</p>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="sticky top-24 gradient-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Resumo do Pedido</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({cartItems.length} itens)</span>
                    <span className="text-foreground">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de serviço</span>
                    <span className="text-foreground">R$ {(total * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-display font-semibold text-foreground">Total</span>
                    <span className="font-display font-bold text-primary text-xl">R$ {(total * 1.05).toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/pagamento/carrinho">
                  <Button className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5 text-lg">
                    Finalizar Compra
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Pagamento seguro via PIX, Cartão ou Boleto
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-display font-semibold text-foreground mb-2">Seu carrinho está vazio</p>
            <p className="text-muted-foreground mb-6">Explore nossos anúncios e encontre itens incríveis!</p>
            <Link to="/categorias">
              <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">Explorar Categorias</Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
