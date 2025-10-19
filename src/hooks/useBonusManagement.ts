import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BonusOperationParams {
  guestId: string;
  amount: number;
  note: string;
  createdBy: string;
  isDeduction?: boolean;
}

export const useBonusManagement = () => {
  const queryClient = useQueryClient();

  const bonusOperation = useMutation({
    mutationFn: async ({ guestId, amount, note, createdBy, isDeduction }: BonusOperationParams) => {
      // 1. Get current balance
      const { data: guest, error: guestError } = await supabase
        .from("guests")
        .select("loyalty_points, name")
        .eq("id", guestId)
        .single();

      if (guestError) throw guestError;
      if (!guest) throw new Error("Guest not found");

      const currentBalance = guest.loyalty_points || 0;
      const finalAmount = isDeduction ? -amount : amount;
      const newBalance = currentBalance + finalAmount;

      // 2. Check if sufficient balance for deduction
      if (isDeduction && newBalance < 0) {
        throw new Error("Недостаточно бонусов для списания");
      }

      // 3. Update guest balance
      const { error: updateError } = await supabase
        .from("guests")
        .update({ loyalty_points: newBalance })
        .eq("id", guestId);

      if (updateError) throw updateError;

      // 4. Create bonus transaction record
      const { error: transactionError } = await supabase
        .from("bonus_transactions")
        .insert({
          guest_id: guestId,
          amount: finalAmount,
          balance_after: newBalance,
          note: `${note} (${createdBy})`,
          created_by: createdBy,
        });

      if (transactionError) throw transactionError;

      return { guestName: guest.name, newBalance, amount: finalAmount };
    },
    onSuccess: (data) => {
      toast({
        title: "Операция выполнена",
        description: `${data.amount > 0 ? "Начислено" : "Списано"} ${Math.abs(data.amount)} бонусов. Новый баланс: ${data.newBalance}`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-guests"] });
      queryClient.invalidateQueries({ queryKey: ["bonus-history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { bonusOperation };
};
