
import React, { useEffect } from "react";

const ChatPage = () => {
  useEffect(() => {
    // Настройка Talk-Me виджета
    (function(){(function c(d,w,m,i) {
        window.supportAPIMethod = m;
        var s = d.createElement('script');
        s.id = 'supportScript'; 
        var id = 'cf7b0e55935033f0dc53ee586faa18f0';
        s.src = (!i ? 'https://lcab.talk-me.ru/support/support.js' : 'https://static.site-chat.me/support/support.int.js') + '?h=' + id;
        s.onerror = i ? undefined : function(){c(d,w,m,true)};
        w[m] = w[m] ? w[m] : function(){(w[m].q = w[m].q ? w[m].q : []).push(arguments);};
        (d.head ? d.head : d.body).appendChild(s);
    })(document,window,'TalkMe')})();

    // Очистка при размонтировании
    return () => {
      const script = document.getElementById('supportScript');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Очищаем глобальную переменную
      if (window.TalkMe) {
        delete window.TalkMe;
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

        {/* Контейнер для виджета Talk-Me */}
        <div 
          id="onlineSupportContainer" 
          style={{ height: '400px', width: '100%' }}
          className="border border-border rounded-lg bg-card"
        />

        <div className="text-muted-foreground mt-4">
          <p className="text-sm">Если чат не загружается, попробуйте обновить страницу</p>
        </div>
      </div>
    </div>
  );
};

// Расширяем типы для Talk-Me
declare global {
  interface Window {
    TalkMe?: {
      q?: any[];
      [key: string]: any;
    };
    supportAPIMethod?: string;
  }
}

export default ChatPage;
