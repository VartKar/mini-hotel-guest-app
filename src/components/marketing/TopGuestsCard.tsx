import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface Guest {
  id: string;
  name: string;
  total_spent: number;
  loyalty_tier: string;
  loyalty_points: number;
}

interface TopGuestsCardProps {
  guests: Guest[];
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case "Платина":
      return "bg-purple-100 text-purple-800";
    case "Золото":
      return "bg-yellow-100 text-yellow-800";
    case "Серебро":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const TopGuestsCard = ({ guests }: TopGuestsCardProps) => {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Топ-3 гостей по покупкам</h3>
      </div>
      
      <div className="space-y-3">
        {guests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет данных</p>
        ) : (
          guests.slice(0, 3).map((guest, index) => (
            <div
              key={guest.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground">
                  {index + 1}.
                </span>
                <div>
                  <p className="font-medium">{guest.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={getTierColor(guest.loyalty_tier)}>
                      {guest.loyalty_tier}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {guest.loyalty_points.toLocaleString("ru-RU")} бонусов
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-semibold text-primary">
                {guest.total_spent.toLocaleString("ru-RU")}₽
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
