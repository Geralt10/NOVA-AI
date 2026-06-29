import { useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [search, setSearch] = useState("");
  const { handleGetMessages, handleNewChat, handleDeleteChat } = useChat();
  const { handleLogout } = useAuth();

  const navigate = useNavigate();

  const onLogout = async () => {
    const success = await handleLogout();

    if (success) {
      navigate("/login", { replace: true });
    }
  };

  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => Object.values(state.chat.chats));

  const currentChatID = useSelector((state) => state.chat.currentChatID);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col border-r border-white/10 bg-[#0D0D14] transition-transform duration-300

        sm:w-[320px]

        lg:static
        lg:translate-x-0

        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* ================= Header ================= */}

        <div className="border-b border-white/10 px-4 py-4 sm:px-5 sm:py-5">
          {/* Logo */}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 shadow-lg shadow-violet-600/20">
                <i className="ri-sparkling-2-fill text-lg text-white"></i>
              </div>

              <div>
                <h2 className="text-[17px] font-semibold text-white leading-none">NOVA AI</h2>

                <p className="mt-1 text-[11px] text-zinc-500">AI Workspace</p>
              </div>
            </div>

            {/* Close */}

            <button
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

          {/* Search */}

          <div className="relative mt-4">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"></i>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search chats..."
              className="h-10 w-full rounded-xl border border-white/10 bg-[#171720] pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-[#1B1B26]"
            />
          </div>

          {/* New Chat */}

          <button
            onClick={() => {
              handleNewChat();
              setIsOpen(false);
            }}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-violet-600/40"
          >
            <i className="ri-add-line"></i>
            New Chat
          </button>
        </div>

        {/* Chat History */}

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Recent Chats
            </h3>

            <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] font-bold text-zinc-400">
              {filteredChats.length}
            </span>
          </div>

          <div className="space-y-2">
            {filteredChats.map((chat) => {
              const isActive = currentChatID === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => {
                    handleGetMessages(chat.id);
                    setIsOpen(false);
                  }}
                  className={`group relative w-full rounded-2xl border p-2 text-left transition-all duration-300 ${
                    isActive
                      ? "border-violet-500/30 bg-violet-500/10"
                      : "border-transparent hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  {/* Active Indicator */}

                  {isActive && (
                    <span className="absolute left-0 top-3 h-8 w-1 rounded-r-full bg-violet-500" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon */}

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        isActive
                          ? "bg-violet-600 text-white"
                          : "bg-[#1A1A25] text-zinc-400 group-hover:bg-violet-600 group-hover:text-white"
                      }`}
                    >
                      <i className="ri-message-3-line text-md"></i>
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-white">{chat.title}</h4>

                      <p className="mt-1 text-xs text-zinc-500">
                        {chat.lastUpdated ? new Date(chat.lastUpdated).toLocaleDateString() : ""}
                      </p>
                    </div>

                    {/* More */}

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300"
                    >
                      <i className="ri-delete-bin-6-line cursor-pointer text-zinc-500 hover:text-red-500"></i>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* User */}

        <div>
          {/* ================= User Profile ================= */}

          <div className="border-t border-white/10 px-3 pt-1 pb-0">
            <div className="rounded-2xl border border-white/10 bg-[#171720] p-3">
              {/* User Info */}

              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-white">{user.username}</h3>

                  <p className="truncate text-xs text-zinc-500">{user.email}</p>
                </div>

                <button className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-all duration-300 hover:bg-white/5 hover:text-white">
                  <i className="ri-settings-3-line text-lg"></i>
                </button>
              </div>

              {/* Divider */}

              <div className="my-1 h-px bg-white/10"></div>

              {/* Menu */}

              <div className="space-y-1">
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-1 text-sm text-red-400 transition-all duration-300 hover:bg-red-500/10"
                >
                  <i className="ri-logout-box-r-line text-lg"></i>
                  Logout
                </button>
              </div>
            </div>

            {/* Footer */}

            <div className="mt-2 text-center">
              <p className="text-xs text-zinc-600">NOVA AI v1.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
