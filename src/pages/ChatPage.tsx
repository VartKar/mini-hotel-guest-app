
import React, { useState, useEffect } from "react";
import { Send, MessageCircle, User, Bot } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pt-4 h-[calc(100vh-120px)] flex flex-col">
      <h1 className="text-3xl font-light mb-6">Чат с поддержкой</h1>
      
      {/* Both chats in one view */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ConciergeChat />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <TravelExpertChat />
        </div>
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-hotel-dark text-white p-3 text-center">
        <h3 className="text-sm font-medium flex items-center justify-center space-x-2">
          <User size={18} />
          <span>Консьерж</span>
        </h3>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <MessageCircle size={48} className="text-hotel-dark mb-4" />
        <h4 className="text-lg font-medium mb-2">Чат с консьержем</h4>
        <p className="text-gray-600 mb-6 text-sm">
          Свяжитесь с нашим консьержем для получения помощи и информации
        </p>
        <button
          onClick={openJivochat}
          className="bg-hotel-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2 text-sm"
        >
          <MessageCircle size={16} />
          <span>Открыть чат</span>
        </button>
      </div>
    </div>
  );
};

const TravelExpertChat = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 text-center">
        <h3 className="text-sm font-medium flex items-center justify-center space-x-2">
          <Bot size={18} />
          <span>AI эксперт по путешествиям</span>
        </h3>
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
