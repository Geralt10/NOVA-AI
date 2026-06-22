import express from 'express'
import { registerController } from '../controllers/auth.controller.js';
import { registerValidator } from '../validators/auth.validation.js';


const authRouter = express.Router();

authRouter.post("/register",registerValidator,registerController)

export default authRouter;