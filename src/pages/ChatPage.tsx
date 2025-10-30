import React, { useEffect } from "react";

const ChatPage = () => {
  useEffect(() => {
    const id = "cf7b0e55935033f0dc53ee586faa18f0";

    // Load script dynamically
    const script = document.createElement("script");
    script.id = "supportScript";
    script.src = `https://lcab.talk-me.ru/support/support.js?h=${id}`;
    document.head.appendChild(script);

    // Function to safely set user info when TalkMe is ready
    const setUserDataSafely = () => {
      if (window.TalkMe && typeof window.TalkMe === "function") {
        window.TalkMe("setUserData", {
          name: localStorage.getItem("guestName") || "Guest",
          email: localStorage.getItem("guestEmail") || "guest@example.com",
        });
      } else {
        // retry until TalkMe becomes available
        setTimeout(setUserDataSafely, 500);
      }
    };

    // Start checking for TalkMe readiness
    setUserDataSafely();

    return () => {
      script.remove();
      delete window.TalkMe;
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

        <div
          id="onlineSupportContainer"
          style={{ height: "400px", width: "100%" }}
          className="border border-border rounded-lg bg-card"
        />

        <div className="text-muted-foreground mt-4">
          <p className="text-sm">
            Если чат не загружается, попробуйте обновить страницу
          </p>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    TalkMe?: any;
  }
}

export default ChatPage;
