useEffect(() => {
  const id = "cf7b0e55935033f0dc53ee586faa18f0";

  const script = document.createElement("script");
  script.id = "supportScript";
  script.src = `https://lcab.talk-me.ru/support/support.js?h=${id}`;
  document.head.appendChild(script);

  const onTalkMeReady = () => {
    try {
      window.TalkMe("setUserData", {
        name: localStorage.getItem("guestName") || "Гость отеля",
        email: localStorage.getItem("guestEmail") || "guest@example.com",
      });
    } catch (e) {
      console.warn("TalkMe user data not applied yet, retrying...");
      setTimeout(onTalkMeReady, 1000);
    }
  };

  // listen until TalkMe is available and initialized
  const check = setInterval(() => {
    if (window.TalkMe && typeof window.TalkMe === "function") {
      clearInterval(check);
      onTalkMeReady();
    }
  }, 500);

  return () => {
    clearInterval(check);
    script.remove();
    delete window.TalkMe;
  };
}, []);
