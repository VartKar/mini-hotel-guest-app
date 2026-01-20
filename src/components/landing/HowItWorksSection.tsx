import { QrCode, Smartphone, ShoppingCart, RotateCcw, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: QrCode,
    title: "Гость заезжает",
    description: "Сканирует QR-код или получает ссылку от вас",
    color: "bg-primary"
  },
  {
    icon: Smartphone,
    title: "Открывает сайт апартаментов",
    description: "Wi-Fi, инструкции, услуги — всё под рукой",
    color: "bg-blue-500"
  },
  {
    icon: ShoppingCart,
    title: "Заказывает услуги",
    description: "Онлайн-заказ проверенных услуг и товаров по лучшим ценам",
    color: "bg-accent"
  },
  {
    icon: RotateCcw,
    title: "Возвращается к вам",
    description: "Бронирует напрямую — без комиссий агрегаторам",
    color: "bg-green-500"
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Как это
            <span className="text-primary"> работает?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            От первого визита до повторного бронирования — за 4 простых шага
          </p>
        </div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-primary via-blue-500 via-accent to-green-500 rounded-full" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="relative text-center group"
                >
                  <div className={`relative z-10 w-24 h-24 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-[60px] -right-4 z-20">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
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
