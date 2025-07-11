
import React, { useState, useEffect } from "react";
import { Send, MessageCircle, User, Bot } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pt-4 h-[calc(100vh-120px)] flex flex-col">
      <h1 className="text-3xl font-light mb-6">Чат с поддержкой</h1>
      
      {/* Only concierge chat */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
          <ConciergeChat />
        </div>
      </div>
    </div>
  );
};

const ConciergeChat = () => {
  const openWebimChat = () => {
    if (window.webim && window.webim.open) {
      window.webim.open();
    } else {
      console.log('Webim is loading...');
    }
  };

  useEffect(() => {
    // Initialize Webim script when component mounts
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://previewminihotelguestapplovableapp.webim.ru/js/button.js';
    
    // Set webim configuration
    window.webim = {
      accountName: "previewminihotelguestapplovableapp",
      domain: "previewminihotelguestapplovableapp.webim.ru",
      location: "default"
    };
    
    document.getElementsByTagName('head')[0].appendChild(script);
    
    // Cleanup function to remove script when component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
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
          onClick={openWebimChat}
          className="bg-hotel-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2 text-sm"
        >
          <MessageCircle size={16} />
          <span>Открыть чат</span>
        </button>
      </div>
    </div>
  );
};


// Extend window interface for Webim
declare global {
  interface Window {
    webim?: {
      accountName: string;
      domain: string;
      location: string;
      open?: () => void;
      close?: () => void;
    };
  }
}

export default ChatPage;
