import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";

import { useDispatch } from "react-redux";

import {
  addNewMessage,
  createNewChat,
  setChatLoading,
  setCurrentChatID,
  setChatError,
  setChats,
  addMessages,
} from "../chat.slice";

export function useChat() {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatID }) {
  try {
    dispatch(setChatLoading(true));

    const data = await sendMessage({
      message,
      chatID,
    });

    const {
      chat,
      chatID: currentID,
      aiMessage,
    } = data;

    // Sirf new chat create hui hai tabhi Redux me add karo
    if (chat) {
      dispatch(
        createNewChat({
          chatID: currentID,
          title: chat.title,
        })
      );
    }

    // User Message
    dispatch(
      addNewMessage({
        chatID: currentID,
        content: message,
        role: "user",
      })
    );

    // AI Message
    dispatch(
      addNewMessage({
        chatID: currentID,
        content: aiMessage.content,
        role: aiMessage.role,
      })
    );

    dispatch(setCurrentChatID(currentID));
  } catch (error) {
    dispatch(setChatError(error.message));
  } finally {
    dispatch(setChatLoading(false));
  }
}

  async function handleGetChats() {
    dispatch(setChatLoading(true));
    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updateAt,
          };
          return acc;
        }, {})
      )
    );
    dispatch(setChatLoading(false));
  }

  async function handleGetMessages(chatID) {
    try {
      dispatch(setChatLoading(true));
      console.log("Clicked Chat:", chatID);
      const data = await getMessages(chatID);
      const { messages } = data;

      const formatMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      dispatch(
        addMessages({
          chatID,
          messages: formatMessages,
        })
      );

      dispatch(setCurrentChatID(chatID));
    } catch (error) {
      dispatch(setChatError(error.message));
    } finally {
      dispatch(setChatLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleGetMessages
  };
}
