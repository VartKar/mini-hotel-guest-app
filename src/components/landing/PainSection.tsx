import { X, AlertTriangle } from "lucide-react";

const painPoints = [
  { text: "15–25% комиссии Booking и Циан", highlight: "15–25%" },
  { text: "Гость уехал — контакт потерян навсегда", highlight: "потерян" },
  { text: "Повторные бронирования — дело случая", highlight: "случая" },
  { text: "Доход только с проживания, а не с услуг", highlight: "только" },
  { text: "Персонал тонет в однотипных вопросах", highlight: "тонет" },
];

const PainSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-destructive/5 to-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Звучит знакомо?
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Эти проблемы съедают вашу прибыль каждый день
          </p>
          
          <div className="space-y-4 mb-12">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 text-lg bg-card rounded-xl p-4 border border-destructive/20 shadow-sm hover:border-destructive/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="h-5 w-5 text-destructive" />
                </div>
                <span className="text-foreground text-left">{point.text}</span>
              </div>
            ))}
          </div>

          <div className="relative p-8 md:p-12 bg-gradient-to-br from-foreground to-foreground/90 rounded-3xl shadow-xl">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground leading-tight">
              Гость — ваш.
              <br />
              <span className="text-accent">А доход?</span>
            </p>
            <p className="text-lg text-primary-foreground/70 mt-4">
              Пора это изменить.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainSection;
