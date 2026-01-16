import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Платформа №1 для мини-отелей
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Откройте двери
              </span>
              <br />
              <span className="text-foreground">в будущее отельного бизнеса</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Всё-в-одном решение для <span className="text-foreground font-semibold">прямых бронирований</span>, <span className="text-foreground font-semibold">допродаж</span> и <span className="text-foreground font-semibold">возврата гостей</span> — без комиссий OTA
            </p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">+40% к доходу</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="font-medium">Запуск за 1 день</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25" asChild>
                <a href="#pricing">
                  Попробовать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base border-2 hover:bg-primary/5" asChild>
                <a href="/guest/demo-booking" target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-5 w-5" />
                  Смотреть демо
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
              <span>✓ Без программистов</span>
              <span>✓ Без привязки карты</span>
              <span>✓ 30 дней бесплатно</span>
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone mockup */}
              <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-foreground to-foreground/90 rounded-[3rem] p-3 shadow-2xl shadow-foreground/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-2xl z-10" />
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-start p-6 pt-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-primary-foreground">R</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Добро пожаловать!</h3>
                    <p className="text-sm text-muted-foreground text-center mb-6">Апартаменты «Горный вид»</p>
                    
                    <div className="w-full space-y-3">
                      {['Моя комната', 'Услуги', 'Магазин', 'Экскурсии'].map((item, index) => (
                        <div key={item} className="w-full h-12 bg-card rounded-xl flex items-center px-4 shadow-sm border hover:border-primary/50 transition-colors cursor-pointer">
                          <span className="text-sm font-medium text-foreground">{item}</span>
                          <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-8 bg-card rounded-xl p-3 shadow-lg border animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">+₽15,000</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-8 bg-card rounded-xl p-3 shadow-lg border">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="text-sm font-semibold">4.9 рейтинг</span>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-accent/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
