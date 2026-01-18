import { X, AlertTriangle } from "lucide-react";
const painPoints = [{
  text: "15–25% комиссии Booking и Циан"
}, {
  text: "Гость уехал — контакт потерян"
}, {
  text: "Повторные бронирования — дело случая"
}, {
  text: "Доход только с проживания"
}];
const PainSection = () => {
  return <section className="py-12 md:py-16 bg-gradient-to-b from-destructive/5 to-background">
      <div className="container max-w-4xl mx-auto px-4">
        
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {painPoints.map((point, index) => <div key={index} className="flex items-center gap-2 text-sm bg-card rounded-lg p-3 border border-destructive/20 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <X className="h-3.5 w-3.5 text-destructive" />
              </div>
              <span className="text-foreground text-left leading-tight">{point.text}</span>
            </div>)}
        </div>

        <div className="relative p-6 md:p-8 bg-gradient-to-br from-foreground to-foreground/90 rounded-2xl shadow-xl text-center">
          <p className="text-xl md:text-2xl font-bold text-primary-foreground leading-tight">
            Гость — ваш. <span className="text-accent">А доход?</span>
          </p>
          <p className="text-sm text-primary-foreground/70 mt-2">
            Пора это изменить.
          </p>
        </div>
      </div>
    </section>;
};
export default PainSection;