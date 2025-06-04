
import React from "react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BonusData {
  bonusPoints: number;
  bonusLevel: string;
}

interface BonusesTabProps {
  profile: BonusData;
}

const BonusesTab = ({ profile }: BonusesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Бонусный счет:</div>
          <div className="text-xl font-bold text-hotel-dark" contentEditable suppressContentEditableWarning>
            {profile.bonusPoints} баллов
          </div>
        </div>
        <div className="flex items-center">
          <Award className="text-hotel-dark mr-2" size={16} />
          <div className="text-sm" contentEditable suppressContentEditableWarning>
            Ваш статус: {profile.bonusLevel}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Как использовать бонусы</h3>
        <div className="space-y-2 text-sm text-hotel-neutral">
          <p>• 1 бонус = 1 рубль при оплате услуг отеля</p>
          <p>• Минимальная сумма для списания: 500 бонусов</p>
          <p>• Бонусами можно оплатить до 50% стоимости услуг</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">История начислений</h3>
        <div className="space-y-2">
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">Проживание 5 дней</div>
              <div className="text-sm text-hotel-neutral">15.04.2025</div>
            </div>
            <div className="font-medium text-green-600">+1000 баллов</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">Ужин в ресторане</div>
              <div className="text-sm text-hotel-neutral">16.04.2025</div>
            </div>
            <div className="font-medium text-green-600">+250 баллов</div>
          </div>
        </div>
      </div>
      
      <Button className="w-full">Условия программы лояльности</Button>
    </div>
  );
};

export default BonusesTab;
