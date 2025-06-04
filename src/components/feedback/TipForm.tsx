
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TipFormProps {
  tipAmount: string;
  setTipAmount: (amount: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const TipForm = ({ tipAmount, setTipAmount, onSubmit, onBack }: TipFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Оставить чаевые персоналу</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
        >
          Назад к отзыву
        </Button>
      </div>
      <p className="text-sm text-hotel-neutral mb-4">
        Чаевые будут распределены между всеми сотрудниками, которые делают ваше пребывание комфортным.
      </p>
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="tipAmount" className="block mb-1 text-hotel-neutral">Сумма чаевых (₽)</label>
          <div className="flex">
            <Input
              id="tipAmount"
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              min="100"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          {[500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setTipAmount(amount.toString())}
              className={`flex-1 py-2 rounded-md border ${tipAmount === amount.toString() ? 'bg-hotel-accent border-hotel-dark text-hotel-dark' : 'border-gray-200'}`}
            >
              {amount} ₽
            </button>
          ))}
        </div>
        
        <Button type="submit" className="w-full">
          Оставить чаевые
        </Button>
      </form>
    </div>
  );
};

export default TipForm;
