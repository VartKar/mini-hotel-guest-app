import { Check, Zap, Smartphone, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Готов за 1 день",
    description: "Быстрый запуск без технических сложностей"
  },
  {
    icon: Smartphone,
    title: "Работает на любом телефоне",
    description: "Адаптивный дизайн для всех устройств"
  },
  {
    icon: Clock,
    title: "Обновляется за минуты",
    description: "Меняйте контент когда угодно"
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ваш персональный сайт для гостей — без усилий
          </h2>
          <p className="text-lg text-muted-foreground">
            без разработки · без поддержки · без SEO-головной боли
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
