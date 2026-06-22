import { body,validationResult } from "express-validator";

export function validate(req,res,next){
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}

export const registerValidator =[
    body("username")
    .trim()
    .notEmpty().withMessage("username is required")
    .isLength({min:3,max:30}).withMessage("username length must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("username can only contain letters, numbers, and underscores"),

    body("email")
    .trim()
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email address"),

    body("password")
    .trim()
    .notEmpty().withMessage("password is required")
    .isLength({min:6,max:100}).withMessage("password length must be between 6 and 100 characters"),

    validate


]

