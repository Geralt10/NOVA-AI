import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js";
import { senEmail } from "../services/mail.service.js";

export async function registerController(req,res,next) {
    const {username,email,password}=req.body;
    
    
    const isUserExists = await userModel.findOne({
        $or:[{username},{email}]
    });

    if(isUserExists){
        return res.status(400).json({
            message:"user already exists",
            success:false,
            err:"user already exists"
        })
    }

    const user = await userModel.create({username,email,password});

    await senEmail({
        to:email,
        subject:"welcome to perplexity",
        html:`<p>Hi ${username},</p>
              <p>thank you for registering at <strong>Peplexity</strong> we are excited to have you on board</p>
              <p>Best regards,<br>The perplexity Team</p>`,
    });

    res.status(201).json({
        message:"user registered successfully",
        success:true,
        user:{
            username:user.username,
            email:user.email
        }
    })


}

