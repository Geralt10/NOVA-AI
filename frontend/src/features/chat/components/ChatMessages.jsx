import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { useSelector } from "react-redux";

export default function ChatMessages() {
  const bottomRef = useRef(null);
  const currentChatID = useSelector((state) => state.chat.currentChatID);

  const messages = useSelector((state) => {
    if (!currentChatID) return [];

    return state.chat.chats[currentChatID]?.messages || [];
  });
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <section className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {messages.map((message,index) => (
          <ChatBubble
            key={index}
            role={message.role}
            content={message.content}
            time={message.time}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}
