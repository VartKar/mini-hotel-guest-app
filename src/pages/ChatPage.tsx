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
    console.log("[TalkMe] Data sources:", {
      fromRoomData: !!roomData?.guest_name && !!roomData?.guest_email,
      fromLocalStorage: !!localStorage.getItem("guestName") || !!localStorage.getItem("guestEmail"),
      usingDefaults: !roomData?.guest_name || !roomData?.guest_email
    });

    const script = document.createElement("script");
    script.id = "supportScript";
    script.src = `https://lcab.talk-me.ru/support/support.js?h=${CHAT_ID}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    console.log("[TalkMe] Loading script with user data in URL:", script.src);
    document.head.appendChild(script);

    let applyAttempts = 0;

    const applyUser = () => {
      applyAttempts++;
      console.log(`[TalkMe] Attempt ${applyAttempts} to apply user data`);
      
      try {
        if (typeof window.TalkMe === "function") {
          console.log("[TalkMe] window.TalkMe is available, calling setUserData");
          window.TalkMe("setUserData", { name, email });
          console.log("[TalkMe] setUserData called successfully");
          return true;
        } else {
          console.log("[TalkMe] window.TalkMe is not available yet, type:", typeof window.TalkMe);
          return false;
        }
      } catch (error) {
        console.error("[TalkMe] Error calling setUserData:", error);
        setTimeout(() => applyUser(), 800);
        return false;
      }
    };

    let pollAttempts = 0;
    const poll = setInterval(() => {
      pollAttempts++;
      console.log(`[TalkMe] Polling attempt ${pollAttempts}, checking for window.TalkMe...`);
      
      if (typeof window.TalkMe === "function") {
        console.log("[TalkMe] window.TalkMe detected! Stopping poll and applying user data");
        clearInterval(poll);
        applyUser();
      }
    }, 400);

    const timeout = setTimeout(() => {
      console.log("[TalkMe] Timeout reached after 10 seconds");
      clearInterval(poll);
      console.log("[TalkMe] Final attempt to apply user data");
      const success = applyUser();
      if (!success) {
        console.warn("[TalkMe] Failed to initialize after timeout. window.TalkMe:", typeof window.TalkMe);
      }
    }, 10000);

    return () => {
      console.log("[TalkMe] Cleanup: removing script and clearing intervals");
      clearInterval(poll);
      clearTimeout(timeout);
      script.remove();
      delete (window as any).TalkMe;
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
