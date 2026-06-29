/** @format */

import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { senEmail } from "../services/mail.service.js";
import redisClient from "../config/cache.js";

//register
export async function registerController(req, res, next) {
  const { username, email, password } = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists && isUserExists.verified) {
    return res.status(400).json({
      message: "user already exists",
      success: false,
      err: "user already exists",
    });
  }

  if (isUserExists && !isUserExists.verified) {
    await isUserExists.deleteOne();
  }

  const user = await userModel.create({
    username,
    email,
    password,
    lastVerificationEmailSentAt: new Date(),
  });

  const emailVerificationToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const baseURL = `${req.protocol}://${req.get("host")}`;

  const verificationLink = `${baseURL}/api/auth/verify-email?token=${emailVerificationToken}`;

  await senEmail({
    to: email,
    subject: "Welcome to NOVA_AI",
    html: `
    <p>Hi ${username},</p>
    <p>Thank you for registering at <strong>Perplexity</strong>.</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>Or copy and paste this URL in your browser:</p>
    <p>${verificationLink}</p>
  `,
  });

  return res.status(201).json({
    message: "user registered successfully",
    success: true,
    user: {
      username: user.username,
      email: user.email,
    },
  });
}

//verification email
export async function verifyEmailController(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "invalid token",
        success: false,
        err: "user not found",
      });
    }

    if (user.verified) {
  return res.redirect("/login");
}

    user.verified = true;

    await user.save();

    return res.redirect("/login");
  } catch (error) {
    return res.status(400).json({
      message: "invalid or expired token",
      success: false,
      err: error.message,
    });
  }
}

//resend verification email
export async function resendVerificationEmail(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
      success: false,
    });
  }

  if (user.verified) {
    return res.status(400).json({
      success: false,
      message: "email already verified",
    });
  }

  if (
    user.lastVerificationEmailSentAt &&
    Date.now() - user.lastVerificationEmailSentAt.getTime() < 60 * 1000
  ) {
    return res.status(429).json({
      success: false,
      message: "Please wait 1 minute before requesting another verification email.",
    });
  }

  const emailVerificationToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const baseURL = `${req.protocol}://${req.get("host")}`;
  const verificationLink = `${baseURL}/api/auth/verify-email?token=${emailVerificationToken}`;

  await senEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <p>Hi ${user.username},</p>
      <p>Thank you for registering at <strong>Perplexity</strong>.</p>
      <p>Please click the link below to verify your email:</p>

      <a href="${verificationLink}">
        Verify Email
      </a>

      <p>If you did not request this email, you can safely ignore it.</p>
    `,
  });

  user.lastVerificationEmailSentAt = new Date();
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Verification email sent successfully.",
  });
}

//login
export async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "invalid email or password",
      success: false,
      err: "user not found",
    });
  }

  const isMatchedPassword = await user.comparePassword(password);

  if (!isMatchedPassword) {
    return res.status(400).json({
      message: "invalid email or password",
      success: false,
      err: "invalid password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "please verify your email",
      success: false,
      err: "email not verified",
    });
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction, // production me true kar dena
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction, // production me true kar dena
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "loggedIn successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

// get user detail
export async function getMeController(req, res) {
  const userID = req.user.id;

  const user = await userModel.findById(userID);

  if (!user) {
    return res.status(401).json({
      message: "user not found",
      success: false,
      err: "user not found",
    });
  }

  return res.status(200).json({
    message: "user data fetched successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

// refresh
export async function refreshTokenController(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "invalid  token",
      success: false,
      err: error.message,
    });
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    return res.status(401).json({
      message: "invalid or expired token",
      success: false,
      err: "user not found",
    });
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction, // production me true kar dena
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  return res.status(200).json({
    message: "token refreshed",
    success: true,
  });
}

//logout
export async function logoutController(req, res) {
  const accessToken = req.cookies.accessToken;

  if (accessToken) {
    await redisClient.set(`blacklist:${accessToken}`, "true", {
      EX: 15 * 60, // 15 minutes
    });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

//forgot password

export async function forgotPasswordController(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // ⏱️ Throttling (1 minute)
  if (
    user.lastPasswordResetEmailSentAt &&
    Date.now() - user.lastPasswordResetEmailSentAt.getTime() < 60 * 1000
  ) {
    return res.status(429).json({
      success: false,
      message: "Please wait 1 minute before requesting another password reset email.",
    });
  }

  const resetToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.RESET_PASSWORD_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const baseURL = `${req.protocol}://${req.get("host")}`;
  const resetLink = `${baseURL}/reset-password?token=${resetToken}`;

  await senEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <p>Hi ${user.username},</p>

      <p>Click the link below to reset your password:</p>

      <a href="${resetLink}">
        Reset Password
      </a>

      <p>If you did not request this email, you can safely ignore it.</p>
    `,
  });

  // ✅ Update timestamp after successful email send
  user.lastPasswordResetEmailSentAt = new Date();
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset email sent successfully.",
  });
}

//reset password
export async function resetPasswordController(req, res) {
  const { token } = req.query;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: "Token and password are required",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
      err: error.message,
    });
  }

  const user = await userModel.findById(decoded.id).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.password = password;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
}
