import { Heart, MessageSquare, Star, Users, Smile, Coffee } from "lucide-react";

const benefits = [
  {
    icon: MessageSquare,
    title: "Меньше вопросов",
    text: "Гости сами находят ответы — Wi-Fi, правила, инструкции",
    color: "from-primary to-blue-500"
  },
  {
    icon: Coffee,
    title: "Больше времени",
    text: "Персонал фокусируется на важном, а не на рутине",
    color: "from-accent to-orange-500"
  },
  {
    icon: Star,
    title: "Лучшие отзывы",
    text: "Довольный гость = 5 звёзд на Booking и Google",
    color: "from-green-500 to-emerald-500"
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-primary/5">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-6 shadow-xl">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Счастливый персонал =
              <span className="text-primary"> счастливые гости</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Автоматизируйте рутину — освободите время для настоящего гостеприимства
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="group bg-card rounded-2xl p-8 border-2 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-6 py-3">
              <Smile className="h-6 w-6 text-primary" />
              <span className="font-medium text-foreground">
                Результат: выше рейтинг, больше бронирований, меньше стресса
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
