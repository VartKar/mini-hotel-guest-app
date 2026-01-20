import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const HeroSection = () => {
  return <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Платформа №1 для апартаментов и мини-отелей
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              <span className="text-foreground">Гости довольны.</span>
              <br />
              <span className="text-foreground">Вы спокойны.</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Доход растёт.</span>
            </h1>
            
            <p className="text-lg md:text-xl font-semibold text-primary">
              Сервис 5 звёзд — для отелей любого размера
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-lg">
              Всё-в-одном решение для <span className="text-foreground font-semibold">прямых бронирований</span>, <span className="text-foreground font-semibold">допродаж</span> и <span className="text-foreground font-semibold">возврата гостей</span>
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">+40% к доходу</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-accent-foreground" />
                </div>
                <span className="font-medium">Запуск за 1 день</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="default" className="text-sm px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25" asChild>
                <a href="#pricing">
                  Попробовать бесплатно
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
              <span>✓ Без программистов</span>
              
              <span>✓ 30 дней бесплатно</span>
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone mockup with real screenshot */}
              <div className="relative w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-gradient-to-b from-foreground to-foreground/90 rounded-[2.5rem] md:rounded-[3rem] p-2.5 md:p-3 shadow-2xl shadow-foreground/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-5 md:h-6 bg-foreground rounded-b-2xl z-10" />
                <div className="w-full h-full bg-background rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
                  <img src="/images/landing/app-screenshot.png" alt="ChillStay App" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-2 -right-4 md:-top-4 md:-right-8 bg-card rounded-xl p-2.5 md:p-3 shadow-lg border animate-pulse">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-green-600">+₽15,000</span>
                </div>
              </div>
              
              
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-12 w-24 md:w-32 h-24 md:h-32 bg-primary/20 rounded-full blur-2xl" />
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;