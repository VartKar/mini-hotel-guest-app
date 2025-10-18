import React from "react";

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

const ProfileTab = ({ profile }: ProfileTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-3">Информация о проживании</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-hotel-neutral">Имя:</span>
            <span className="font-medium">{profile.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-hotel-neutral">Номер:</span>
            <span className="font-medium">{profile.roomNumber}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-hotel-neutral">Заезд:</span>
            <span className="font-medium">{profile.checkInDate}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-hotel-neutral">Выезд:</span>
            <span className="font-medium">{profile.checkOutDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
