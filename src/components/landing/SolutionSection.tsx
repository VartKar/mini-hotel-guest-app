import { Check, Smartphone, RotateCcw, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Под вашим брендом — никаких чужих логотипов",
  "Все контакты и правила в одном месте",
  "Услуги и предложения с онлайн-оплатой",
];

const SolutionSection = () => {
  return (
    <section id="solution" className="py-20 md:py-28 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
              <Shield className="h-4 w-4" />
              Ваш бренд. Ваши гости. Ваш доход.
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Заберите гостя
              <span className="text-primary"> себе</span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Каждый гость получает <span className="text-foreground font-semibold">персональную мобильную страницу</span> вашего отеля:
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 bg-card rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-foreground font-medium pt-1">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-3 text-foreground bg-accent/20 rounded-xl p-4">
                <Smartphone className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Всегда под рукой</p>
                  <p className="text-sm text-muted-foreground">Страница остаётся у гостя</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-foreground bg-primary/10 rounded-xl p-4">
                <RotateCcw className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Возврат напрямую</p>
                  <p className="text-sm text-muted-foreground">Без посредников и комиссий</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-3xl p-8 lg:p-12">
              <div className="bg-card rounded-2xl shadow-xl p-6 space-y-4 border-2 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-primary-foreground">R</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">Ваш бренд</p>
                    <p className="text-sm text-primary font-medium">yourhotel.rubikinn.app</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {['Wi-Fi', 'Услуги', 'Магазин', 'Экскурсии'].map((item) => (
                    <div key={item} className="bg-gradient-to-br from-muted to-muted/50 rounded-lg p-4 text-center hover:from-primary/10 hover:to-primary/5 transition-colors cursor-pointer group">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80" size="lg">
                  Забронировать снова
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Decorative */}
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
