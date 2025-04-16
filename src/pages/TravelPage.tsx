
import React, { useState } from "react";
import { MapPin, Calendar, Sun, Compass, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const locations = [
  {
    day: "День 1",
    title: "Исторический центр",
    description: "Посещение главных достопримечательностей исторического центра города.",
    icon: <MapPin />
  },
  {
    day: "День 2",
    title: "Морская экскурсия",
    description: "Прогулка на катере вдоль живописного побережья.",
    icon: <Compass />
  },
  {
    day: "День 3",
    title: "Горный маршрут",
    description: "Поездка в горы с посещением смотровых площадок.",
    icon: <Sun />
  }
];

const TravelPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    {text: "Здравствуйте! Я виртуальный помощник по путешествиям. Чем могу помочь?", isUser: false}
  ]);

  // Make editable states for locations
  const [editableLocations, setEditableLocations] = useState(locations);

  // Handle location content edit
  const handleLocationEdit = (index: number, field: string, value: string) => {
    setEditableLocations(prev => {
      const newLocations = [...prev];
      newLocations[index] = {
        ...newLocations[index],
        [field]: value
      };
      return newLocations;
    });
  };

  // Send message to webhook
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, {text: message, isUser: true}]);
    
    // Clear input field
    const userMessage = message;
    setMessage("");
    setIsLoading(true);
    
    try {
      const response = await fetch('https://innsight.app.n8n.cloud/webhook/6b9361f4-3386-4584-955a-c6f705176a12/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          userId: "guest_" + Date.now() 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Add bot response to chat
        setMessages(prev => [...prev, {text: data.response || "Извините, я не смог получить ответ.", isUser: false}]);
      } else {
        toast("Не удалось получить ответ", {
          description: "Пожалуйста, попробуйте позже.",
        });
        console.error('Failed to get response from webhook');
      }
    } catch (error) {
      toast("Ошибка соединения", {
        description: "Проверьте подключение к интернету.",
      });
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Путешествие</h1>
      
      <div className="w-full h-48 mb-6 rounded-lg bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center mb-4">
          <Calendar className="mr-3 text-hotel-dark" size={24} />
          <h2 className="text-xl font-medium">План поездки</h2>
        </div>
        
        <div className="space-y-6">
          {editableLocations.map((item, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                {item.icon}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <div 
                    className="text-lg font-medium p-1 rounded focus:bg-gray-50 focus:outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleLocationEdit(index, 'day', e.currentTarget.innerText)}
                  >
                    {item.day}
                  </div>
                  <span className="mx-1">:</span>
                  <div 
                    className="text-lg font-medium p-1 rounded focus:bg-gray-50 focus:outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleLocationEdit(index, 'title', e.currentTarget.innerText)}
                  >
                    {item.title}
                  </div>
                </div>
                <div 
                  className="text-hotel-neutral p-1 rounded focus:bg-gray-50 focus:outline-none"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleLocationEdit(index, 'description', e.currentTarget.innerText)}
                >
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-xl font-medium mb-4">Чат с виртуальным помощником</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 h-[300px] overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                msg.isUser 
                  ? 'ml-auto bg-hotel-accent text-hotel-dark' 
                  : 'mr-auto bg-white border border-gray-100 text-hotel-dark'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Спросите что-нибудь о вашем путешествии..."
            disabled={isLoading}
            className="flex-1"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-hotel-dark text-white p-2 rounded-lg flex items-center justify-center w-10 h-10"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-medium mb-4">Карта города</h2>
        <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
          <MapPin size={32} className="text-hotel-dark opacity-50" />
        </div>
        <p 
          className="text-sm text-hotel-neutral"
          contentEditable
          suppressContentEditableWarning
        >
          Для получения персональных рекомендаций по достопримечательностям и активностям, 
          пожалуйста, обратитесь к нашему консьержу через чат.
        </p>
      </div>
    </div>
  );
};

export default TravelPage;
