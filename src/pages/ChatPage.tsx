
import React, { useState, useEffect } from "react";
import { Send, MessageCircle, User, Bot } from "lucide-react";

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState<'concierge' | 'travel'>('concierge');

  return (
    <div className="w-full max-w-md mx-auto pt-4 h-[calc(100vh-120px)] flex flex-col">
      <h1 className="text-3xl font-light mb-6">Чат с поддержкой</h1>
      
      {/* Tab Navigation */}
      <div className="flex mb-4 bg-white rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => setActiveTab('concierge')}
          className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'concierge' 
              ? 'bg-hotel-dark text-white' 
              : 'bg-white text-hotel-dark hover:bg-hotel-accent'
          }`}
        >
          <User size={18} />
          <span>Консьерж</span>
        </button>
        <button
          onClick={() => setActiveTab('travel')}
          className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'travel' 
              ? 'bg-hotel-dark text-white' 
              : 'bg-white text-hotel-dark hover:bg-hotel-accent'
          }`}
        >
          <Bot size={18} />
          <span>Эксперт по путешествиям</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        {activeTab === 'concierge' ? (
          <ConciergeChat />
        ) : (
          <TravelExpertChat />
        )}
      </div>
    </div>
  );
};

const ConciergeChat = () => {
  const openJivochat = () => {
    if (window.jivo_api) {
      window.jivo_api.open();
    } else {
      console.log('Jivochat is loading...');
    }
  };

  useEffect(() => {
    // Initialize Jivochat when component mounts
    if (window.jivo_api) {
      window.jivo_api.open();
    }
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <MessageCircle size={64} className="text-hotel-dark mb-4" />
      <h3 className="text-xl font-medium mb-2">Чат с консьержем</h3>
      <p className="text-gray-600 mb-6">
        Свяжитесь с нашим консьержем для получения помощи и информации
      </p>
      <button
        onClick={openJivochat}
        className="bg-hotel-dark text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2"
      >
        <MessageCircle size={18} />
        <span>Открыть чат</span>
      </button>
    </div>
  );
};

const TravelExpertChat = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 text-center">
        <h3 className="text-sm font-medium">AI эксперт по путешествиям</h3>
      </div>
      
      {/* Chat iframe */}
      <div className="flex-1 relative">
        <iframe
          src="https://rubikinn.ru/webhook/de012477-bbe8-44fc-8b10-4ecadf13cd66/chat"
          className="w-full h-full border-0"
          title="Виртуальный эксперт по путешествиям"
          allow="microphone; camera"
          style={{
            minHeight: '400px'
          }}
        />
        
        {/* Loading state overlay */}
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-500 pointer-events-none opacity-0 transition-opacity duration-300" id="chat-loading">
          <div className="text-center">
            <Bot size={32} className="mx-auto mb-2 text-blue-500" />
            <p className="text-sm">Загрузка чата...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extend window interface for Jivochat
declare global {
  interface Window {
    jivo_api?: {
      open: () => void;
      close: () => void;
    };
  }
}

export default ChatPage;
