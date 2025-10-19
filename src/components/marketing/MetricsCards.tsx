import { Card } from "@/components/ui/card";
import { Users, ShoppingBag, Star, DollarSign } from "lucide-react";

interface MetricsCardsProps {
  guestsCount: number;
  ordersCount: number;
  totalBonuses: number;
  revenue: number;
}

export const MetricsCards = ({
  guestsCount,
  ordersCount,
  totalBonuses,
  revenue,
}: MetricsCardsProps) => {
  const metrics = [
    {
      icon: Users,
      label: "Гостей",
      value: guestsCount,
      color: "text-primary",
    },
    {
      icon: ShoppingBag,
      label: "Заказов",
      value: ordersCount,
      color: "text-secondary",
    },
    {
      icon: Star,
      label: "Бонусов",
      value: totalBonuses.toLocaleString("ru-RU"),
      color: "text-accent",
    },
    {
      icon: DollarSign,
      label: "Доход",
      value: `${revenue.toLocaleString("ru-RU")}₽`,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`${metric.color} p-2 rounded-lg bg-muted`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
