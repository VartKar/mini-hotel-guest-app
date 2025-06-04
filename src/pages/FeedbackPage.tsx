import React, { useState } from "react";
import { User, Search, LogOut, Info, Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRoomData } from "@/hooks/useRoomData";
import ProfileTab from "@/components/feedback/ProfileTab";
import BonusesTab from "@/components/feedback/BonusesTab";
import FeedbackTab from "@/components/feedback/FeedbackTab";

const PersonalAccountPage = () => {
  const { roomData, lookupByEmail, clearPersonalData, isPersonalMode } = useRoomData();
  const [email, setEmail] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: roomData?.guest_name || "Иван Петров",
    roomNumber: roomData?.room_number || "305",
    checkInDate: roomData?.check_in_date || "15.04.2025",
    checkOutDate: roomData?.check_out_date || "20.04.2025",
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

  const handleEmailLookup = async () => {
    if (!email.trim()) {
      toast("Ошибка", {
        description: "Пожалуйста, введите ваш email"
      });
      return;
    }

    setIsLookingUp(true);
    const success = await lookupByEmail(email.trim());
    
    if (success) {
      toast("Успех!", {
        description: "Ваши данные найдены и загружены"
      });
      setEmail("");
    } else {
      toast("Бронирование не найдено", {
        description: "Проверьте правильность email или обратитесь на ресепшен"
      });
    }
    
    setIsLookingUp(false);
  };

  const handleLogOff = () => {
    clearPersonalData();
    toast("Выход выполнен", {
      description: "Возвращаемся к демо-данным"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailLookup();
    }
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
    <div className="w-full max-w-md mx-auto pt-4 pb-8">
      <h1 className="text-3xl font-light mb-6">Личный кабинет</h1>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
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

      {/* Authorization Block - Moved to bottom with sleeker design */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        {!isPersonalMode ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Персонализация данных</h3>
                <p className="text-sm text-gray-600">Введите email для доступа к вашему бронированию</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Ваш email адрес..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                disabled={isLookingUp}
              />
              <Button 
                onClick={handleEmailLookup}
                disabled={isLookingUp}
                className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLookingUp ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Search size={16} />
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 rounded-lg p-3">
              <Info size={14} />
              <span>Для тестирования используйте: monaco2@ya.ru</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Персональный режим</h3>
                  <p className="text-sm text-gray-600">{roomData?.guest_email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogOff}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <LogOut size={14} className="mr-2" />
                Выйти
              </Button>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-700">
                Отображаются ваши персональные данные бронирования
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAccountPage;
