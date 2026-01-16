import { Check, Smartphone, RotateCcw } from "lucide-react";

const features = [
  "под вашим брендом",
  "с контактами и правилами",
  "с услугами и предложениями",
];

const SolutionSection = () => {
  return (
    <section id="solution" className="py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Заберите гостя себе
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Каждый гость получает персональную страницу вашего отеля:
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-foreground">
                <Smartphone className="h-6 w-6 text-primary" />
                <span className="font-medium">Страница остаётся у гостя</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <RotateCcw className="h-6 w-6 text-primary" />
                <span className="font-medium">Он возвращается напрямую, без посредников</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 lg:p-12">
              <div className="bg-card rounded-2xl shadow-lg p-6 space-y-4 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">R</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Ваш бренд</p>
                    <p className="text-sm text-muted-foreground">yourhotel.rubikinn.app</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {['Wi-Fi', 'Услуги', 'Магазин', 'Экскурсии'].map((item) => (
                    <div key={item} className="bg-muted/50 rounded-lg p-3 text-center">
                      <span className="text-sm font-medium text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
