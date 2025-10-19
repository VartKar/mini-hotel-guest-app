import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Gift } from "lucide-react";
import { useBonusHistory } from "@/hooks/useBonusHistory";

interface BonusHistoryModalProps {
  guestId: string | null;
  guestName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BonusHistoryModal = ({
  guestId,
  guestName,
  isOpen,
  onClose,
}: BonusHistoryModalProps) => {
  const { transactions, totalEarned, totalSpent, currentBalance, isLoading } =
    useBonusHistory(guestId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            История бонусов: {guestName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Текущий баланс</p>
              <p className="text-xl font-bold text-primary">
                {currentBalance.toLocaleString("ru-RU")} бонусов
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Всего начислено</p>
              <p className="text-xl font-bold text-green-600">
                +{totalEarned.toLocaleString("ru-RU")}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Всего списано</p>
              <p className="text-xl font-bold text-red-600">
                {totalSpent.toLocaleString("ru-RU")}
              </p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Загрузка...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              История операций пуста
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Операция</TableHead>
                    <TableHead>Примечание</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Создал</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount.toLocaleString("ru-RU")}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          (→ {transaction.balance_after.toLocaleString("ru-RU")})
                        </span>
                      </TableCell>
                      <TableCell>{transaction.note}</TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString("ru-RU")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transaction.created_by}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
