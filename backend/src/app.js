import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin:true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ API Routes FIRST
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// ✅ Static files
const publicPath = path.join(__dirname, "../public/dist");

app.use(express.static(publicPath));

app.get("/{*any}", (req, res) => {
  res.sendFile(`${publicPath}/index.html`);
});

export default app;