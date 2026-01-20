import { Check, Smartphone, RotateCcw, Shield } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Под вашим брендом",
    text: "Никаких чужих логотипов"
  },
  {
    icon: Smartphone,
    title: "Всё в одном месте",
    text: "Wi-Fi, сервисы, сувениры, правила, консьерж"
  },
  {
    icon: RotateCcw,
    title: "Возврат гостей напрямую",
    text: "Без посредников и комиссий"
  },
];

const SolutionSection = () => {
  return (
    <section id="solution" className="py-12 md:py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Мини-сайт для каждого номера
          </h2>
          <p className="text-muted-foreground">
            Гость получает мобильную страницу вашего отеля — и сохраняет её навсегда
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-card rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
