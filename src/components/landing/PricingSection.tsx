import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Gift, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Стоит меньше, чем комиссия с одной брони
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Инвестиция, которая окупается с первого месяца
          </p>

          <div className="bg-card rounded-3xl border shadow-lg p-8 md:p-12 mb-8">
            <div className="mb-8">
              <span className="text-muted-foreground text-lg">от</span>
              <span className="text-5xl md:text-6xl font-bold text-foreground mx-2">10 000</span>
              <span className="text-muted-foreground text-lg">₽ / месяц</span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Gift className="h-4 w-4 mr-2" />
                Первый месяц бесплатно
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Без привязки карты
              </Badge>
            </div>

            <Button size="lg" className="text-lg px-12 py-6 h-auto" asChild>
              <Link to="/host">
                Начать бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Есть вопросы? Напишите нам — поможем разобраться
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
