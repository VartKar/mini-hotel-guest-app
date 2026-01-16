import { Banknote, ShoppingBag, Users } from "lucide-react";

const revenueStreams = [
  {
    icon: Banknote,
    title: "Прямые и повторные бронирования",
    description: "Без комиссий агрегаторов — весь доход остаётся вам",
  },
  {
    icon: ShoppingBag,
    title: "Кросс-селл и апселл услуг",
    description: "Трансфер, поздний выезд, экскурсии, товары в магазине",
  },
  {
    icon: Users,
    title: "Партнёрская программа для хостов",
    description: "Рекомендуйте сервис коллегам и получайте доход",
  },
];

const RevenueSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Один сервис — три источника дохода
          </h2>
          <p className="text-lg text-muted-foreground">
            Увеличивайте прибыль с каждого гостя
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {revenueStreams.map((stream, index) => {
            const Icon = stream.icon;
            return (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-card rounded-2xl p-8 border shadow-sm h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {stream.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {stream.description}
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

export default RevenueSection;
