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

  // Init TalkMe chat widget using official implementation
  useEffect(() => {
    (function() {
      function initTalkMe(d: Document, w: Window, m: string, i?: boolean) {
        window.supportAPIMethod = m;
        const s = d.createElement('script');
        s.id = 'supportScript';
        s.src = (!i ? 'https://lcab.talk-me.ru/support/support.js' : 'https://static.site-chat.me/support/support.int.js') + '?h=' + CHAT_ID;
        s.onerror = i ? undefined : function() { initTalkMe(d, w, m, true); };
        w[m] = w[m] ? w[m] : function() { (w[m].q = w[m].q ? w[m].q : []).push(arguments); };
        (d.head ? d.head : d.body).appendChild(s);
      }
      initTalkMe(document, window, 'TalkMe');
    })();
  }, []);

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

        <div
          id="TalkMe-container"
          style={{ height: "400px", width: "100%" }}
          className="border border-border rounded-lg bg-card"
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
    TalkMe?: any;
    supportAPIMethod?: string;
  }
}

export default ChatPage;
