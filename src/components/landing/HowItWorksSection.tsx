import { QrCode, Smartphone, ShoppingCart, RotateCcw } from "lucide-react";

const steps = [
  {
    icon: QrCode,
    title: "Гость заезжает",
    description: "Получает QR-код или ссылку на персональную страницу",
  },
  {
    icon: Smartphone,
    title: "Пользуется сервисом",
    description: "Wi-Fi, инструкции, услуги — всё в одном месте",
  },
  {
    icon: ShoppingCart,
    title: "Покупает услуги",
    description: "Заказывает трансфер, экскурсии, товары из магазина",
  },
  {
    icon: RotateCcw,
    title: "Возвращается напрямую",
    description: "Сохраняет страницу и бронирует без посредников",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Как это работает
          </h2>
          <p className="text-lg text-muted-foreground">
            Простой путь от первого визита до повторного бронирования
          </p>
        </div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-border" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="relative text-center"
                >
                  <div className="relative z-10 w-20 h-20 bg-card border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="h-8 w-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
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

export default HowItWorksSection;
