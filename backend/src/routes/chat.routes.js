import { Router } from "express";
import { getChats, getMessages, sendMessageController } from "../controllers/chat.controller.js";
import identifyUser from "../middlewares/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", identifyUser, sendMessageController);

chatRouter.get("/", identifyUser, getChats);

chatRouter.get("/:chatID/messages", identifyUser, getMessages);

chatRouter.post("/delete/:chatID", identifyUser);

export default chatRouter;
