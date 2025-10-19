import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBonusManagement } from "@/hooks/useBonusManagement";
import { supabase } from "@/integrations/supabase/client";

interface BonusManagementDialogProps {
  guestId: string | null;
  guestName: string;
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
}

export const BonusManagementDialog = ({
  guestId,
  guestName,
  isOpen,
  onClose,
  adminEmail,
}: BonusManagementDialogProps) => {
  const [operationType, setOperationType] = useState<"add" | "deduct">("add");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const { bonusOperation } = useBonusManagement();

  useEffect(() => {
    const fetchCurrentBalance = async () => {
      if (!guestId) return;

      const { data } = await supabase
        .from("guests")
        .select("loyalty_points")
        .eq("id", guestId)
        .single();

      if (data) {
        setCurrentBalance(data.loyalty_points || 0);
      }
    };

    if (isOpen && guestId) {
      fetchCurrentBalance();
    }
  }, [guestId, isOpen]);

  const handleSubmit = () => {
    const amountNum = parseInt(amount);

    if (!amount || amountNum <= 0) {
      return;
    }

    if (!note.trim()) {
      return;
    }

    if (!guestId) return;

    bonusOperation.mutate(
      {
        guestId,
        amount: amountNum,
        note: note.trim(),
        createdBy: adminEmail,
        isDeduction: operationType === "deduct",
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    setOperationType("add");
    setAmount("");
    setNote("");
    onClose();
  };

  const newBalance =
    operationType === "add"
      ? currentBalance + (parseInt(amount) || 0)
      : currentBalance - (parseInt(amount) || 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Управление бонусами</DialogTitle>
          <DialogDescription>
            Начисление или списание бонусов для {guestName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Текущий баланс: {currentBalance} бонусов</Label>
          </div>

          <div className="space-y-2">
            <Label>Тип операции</Label>
            <RadioGroup
              value={operationType}
              onValueChange={(value) => setOperationType(value as "add" | "deduct")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add" className="cursor-pointer">
                  Начислить
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deduct" id="deduct" />
                <Label htmlFor="deduct" className="cursor-pointer">
                  Списать
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Сумма бонусов</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </div>

          {amount && parseInt(amount) > 0 && (
            <div className="space-y-2">
              <Label>
                Новый баланс: {newBalance} бонусов
                {operationType === "deduct" && newBalance < 0 && (
                  <span className="text-destructive ml-2">
                    (Недостаточно бонусов!)
                  </span>
                )}
              </Label>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Примечание *</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Укажите причину операции"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !amount ||
              parseInt(amount) <= 0 ||
              !note.trim() ||
              bonusOperation.isPending ||
              (operationType === "deduct" && newBalance < 0)
            }
          >
            {bonusOperation.isPending ? "Обработка..." : "Применить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
