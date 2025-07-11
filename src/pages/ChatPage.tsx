
import React, { useState, useEffect } from "react";
import { MessageCircle, User } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pt-4 h-[calc(100vh-120px)] flex flex-col">
      <h1 className="text-3xl font-light mb-6">Чат с поддержкой</h1>
      
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
          <WebimChat />
        </div>
      </div>
    </div>
  );
};

const WebimChat = () => {
  const [isWebimReady, setIsWebimReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Настройка Webim перед загрузкой скрипта
    window.webim = {
      accountName: "previewminihotelguestapplovableapp",
      domain: "previewminihotelguestapplovableapp.webim.ru",
      location: "default"
    };

    // Создаем и загружаем Webim скрипт
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://previewminihotelguestapplovableapp.webim.ru/js/button.js';
    script.async = true;

    script.onload = () => {
      setIsWebimReady(true);
      
      // Создаем скрытую кнопку Webim
      const webimButton = document.createElement('a');
      webimButton.className = 'webim_button';
      webimButton.href = '#';
      webimButton.rel = 'webim';
      webimButton.style.display = 'none';
      
      const webimImg = document.createElement('img');
      webimImg.src = 'https://previewminihotelguestapplovableapp.webim.ru/button.php';
      webimImg.border = '0';
      
      webimButton.appendChild(webimImg);
      document.body.appendChild(webimButton);
    };

    script.onerror = () => {
      console.error('Ошибка загрузки Webim скрипта');
    };

    document.head.appendChild(script);

    // Очистка при размонтировании
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const existingButton = document.querySelector('.webim_button');
      if (existingButton && existingButton.parentNode) {
        existingButton.parentNode.removeChild(existingButton);
      }
    };
  }, []);

  const handleOpenChat = async () => {
    setIsLoading(true);
    
    try {
      // Попытка открыть через API
      if (window.webim && typeof window.webim.open === 'function') {
        window.webim.open();
      } else {
        // Fallback через скрытую кнопку
        const webimButton = document.querySelector('.webim_button') as HTMLAnchorElement;
        if (webimButton) {
          webimButton.click();
        } else {
          throw new Error('Webim не готов');
        }
      }
    } catch (error) {
      console.error('Ошибка открытия чата:', error);
      alert('Не удалось открыть чат. Попробуйте еще раз через несколько секунд.');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 text-center">
        <h3 className="text-lg font-medium flex items-center justify-center gap-2">
          <User size={20} />
          <span>Консьерж</span>
        </h3>
      </div>
      
      {/* Контент */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-8">
          <MessageCircle size={64} className="text-red-600 mb-4 mx-auto" />
          <h4 className="text-2xl font-semibold mb-3 text-gray-800">Чат с консьержем</h4>
          <p className="text-gray-600 mb-2 text-base max-w-md">
            Наши операторы готовы ответить на любые ваши вопросы о бронировании, услугах мини-отеля и достопримечательностях города
          </p>
          <p className="text-sm text-gray-500">
            Среднее время ответа: 2-3 минуты
          </p>
        </div>

        {/* Кастомная кнопка */}
        <button
          onClick={handleOpenChat}
          disabled={!isWebimReady || isLoading}
          className={`
            inline-flex items-center gap-3 px-8 py-4 
            bg-gradient-to-r from-red-500 to-red-600 
            hover:from-red-600 hover:to-red-700
            text-white font-medium text-lg
            rounded-full shadow-lg hover:shadow-xl
            transform hover:-translate-y-0.5 
            transition-all duration-300 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:transform-none
            ${isLoading ? 'animate-pulse' : ''}
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Открываем чат...</span>
            </>
          ) : (
            <>
              <MessageCircle size={20} />
              <span>Открыть чат</span>
            </>
          )}
        </button>

        {!isWebimReady && (
          <p className="text-sm text-gray-500 mt-4">
            Загрузка чата...
          </p>
        )}
      </div>
    </div>
  );
};

// Расширяем типы для Webim
declare global {
  interface Window {
    webim?: {
      accountName: string;
      domain: string;
      location: string;
      open?: () => void;
      close?: () => void;
      [key: string]: any;
    };
  }
}

export default ChatPage;
