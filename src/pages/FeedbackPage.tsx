
import React, { useState } from "react";
import { User, Mail, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRoomData } from "@/hooks/useRoomData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileTab from "@/components/feedback/ProfileTab";
import BonusesTab from "@/components/feedback/BonusesTab";
import FeedbackTab from "@/components/feedback/FeedbackTab";

const PersonalAccountPage = () => {
  const { roomData, isPersonalized, lookupByEmail, logOut, loading, error, clearError } = useRoomData();
  const [activeTab, setActiveTab] = useState("profile");
  const [email, setEmail] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

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

  // Update profile data when room data changes
  React.useEffect(() => {
    if (roomData) {
      setProfile(prev => ({
        ...prev,
        name: roomData.guest_name || prev.name,
        roomNumber: roomData.room_number || prev.roomNumber,
      }));
    }
  }, [roomData]);

  const handleEmailLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Введите email адрес");
      return;
    }

    setIsLookingUp(true);
    clearError();
    
    const success = await lookupByEmail(email);
    
    if (success) {
      toast.success("Ваши данные найдены!", {
        description: "Добро пожаловать в ваш персональный кабинет"
      });
      setEmail("");
    }
    
    setIsLookingUp(false);
  };

  const handleLogOut = () => {
    logOut();
    toast.success("Вы вышли из аккаунта", {
      description: "Отображаются демо-данные"
    });
  };

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
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium">
                  {profile.name}
                </h2>
                <p className="text-hotel-neutral">
                  Номер: {profile.roomNumber}
                </p>
                {isPersonalized && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Персонализированные данные
                  </p>
                )}
              </div>
              {isPersonalized && (
                <Button
                  onClick={handleLogOut}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-1" />
                  Выйти
                </Button>
              )}
            </div>
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

      {!isPersonalized && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="text-center mb-4">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Персонализация
            </h3>
            <p className="text-sm text-gray-600">
              Введите email для доступа к вашим данным бронирования
            </p>
          </div>

          <form onSubmit={handleEmailLookup} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Ваш email адрес"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isLookingUp}
              />
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLookingUp || !email.trim()}
            >
              {isLookingUp ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Поиск бронирования...
                </>
              ) : (
                'Найти мое бронирование'
              )}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-gray-500 text-center">
              Сейчас отображаются демо-данные. Введите свой email для персонализированной информации.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalAccountPage;
