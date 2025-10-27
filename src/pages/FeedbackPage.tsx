
import React, { useState } from "react";
import { User, Mail, LogOut, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useRoomData } from "@/hooks/useRoomData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileTab from "@/components/feedback/ProfileTab";
import BonusesTab from "@/components/feedback/BonusesTab";
import FeedbackTab from "@/components/feedback/FeedbackTab";
import { WalkInRegistrationCard } from "@/components/feedback/WalkInRegistrationCard";

const PersonalAccountPage = () => {
  const navigate = useNavigate();
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
        checkInDate: roomData.check_in_date || prev.checkInDate,
        checkOutDate: roomData.check_out_date || prev.checkOutDate,
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
        description: "Перенаправление на главную..."
      });
      setEmail("");
      // Redirect to home page after successful login
      setTimeout(() => {
        navigate("/");
      }, 500);
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
      {/* Host Link in Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-light">Личный кабинет</h1>
        <a
          href="/host"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Для владельцев
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Compact login section - PRIMARY action */}
      {!isPersonalized && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">Войти по email</p>
          <form onSubmit={handleEmailLookup} className="flex gap-2">
            <Input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isLookingUp}
            />
            <Button
              type="submit"
              size="default"
              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              disabled={isLookingUp || !email.trim()}
            >
              {isLookingUp ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Войти'
              )}
            </Button>
          </form>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>
      )}
      
      {/* Walk-in Registration Card - SECONDARY CTA */}
      {!isPersonalized && (
        <WalkInRegistrationCard
          onSuccess={() => {
            // Reload to fetch updated data
            window.location.reload();
          }}
          currentRoomId={roomData?.id || ''}
          sessionToken={roomData?.session_token || ''}
        />
      )}
      
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
        
        <div className="flex mb-6 border-b overflow-x-auto">
          <button 
            className={`pb-2 px-2 text-sm whitespace-nowrap ${activeTab === "profile" ? "border-b-2 border-hotel-dark font-medium" : "text-hotel-neutral"}`}
            onClick={() => setActiveTab("profile")}
          >
            Профиль
          </button>
          <button 
            className={`pb-2 px-2 text-sm whitespace-nowrap ${activeTab === "bonuses" ? "border-b-2 border-hotel-dark font-medium" : "text-hotel-neutral"}`}
            onClick={() => setActiveTab("bonuses")}
          >
            Бонусы
          </button>
          <button 
            className={`pb-2 px-2 text-sm whitespace-nowrap ${activeTab === "feedback" ? "border-b-2 border-hotel-dark font-medium" : "text-hotel-neutral"}`}
            onClick={() => setActiveTab("feedback")}
          >
            Отзывы
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
