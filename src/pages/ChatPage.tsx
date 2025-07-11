
import React, { useEffect } from "react";
import { MessageCircle, User, Clock, Star } from "lucide-react";

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
      console.log('Webim скрипт успешно загружен');
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
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 text-center">
        <h3 className="text-xl font-medium flex items-center justify-center gap-3 mb-2">
          <User size={24} />
          <span>Консьерж отеля</span>
        </h3>
        <p className="text-red-100 text-sm">Мы всегда готовы помочь!</p>
      </div>
      
      {/* Контент */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-50 to-white">
        {/* Иконка и основной текст */}
        <div className="mb-8">
          <div className="mb-6 relative">
            <MessageCircle size={80} className="text-red-600 mx-auto mb-4" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <h4 className="text-3xl font-bold mb-4 text-gray-800">
            Свяжитесь с нами прямо сейчас
          </h4>
          
          <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl">
            Наши операторы готовы ответить на любые ваши вопросы о бронировании, 
            услугах мини-отеля и достопримечательностях города
          </p>
        </div>

        {/* Преимущества чата */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Clock className="text-red-600 mb-3 mx-auto" size={32} />
            <h5 className="font-semibold text-gray-800 mb-2">Быстрый ответ</h5>
            <p className="text-gray-600 text-sm">Среднее время ответа: 2-3 минуты</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <User className="text-red-600 mb-3 mx-auto" size={32} />
            <h5 className="font-semibold text-gray-800 mb-2">Личный подход</h5>
            <p className="text-gray-600 text-sm">Индивидуальные рекомендации для каждого гостя</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Star className="text-red-600 mb-3 mx-auto" size={32} />
            <h5 className="font-semibold text-gray-800 mb-2">Высокое качество</h5>
            <p className="text-gray-600 text-sm">Профессиональная помощь 24/7</p>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-2xl">
          <h5 className="text-xl font-semibold text-red-800 mb-3">
            Кнопка чата появится в правом нижнем углу
          </h5>
          <p className="text-red-700 mb-4">
            Ищите красную кнопку чата в правом нижнем углу экрана. 
            Нажмите на неё, чтобы начать общение с нашими операторами.
          </p>
          <div className="flex items-center justify-center gap-2 text-red-600">
            <span className="text-2xl">👉</span>
            <span className="font-medium">Кнопка чата находится там</span>
            <span className="text-2xl">👇</span>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Если кнопка не появилась, попробуйте обновить страницу
          </p>
          <p className="text-gray-400 text-xs">
            Мы работаем над улучшением сервиса для вашего комфорта
          </p>
        </div>
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
      [key: string]: any;
    };
  }
}

export default ChatPage;
