
import React, { useState } from "react";
import { Send, MessageCircle } from "lucide-react";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Здравствуйте! Чем я могу вам помочь?", isUser: false }
  ]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    setMessages([...messages, { text: message, isUser: true }]);
    setMessage("");
    
    // Simulate response
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: "Спасибо за ваше сообщение. Наш консьерж ответит вам в ближайшее время.", isUser: false }
      ]);
    }, 1000);
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
