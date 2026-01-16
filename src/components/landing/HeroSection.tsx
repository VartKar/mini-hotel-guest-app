import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Гости довольны.
              <br />
              <span className="text-primary">Персонал не выгорает.</span>
              <br />
              Доход растёт.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Цифровая платформа для мини-отелей и апартаментов, которая помогает получать прямые бронирования, допродажи и повторных гостей
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <a href="#pricing">
                  Попробовать бесплатно 30 дней
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <a href="/guest/demo-booking" target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-5 w-5" />
                  Смотреть демо
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Запуск за 1 день · Без программистов · Без комиссий OTA
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone mockup */}
              <div className="relative w-[280px] h-[580px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-2xl z-10" />
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-start p-6 pt-12">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">R</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Добро пожаловать!</h3>
                    <p className="text-sm text-muted-foreground text-center mb-6">Апартаменты «Горный вид»</p>
                    
                    <div className="w-full space-y-3">
                      {['Моя комната', 'Услуги', 'Магазин', 'Экскурсии'].map((item) => (
                        <div key={item} className="w-full h-12 bg-card rounded-xl flex items-center px-4 shadow-sm border">
                          <span className="text-sm font-medium text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
