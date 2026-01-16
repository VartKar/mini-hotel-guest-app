import { Zap, Smartphone, Clock, Rocket } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Запуск за 1 день",
    description: "Никаких месяцев разработки — начните принимать заказы уже завтра",
    color: "from-primary to-primary/70"
  },
  {
    icon: Smartphone,
    title: "Работает везде",
    description: "Идеальный вид на любом устройстве — от iPhone до Android",
    color: "from-accent to-accent/70"
  },
  {
    icon: Clock,
    title: "Обновление за минуты",
    description: "Меняйте цены, услуги и контент без программиста",
    color: "from-primary to-accent"
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            <Zap className="h-4 w-4" />
            Простота — наша суперсила
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ваш сайт для гостей —
            <span className="text-primary"> без головной боли</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Без разработчиков • Без дизайнеров • Без SEO-специалистов
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                <div className="bg-card rounded-2xl p-8 border-2 border-transparent hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
