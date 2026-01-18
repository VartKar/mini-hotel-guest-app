import { Banknote, ShoppingBag, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const revenueStreams = [{
  icon: Banknote,
  title: "Прямые бронирования",
  description: "Гости возвращаются напрямую. Ноль комиссий агрегаторам.",
  metric: "0%",
  metricLabel: "комиссии",
  gradient: "from-green-500 to-emerald-600"
}, {
  icon: ShoppingBag,
  title: "Допродажи услуг",
  description: "Трансфер, поздний выезд, экскурсии, товары — всё в одном месте.",
  metric: "+40%",
  metricLabel: "к доходу",
  gradient: "from-primary to-blue-600"
}, {
  icon: Users,
  title: "Партнёрская программа",
  description: "Рекомендуйте коллегам и получайте пассивный доход.",
  metric: "20%",
  metricLabel: "с каждого",
  gradient: "from-accent to-orange-500"
}];
const RevenueSection = () => {
  return <section className="py-20 md:py-28 bg-gradient-to-b from-background via-foreground/[0.02] to-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-green-600 font-medium text-sm mb-6">
            <TrendingUp className="h-4 w-4" />
            Три потока дохода
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Один сервис —
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"> тройная выгода</span>
          </h2>
          <p className="text-lg text-muted-foreground">Увеличивайте прибыль с каждого гостя</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {revenueStreams.map((stream, index) => {
          const Icon = stream.icon;
          return <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stream.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative bg-card rounded-2xl p-8 border-2 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stream.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="mb-4">
                    <span className={`text-4xl font-bold bg-gradient-to-r ${stream.gradient} bg-clip-text text-transparent`}>
                      {stream.metric}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">{stream.metricLabel}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {stream.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {stream.description}
                  </p>
                </div>
              </div>;
        })}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg" asChild>
            
          </Button>
        </div>
      </div>
    </section>;
};
export default RevenueSection;