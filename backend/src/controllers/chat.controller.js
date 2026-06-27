import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";

export async function sendMessageController(req, res, next) {
  try {
    const { message, chat: chatID } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let chat = null;
    let title = null;

    if (!chatID) {
      title = await generateChatTitle(message);

      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    }

    const currentChatId = chatID || chat._id;

    const userMessage = await messageModel.create({
      chat: currentChatId,
      content: message,
      role: "user",
    });

    const messages = await messageModel.find({
      chat: currentChatId,
    });

    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: currentChatId,
      content: result,
      role: "ai",
    });

    return res.status(201).json({
      success: true,
      title,
      chat,
      chatID: currentChatId,
      aiMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getChats(req, res) {
  try {
    const user = req.user;

    const chats = await chatModel.find({ user: user.id }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Chats retrieved successfully",
      chats,
    });
  } catch (error) {
    console.error("Get Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getMessages(req, res) {
  const { chatID } = req.params;

  const chat = await chatModel.findOne({
    _id: chatID,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "chat not found",
      err: "chat not found",
    });
  }

  const messages = await messageModel.find({
    chat: chatID,
  });

  res.status(200).json({
    message: "messages retrived successfully",
    messages,
  });
}

export async function deleteChat(req, res) {
  try {
    const { chatID } = req.params;

    const chat = await chatModel.findOne({
      _id: chatID,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    await messageModel.deleteMany({
      chat: chat._id,
    });

    await chat.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export default { sendMessageController };
