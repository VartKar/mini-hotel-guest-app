import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface LoyaltyDistributionCardProps {
  distribution: Record<string, number>;
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

export const LoyaltyDistributionCard = ({
  distribution,
}: LoyaltyDistributionCardProps) => {
  const tiers = ["Стандарт", "Серебро", "Золото", "Платина"];

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Распределение по уровням лояльности</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {tiers.map((tier) => (
          <Badge
            key={tier}
            variant="outline"
            className={`${getTierColor(tier)} px-3 py-1.5`}
          >
            {tier}: {distribution[tier] || 0}
          </Badge>
        ))}
      </div>
    </Card>
  );
};
