import React, { useEffect } from "react";
import { useRoomData } from "@/hooks/useRoomData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const CHAT_ID = "cf7b0e55935033f0dc53ee586faa18f0";

const ChatPage: React.FC = () => {
  // SEO: dynamic title
  useDocumentTitle("Чат поддержки — Rubik Inn");

  const { roomData, loading } = useRoomData();

  // SEO: meta description + canonical
  useEffect(() => {
    const ensureMetaDescription = () => {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute(
        "content",
        "Онлайн чат поддержки Rubik Inn: быстрые ответы по бронированию и услугам мини-отеля."
      );
    };

    const ensureCanonical = () => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", `${window.location.origin}/chat`);
    };

    ensureMetaDescription();
    ensureCanonical();
  }, []);

  // Init TalkMe and pass user data when available
  useEffect(() => {
    if (loading) {
      console.log("[TalkMe] Waiting for room data to load...");
      return;
    }

    const name =
      roomData?.guest_name?.trim() ||
      localStorage.getItem("guestName") ||
      "Гость отеля";

    const email =
      roomData?.guest_email?.trim() ||
      localStorage.getItem("guestEmail") ||
      "guest@example.com";

    console.log("[TalkMe] Initializing with user data:", { name, email });

    // METHOD 1: Set global variable before script loads
    (window as any).talkMeUserData = { name, email };

    // METHOD 2: Load script with URL parameters
    const script = document.createElement("script");
    script.id = "supportScript";
    script.src = `https://lcab.talk-me.ru/support/support.js?h=${CHAT_ID}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    document.head.appendChild(script);

    // METHOD 3: Try API calls
    const tryApiMethods = () => {
      try {
        if (typeof window.TalkMe === "function") {
          window.TalkMe("setUserData", { name, email });
          console.log("[TalkMe] API: setUserData called");
        }
        if ((window as any).TalkMeWidget) {
          (window as any).TalkMeWidget.setUser({ name, email });
          console.log("[TalkMe] API: TalkMeWidget.setUser called");
        }
      } catch (error) {
        console.error("[TalkMe] API error:", error);
      }
    };

    // METHOD 4: Direct form field manipulation
    const fillFormFields = () => {
      try {
        const container = document.getElementById("onlineSupportContainer");
        if (!container) return false;

        // Try to find and fill form fields in the container
        const inputs = container.querySelectorAll('input[type="text"], input[type="email"], input[name*="name"], input[name*="email"]');
        inputs.forEach((input: any) => {
          const inputEl = input as HTMLInputElement;
          const fieldName = inputEl.name?.toLowerCase() || inputEl.placeholder?.toLowerCase() || '';
          
          if (fieldName.includes('name') || fieldName.includes('имя')) {
            inputEl.value = name;
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("[TalkMe] Filled name field:", inputEl.name || inputEl.placeholder);
          } else if (fieldName.includes('email') || fieldName.includes('почта')) {
            inputEl.value = email;
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("[TalkMe] Filled email field:", inputEl.name || inputEl.placeholder);
          }
        });

        return inputs.length > 0;
      } catch (error) {
        console.error("[TalkMe] Form fill error:", error);
        return false;
      }
    };

    // Poll for widget availability and try all methods
    let attempts = 0;
    const poll = setInterval(() => {
      attempts++;
      
      tryApiMethods();
      const foundFields = fillFormFields();
      
      if (foundFields) {
        console.log("[TalkMe] Fields found and filled on attempt", attempts);
      }
      
      if (attempts >= 25) {
        console.log("[TalkMe] Stopping after 25 attempts");
        clearInterval(poll);
      }
    }, 500);

    return () => {
      clearInterval(poll);
      script.remove();
      delete (window as any).TalkMe;
      delete (window as any).talkMeUserData;
    };
  }, [loading, roomData?.guest_name, roomData?.guest_email]);

  if (loading) {
    return (
      <main className="w-full max-w-4xl mx-auto pt-8 h-[calc(100vh-120px)] flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-4xl mx-auto pt-8 h-[calc(100vh-120px)] flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <header className="mb-8 max-w-2xl">
          <h1 className="text-2xl font-semibold mb-4 text-foreground">
            Свяжитесь с нами прямо сейчас
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Наши операторы готовы ответить на любые ваши вопросы о бронировании,
            услугах мини-отеля и достопримечательностях города
          </p>
        </header>

        <article
          id="onlineSupportContainer"
          style={{ height: "400px", width: "100%" }}
          className="border border-border rounded-lg bg-card"
          aria-label="Онлайн чат поддержки Rubik Inn"
        />

        <aside className="text-muted-foreground mt-4">
          <p className="text-sm">
            Если чат не загружается, попробуйте обновить страницу
          </p>
        </aside>
      </section>
    </main>
  );
};

// TypeScript declaration for TalkMe on window
declare global {
  interface Window {
    TalkMe?: (action: string, data?: any) => void;
  }
}

export default ChatPage;
