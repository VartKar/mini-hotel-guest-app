import { useState } from "react";
import { MetricsCards } from "@/components/marketing/MetricsCards";
import { TopGuestsCard } from "@/components/marketing/TopGuestsCard";
import { LoyaltyDistributionCard } from "@/components/marketing/LoyaltyDistributionCard";
import { GuestsTable } from "@/components/marketing/GuestsTable";
import { BonusHistoryModal } from "@/components/marketing/BonusHistoryModal";
import { useAdminMarketingMetrics } from "@/hooks/useAdminMarketingMetrics";
import { useAdminGuests } from "@/hooks/useAdminGuests";

export const AdminMarketingDashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useAdminMarketingMetrics();
  const { data: guests, isLoading: guestsLoading } = useAdminGuests();
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
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Маркетинг</h2>
        <p className="text-muted-foreground">
          Статистика по всем гостям системы
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
  );
};
