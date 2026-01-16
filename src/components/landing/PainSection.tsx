import { X } from "lucide-react";

const painPoints = [
  "15–25% комиссии Booking и Циан",
  "Гость уехал — контакт потерян",
  "Повторные бронирования случайны",
  "Доход только с проживания",
  "Персонал перегружен вопросами",
];

const PainSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Знакомо?
          </h2>
          
          <div className="space-y-4 mb-12">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-center justify-center gap-4 text-lg text-muted-foreground"
              >
                <X className="h-5 w-5 text-destructive flex-shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className="relative p-8 bg-card rounded-2xl border shadow-sm">
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              Гость ваш.
              <br />
              <span className="text-primary">Доход — не полностью ваш.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainSection;
