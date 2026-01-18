import { MessageSquare, Star, Coffee } from "lucide-react";

const benefits = [
  {
    icon: MessageSquare,
    title: "Меньше вопросов",
    text: "Гости сами находят ответы",
  },
  {
    icon: Coffee,
    title: "Больше времени",
    text: "Персонал фокусируется на важном",
  },
  {
    icon: Star,
    title: "Лучшие отзывы",
    text: "Довольный гость = 5 звёзд",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Меньше рутины — больше сервиса
          </h2>
          <p className="text-muted-foreground">
            Автоматизируйте ответы на частые вопросы
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
