import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000/api/chats",
    withCredentials:true
})

export const sendMessage = async({message,chatID}) => {
    const response = await api.post("/message",{
        message,
        chat:chatID
    })
    return response.data
}

export const getChats = async () => {
    const response = await api.get("/");
    return response.data
}

export const getMessages = async (chatID) => {
    const response = await api.get(`/${chatID}/messages`);
    return response.data
}

export const deleteChat = async (chatID) => {
    const response = await api.post(`/delete/${chatID}`);
    return response.data
}