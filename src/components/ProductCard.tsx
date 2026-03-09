import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, typeLabels } from "@/data/mockData";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group gradient-card rounded-xl border border-border overflow-hidden hover-lift block"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount && (
          <Badge className="absolute top-3 left-3 gradient-primary text-primary-foreground border-0 font-bold">
            -{discount}%
          </Badge>
        )}
        <Badge variant="secondary" className="absolute top-3 right-3 bg-secondary/80 backdrop-blur-sm text-secondary-foreground border-0">
          {typeLabels[product.type] || product.type}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">{product.seller.avatar}</span>
          </div>
          <span className="text-xs text-muted-foreground">{product.seller.name}</span>
          <div className="flex items-center gap-1 ml-auto">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-xs text-foreground font-medium">{product.seller.rating}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-lg font-display font-bold text-primary">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
