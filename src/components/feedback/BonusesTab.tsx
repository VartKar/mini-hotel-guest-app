import React from "react";
import { Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBonusHistory } from "@/hooks/useBonusHistory";
import { format } from "date-fns";

interface BonusesTabProps {
  guestId: string | null;
}

const BonusesTab = ({ guestId }: BonusesTabProps) => {
  const { transactions, totalEarned, totalSpent, currentBalance, isLoading } = useBonusHistory(guestId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!guestId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Войдите по email, чтобы увидеть бонусы</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Бонусный счет:</div>
          <div className="text-xl font-bold text-hotel-dark">
            {currentBalance} баллов
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div>
            <span className="text-muted-foreground">Заработано:</span>
            <div className="font-medium text-green-600">+{totalEarned}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Потрачено:</span>
            <div className="font-medium text-red-600">{totalSpent}</div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Как использовать бонусы</h3>
        <div className="space-y-2 text-sm text-hotel-neutral">
          <p>• 1 бонус = 1 рубль при оплате услуг</p>
          <p>• Бонусами можно оплатить до 50% стоимости</p>
          <p>• Начисляется 1% от суммы заказа</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">История транзакций</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Пока нет транзакций
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{transaction.note}</div>
                  <div className="text-xs text-hotel-neutral">
                    {format(new Date(transaction.created_at), "dd.MM.yyyy HH:mm")}
                  </div>
                </div>
                <div className={`font-medium text-sm ml-2 ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} б.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button className="w-full">Условия программы лояльности</Button>
    </div>
  );
};

export default BonusesTab;
