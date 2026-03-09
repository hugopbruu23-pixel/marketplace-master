import { Star } from "lucide-react";
import { reviews } from "@/data/mockData";

const ReviewsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
          Avaliações Recentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className="gradient-card rounded-xl border border-border p-6 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{review.avatar}</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{review.user}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
                <div className="flex items-center gap-0.5 ml-auto">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
              <p className="text-xs text-primary">{review.product}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
