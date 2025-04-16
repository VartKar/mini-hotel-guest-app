
import React, { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

interface TravelChatProps {
  defaultMessage?: string;
}

const TravelChat: React.FC<TravelChatProps> = ({ 
  defaultMessage = "Здравствуйте! Я виртуальный помощник по путешествиям. Чем могу помочь?" 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{
    text: string;
    isUser: boolean;
  }[]>([{
    text: defaultMessage,
    isUser: false
  }]);

  // Send message to webhook
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, {
      text: message,
      isUser: true
    }]);

    // Clear input field
    const userMessage = message;
    setMessage("");
    setIsLoading(true);
    try {
      const response = await fetch('https://innsight.app.n8n.cloud/webhook/6b9361f4-3386-4584-955a-c6f705176a12/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          userId: "guest_" + Date.now()
        })
      });
      if (response.ok) {
        const data = await response.json();
        // Add bot response to chat
        setMessages(prev => [...prev, {
          text: data.response || "Извините, я не смог получить ответ.",
          isUser: false
        }]);
      } else {
        toast("Не удалось получить ответ", {
          description: "Пожалуйста, попробуйте позже."
        });
        console.error('Failed to get response from webhook');
      }
    } catch (error) {
      toast("Ошибка соединения", {
        description: "Проверьте подключение к интернету."
      });
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
      <h2 className="text-xl font-medium mb-4">Чат с виртуальным знатоком города!</h2>
      
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
          onChange={e => setMessage(e.target.value)} 
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
  );
};

export default TravelChat;
