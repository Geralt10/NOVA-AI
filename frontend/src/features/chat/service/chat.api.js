import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const sendMessage = async({message,chatID}) => {
    const response = await api.post("/chats/message",{
        message,
        chat:chatID
    })
    return response.data
}

export const getChats = async () => {
    const response = await api.get("/chats/");
    return response.data
}

export const getMessages = async (chatID) => {
    const response = await api.get(`/chats/${chatID}/messages`);
    return response.data
}

export const deleteChat = async (chatID) => {
    const response = await api.post(`/chats/delete/${chatID}`);
    return response.data
}