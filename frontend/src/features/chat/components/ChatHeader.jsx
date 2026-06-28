import { useState } from "react";
import { useSelector } from "react-redux";

const models = ["GPT-4o", "GPT-4.1", "Claude 4", "Gemini 2.5"];

export default function ChatHeader({ setIsSidebarOpen }) {
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [showModels, setShowModels] = useState(false);
  const chats = useSelector((state) => Object.values(state.chat.chats));
  const currentChatID = useSelector((state) => state.chat.currentChatID);

  const currentChat = chats.find((chat) => chat.id === currentChatID);

  function getLastUpdated(lastUpdated) {
    if (!lastUpdated) return "";

    const now = new Date();
    const updated = new Date(lastUpdated);

    const diff = now - updated;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} day ago`;

    return updated.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <header className="relative flex h-16 sm:h-20 items-center justify-between border-b border-white/10 bg-[#0D0D14] px-4 sm:px-6 lg:px-8">
      {/* Left */}

      <div className="flex items-center gap-3">
        {/* Mobile Menu */}

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 transition-all duration-300 hover:bg-white/5 lg:hidden"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>

        <div>
          <h1 className="text-base font-semibold text-white sm:text-lg lg:text-xl">
            {currentChat ? currentChat.title : "Title"}
          </h1>

          <p className="hidden text-sm text-zinc-500 sm:block">
            {currentChat ? `Last updated ${getLastUpdated(currentChat.lastUpdated)}` : "New Chat"}
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Model */}

        <div className="relative">
          <button
            onClick={() => setShowModels(!showModels)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#171720] px-3 py-2 text-sm text-white transition-all duration-300 hover:border-violet-500 sm:px-4"
          >
            <i className="ri-cpu-line"></i>

            <span className="hidden sm:block">{selectedModel}</span>

            <i
              className={`ri-arrow-down-s-line transition-transform duration-300 ${
                showModels ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          {showModels && (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#171720] shadow-2xl">
              {models.map((model) => (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);
                    setShowModels(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-all duration-300 hover:bg-violet-600

                  ${selectedModel === model ? "bg-violet-600 text-white" : "text-zinc-300"}`}
                >
                  {model}

                  {selectedModel === model && <i className="ri-check-line"></i>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}

        <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#171720] text-zinc-300 transition-all duration-300 hover:border-violet-500 hover:bg-violet-600 hover:text-white md:flex">
          <i className="ri-search-line"></i>
        </button>

        {/* Share */}

        <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#171720] text-zinc-300 transition-all duration-300 hover:border-violet-500 hover:bg-violet-600 hover:text-white sm:flex">
          <i className="ri-share-forward-line"></i>
        </button>

        {/* More */}

        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#171720] text-zinc-300 transition-all duration-300 hover:border-violet-500 hover:bg-violet-600 hover:text-white">
          <i className="ri-more-2-fill"></i>
        </button>
      </div>
    </header>
  );
}
