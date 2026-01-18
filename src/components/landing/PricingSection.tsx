import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Gift, CreditCard, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
const features = ["Персональные страницы для гостей", "Онлайн-заказ услуг и товаров", "QR-коды для каждой комнаты", "Панель управления для хоста", "Аналитика и статистика", "Техподдержка 24/7"];
const PricingSection = () => {
  return <section id="pricing" className="py-20 md:py-28 bg-gradient-to-b from-muted/30 via-primary/5 to-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Дешевле, чем
            <span className="text-primary"> одна комиссия </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Инвестиция, которая окупается с первого же прямого бронирования
          </p>

          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl" />
            
            <div className="relative bg-card rounded-3xl border-2 border-primary/20 shadow-2xl p-8 md:p-12">
              <div className="mb-8">
                <span className="text-muted-foreground text-lg">от</span>
                <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mx-3">800</span>
                <span className="text-muted-foreground text-lg">₽ / месяц</span>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge className="px-5 py-2.5 text-base bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
                  <Gift className="h-5 w-5 mr-2" />
                  Первый месяц бесплатно
                </Badge>
                
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left max-w-md mx-auto">
                {features.map((feature, index) => <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>)}
              </div>

              <Button size="lg" className="text-lg px-12 py-7 h-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25" asChild>
                <Link to="/host">
                  Начать бесплатно
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              
              <p className="text-sm text-muted-foreground mt-6">Настройка за день • Отмена в любой момент</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-8">Есть вопросы? Напишите нам<a href="mailto:hello@rubikinn.app" className="text-primary hover:underline font-medium">Напишите нам</a> — ответим за 5 минут
          </p>
        </div>
      </div>
    </section>;
};
export default PricingSection;