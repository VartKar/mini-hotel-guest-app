
import React from "react";
import { Button } from "@/components/ui/button";

interface ProfileData {
  name: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
}

interface ProfileTabProps {
  profile: ProfileData;
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileTab = ({ profile, onProfileChange }: ProfileTabProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-hotel-neutral mb-1">Даты проживания:</div>
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-hotel-neutral">Заезд:</div>
            <div contentEditable suppressContentEditableWarning>{profile.checkInDate}</div>
          </div>
          <div>
            <div className="text-sm text-hotel-neutral">Выезд:</div>
            <div contentEditable suppressContentEditableWarning>{profile.checkOutDate}</div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">История заказов</h3>
        <div className="space-y-2">
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">Завтрак в номер</div>
              <div className="text-sm text-hotel-neutral">16.04.2025, 8:30</div>
            </div>
            <div className="font-medium" contentEditable suppressContentEditableWarning>1200 ₽</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">Услуги прачечной</div>
              <div className="text-sm text-hotel-neutral">17.04.2025, 14:00</div>
            </div>
            <div className="font-medium" contentEditable suppressContentEditableWarning>800 ₽</div>
          </div>
        </div>
      </div>
      
      <Button className="w-full">История всех заказов</Button>
    </div>
  );
};

export default ProfileTab;
