
import React, { useState } from "react";
import { User, Star, CreditCard, Award, DollarSign, Gift, ShoppingBag, Clock, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
            className={`pb-2 px-4 ${activeTab === "tips" ? "border-b-2 border-hotel-dark font-medium" : "text-hotel-neutral"}`}
            onClick={() => setActiveTab("tips")}
          >
            Чаевые
          </button>
          <button 
            className={`pb-2 px-4 ${activeTab === "feedback" ? "border-b-2 border-hotel-dark font-medium" : "text-hotel-neutral"}`}
            onClick={() => setActiveTab("feedback")}
          >
            Отзыв
          </button>
        </div>
        
        {activeTab === "profile" && (
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
        )}
        
        {activeTab === "bonuses" && (
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
        )}
        
        {activeTab === "tips" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Оставить чаевые персоналу</h3>
              <p className="text-sm text-hotel-neutral mb-4">
                Чаевые будут распределены между всеми сотрудниками, которые делают ваше пребывание комфортным.
              </p>
              
              <form onSubmit={handleTipSubmit}>
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
          </div>
        )}
        
        {activeTab === "feedback" && (
          <div className="space-y-4">
            {feedbackForm.submitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-hotel-accent mx-auto flex items-center justify-center text-hotel-dark mb-4">
                  <Star size={32} />
                </div>
                <h2 className="text-2xl font-medium mb-2">Спасибо за отзыв!</h2>
                <p className="text-hotel-neutral">
                  Мы ценим ваше мнение и используем его для улучшения нашего сервиса.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-hotel-neutral">Оценка</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={24} 
                          className={star <= feedbackForm.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-1 text-hotel-neutral">Ваш отзыв</label>
                  <Textarea
                    id="message"
                    value={feedbackForm.message}
                    onChange={handleFeedbackChange}
                    rows={4}
                    placeholder="Расскажите о вашем опыте проживания..."
                    className="w-full"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-2 px-4 bg-hotel-dark text-white rounded-lg font-medium"
                >
                  Отправить отзыв
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAccountPage;
