
import React, { useEffect } from "react";

const ChatPage = () => {
  useEffect(() => {
    // Настройка Webim
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

    document.head.appendChild(script);

    // Очистка при размонтировании
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto pt-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Свяжитесь с нами прямо сейчас
          </h2>
          
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Наши операторы готовы ответить на любые ваши вопросы о бронировании, 
            услугах мини-отеля и достопримечательностях города
          </p>
        </div>

        {/* Стандартная кнопка Webim */}
        <div id="webim-button-container">
          <a className="webim_button" href="#" rel="webim">
            <img src="https://previewminihotelguestapplovableapp.webim.ru/button.php" alt="Webim Chat Button" />
          </a>
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
