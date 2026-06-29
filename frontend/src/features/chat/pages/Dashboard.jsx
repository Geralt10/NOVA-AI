import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";

const Dashboard = () => {
  const chat = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);
  const { user } = useSelector((state) => state.auth);
  
  return (
    <div className="flex h-dvh overflow-hidden bg-[#09090F] text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* ================= Header ================= */}

        <ChatHeader setIsSidebarOpen={setIsSidebarOpen} />

        {/* ================= Chat Area ================= */}

        <ChatMessages />

        {/* ================= Input ================= */}

        <ChatInput/>
      </main>
    </div>
  );
};

export default Dashboard;
