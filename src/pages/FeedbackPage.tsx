
import React, { useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";
import ProfileTab from "@/components/feedback/ProfileTab";
import BonusesTab from "@/components/feedback/BonusesTab";
import FeedbackTab from "@/components/feedback/FeedbackTab";

const PersonalAccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Иван Петров",
    roomNumber: "305",
    checkInDate: "15.04.2025",
    checkOutDate: "20.04.2025",
    bonusPoints: 1250,
    bonusLevel: "Серебряный"
  });
  
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    message: "",
    submitted: false
  });

  const [tipAmount, setTipAmount] = useState<string>("500");
  const [showTipForm, setShowTipForm] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackForm.rating === 0) {
      toast("Пожалуйста, укажите рейтинг", {
        description: "Выберите количество звезд для оценки."
      });
      return;
    }
    setFeedbackForm({...feedbackForm, submitted: true});
    toast("Спасибо за отзыв!", {
      description: "Мы ценим ваше мнение и используем его для улучшения нашего сервиса."
    });
  };

  const handleTipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast(`Чаевые в размере ${tipAmount} ₽ успешно отправлены`, {
      description: "Спасибо за вашу щедрость!"
    });
    setShowTipForm(false);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({...profile, [name]: value});
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackForm({...feedbackForm, message: e.target.value});
  };

  const handleRating = (rating: number) => {
    setFeedbackForm({...feedbackForm, rating});
    setShowTipForm(false);
  };

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Личный кабинет</h1>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
            <User size={24} />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-medium" contentEditable suppressContentEditableWarning>
              {profile.name}
            </h2>
            <p className="text-hotel-neutral">
              Номер: <span contentEditable suppressContentEditableWarning>{profile.roomNumber}</span>
            </p>
          </div>
        </div>
        
        <div className="flex mb-6 border-b">
          <button 
            className={`pb-2 px-4 ${activeTab === "profile" ? "border-b-2 border-hotel-dark font-medium" : "text-hotel-neutral"}`}
            onClick={() => setActiveTab("profile")}
          >
            Профиль
          </button>
          <button 
            className={`pb-2 px-4 ${activeTab === "bonuses" ? "border-b-2 border-hotel-dark font-medium" : "text-hotel-neutral"}`}
            onClick={() => setActiveTab("bonuses")}
          >
            Бонусы
          </button>
          <button 
            className={`pb-2 px-4 ${activeTab === "feedback" ? "border-b-2 border-hotel-dark font-medium" : "text-hotel-neutral"}`}
            onClick={() => setActiveTab("feedback")}
          >
            Отзыв
          </button>
        </div>
        
        {activeTab === "profile" && (
          <ProfileTab profile={profile} onProfileChange={handleProfileChange} />
        )}
        
        {activeTab === "bonuses" && (
          <BonusesTab profile={profile} />
        )}
        
        {activeTab === "feedback" && (
          <FeedbackTab
            feedbackForm={feedbackForm}
            showTipForm={showTipForm}
            tipAmount={tipAmount}
            setTipAmount={setTipAmount}
            onFeedbackSubmit={handleFeedbackSubmit}
            onTipSubmit={handleTipSubmit}
            onFeedbackChange={handleFeedbackChange}
            onRating={handleRating}
            setShowTipForm={setShowTipForm}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalAccountPage;
