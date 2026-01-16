import { Heart, MessageSquare, Star, Users } from "lucide-react";

const benefits = [
  {
    icon: MessageSquare,
    text: "Инструкции вместо сообщений — гости сами находят ответы",
  },
  {
    icon: Users,
    text: "Меньше повторяющихся вопросов — больше времени на важное",
  },
  {
    icon: Star,
    text: "Выше рейтинг и отзывы — довольный гость = лучший отзыв",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Меньше рутины — лучше сервис
            </h2>
            <p className="text-lg text-muted-foreground">
              Освободите персонал от однотипных вопросов
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="bg-card rounded-xl p-6 border shadow-sm text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-foreground font-medium">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
