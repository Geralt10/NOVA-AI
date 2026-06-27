import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";


export default function ChatInput() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const { handleSendMessage } = useChat();

  const currentChatID = useSelector((state) => state.chat.currentChatID);

  const isChatLoading = useSelector((state) => state.chat.isChatLoading);

  const handleChange = (e) => {
    setMessage(e.target.value);

    textareaRef.current.style.height = "24px";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    await handleSendMessage({
      message,
      chatID: currentChatID,
    });

    setMessage("");

    textareaRef.current.style.height = "24px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="  px-4 py-3">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2 rounded-3xl border border-white/10 bg-[#171720] px-3 py-2 transition-all duration-300 focus-within:border-violet-500">
          {/* Attach */}

          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white">
            <i className="ri-attachment-2 text-lg"></i>
          </button>

          {/* Textarea */}

          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 resize-none bg-transparent py-2 leading-6 text-[15px] text-white placeholder:text-zinc-500 outline-none min-h-[40px] max-h-28"
          />

          {/* Voice */}

          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white">
            <i className="ri-mic-line text-lg"></i>
          </button>

          {/* Send */}

          <button
            onClick={handleSend}
            disabled={!message.trim() || isChatLoading}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              message.trim()
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-[#232330] text-zinc-600 cursor-not-allowed"
            }`}
          >
            {isChatLoading ? (
              <i className="ri-loader-4-line animate-spin"></i>
            ) : (
              <i className="ri-arrow-up-line"></i>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
