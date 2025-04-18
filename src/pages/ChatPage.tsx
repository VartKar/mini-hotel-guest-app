
import React, { useState, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Здравствуйте! Чем я могу вам помочь?", isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim() === "" || isLoading) return;
    
    const userMessage = message;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('https://innsight.app.n8n.cloud/webhook/6b9361f4-3386-4584-955a-c6f705176a12/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { text: data.response || "Извините, произошла ошибка. Попробуйте позже.", isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Извините, произошла ошибка. Попробуйте позже.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-4 h-[calc(100vh-120px)] flex flex-col">
      <h1 className="text-3xl font-light mb-6">Чат с консьержем</h1>
      
      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm mb-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.isUser
                    ? "bg-hotel-dark text-white"
                    : "bg-hotel-accent text-hotel-dark"
                }`}
              >
                {!msg.isUser && index === 0 && (
                  <div className="flex items-center mb-2">
                    <MessageCircle size={16} className="mr-2" />
                    <span className="font-medium">Консьерж</span>
                  </div>
                )}
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 bg-transparent outline-none text-hotel-dark"
        />
        <button 
          onClick={handleSendMessage}
          className="ml-2 w-10 h-10 rounded-full bg-hotel-dark flex items-center justify-center text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
