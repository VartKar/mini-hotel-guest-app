import { useState } from "react";
import { MetricsCards } from "@/components/marketing/MetricsCards";
import { TopGuestsCard } from "@/components/marketing/TopGuestsCard";
import { LoyaltyDistributionCard } from "@/components/marketing/LoyaltyDistributionCard";
import { GuestsTable } from "@/components/marketing/GuestsTable";
import { BonusHistoryModal } from "@/components/marketing/BonusHistoryModal";
import { useHostMarketingMetrics } from "@/hooks/useHostMarketingMetrics";
import { useHostGuests } from "@/hooks/useHostGuests";
import { Card } from "@/components/ui/card";

interface HostMarketingDashboardProps {
  hostEmail: string;
}

export const HostMarketingDashboard = ({ hostEmail }: HostMarketingDashboardProps) => {
  const { data: metrics, isLoading: metricsLoading } = useHostMarketingMetrics(hostEmail);
  const { data: guests, isLoading: guestsLoading } = useHostGuests(hostEmail);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedGuestName, setSelectedGuestName] = useState("");

  const handleViewHistory = (guestId: string) => {
    const guest = guests?.find((g) => g.id === guestId);
    if (guest) {
      setSelectedGuestId(guestId);
      setSelectedGuestName(guest.name);
    }
  };

  if (metricsLoading || guestsLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Мои гости и статистика</h2>
          <p className="text-muted-foreground">
            Аналитика по гостям ваших объектов
          </p>
        </div>

        <MetricsCards
          guestsCount={metrics?.guestsCount || 0}
          ordersCount={metrics?.ordersCount || 0}
          totalBonuses={metrics?.totalBonuses || 0}
          revenue={metrics?.revenue || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopGuestsCard guests={metrics?.topGuests || []} />
          <LoyaltyDistributionCard distribution={metrics?.distribution || {}} />
        </div>

        <GuestsTable guests={guests || []} onViewHistory={handleViewHistory} />

        <BonusHistoryModal
          guestId={selectedGuestId}
          guestName={selectedGuestName}
          isOpen={!!selectedGuestId}
          onClose={() => setSelectedGuestId(null)}
        />
      </div>
    </Card>
  );
};
