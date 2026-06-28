import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function ChatBubble({ role, content, time }) {
  const [copied, setCopied] = useState(false);

  const isUser = role === "user";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`flex mb-0 w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`group flex w-full max-w-[95%] min-w-0 gap-3 sm:max-w-[85%] lg:max-w-[75%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
          ${isUser ? "bg-violet-600" : "bg-[#1A1A25]"}`}
        >
          {isUser ? (
            <i className="ri-user-3-line text-lg text-white"></i>
          ) : (
            <i className="ri-robot-2-line text-lg text-violet-400"></i>
          )}
        </div>

        {/* Bubble */}

        <div className={`min-w-0 flex flex-col ${isUser ? "items-end" : "flex-1"}`}>
          <div
            className={`min-w-0 overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-300
            ${
              isUser
                ? "border-violet-500/30 bg-violet-600 text-white"
                : "border-white/10 bg-[#171720] text-zinc-200"
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap break-words text-sm leading-7">{content}</p>
            ) : (
              <div
                className="
                prose
                prose-invert
                max-w-none
                prose-p:my-3
                prose-headings:mb-4
                prose-headings:mt-6
                prose-ul:my-3
                prose-ol:my-3
                prose-pre:rounded-xl
               prose-pre:bg-[#0D0D14]
                prose-code:text-violet-300
  "
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Footer */}

          <div
            className={`mt-2 flex items-center gap-3 text-xs text-zinc-500 ${
              isUser ? "justify-end" : ""
            }`}
          >
            <span>{time}</span>

            <button
              onClick={copyMessage}
              className="opacity-0 transition-all duration-300 group-hover:opacity-100 hover:text-white"
            >
              {copied ? (
                <i className="ri-check-line text-green-400"></i>
              ) : (
                <i className="ri-file-copy-line"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
