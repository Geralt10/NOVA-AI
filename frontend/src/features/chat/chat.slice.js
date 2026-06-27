import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatID: null,
    isChatLoading: false,
    chatError: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatID, title } = action.payload;
      state.chats[chatID] = {
        id: chatID,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMessage: (state, action) => {
      const { chatID, content, role } = action.payload;
      state.chats[chatID].messages.push({
        content,
        role,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    },
    addMessages: (state, action) => {
      const { chatID, messages } = action.payload;

      state.chats[chatID].messages = messages;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatID: (state, action) => {
      state.currentChatID = action.payload;
    },
    setChatLoading: (state, action) => {
      state.isChatLoading = action.payload;
    },
    setChatError: (state, action) => {
      state.chatError = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatID,
  setChatLoading,
  setChatError,
  createNewChat,
  addNewMessage,
  addMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
