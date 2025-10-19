import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BonusTransaction {
  id: string;
  amount: number;
  balance_after: number;
  note: string;
  created_by: string;
  created_at: string;
}

export const useBonusHistory = (guestId: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: ["bonus-history", guestId],
    queryFn: async () => {
      if (!guestId) return [];

      const { data, error } = await supabase
        .from("bonus_transactions")
        .select("*")
        .eq("guest_id", guestId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BonusTransaction[];
    },
    enabled: !!guestId,
  });

  const transactions = data || [];
  const totalEarned = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = transactions.length > 0 ? transactions[0].balance_after : 0;

  return {
    transactions,
    totalEarned,
    totalSpent,
    currentBalance,
    isLoading,
  };
};
