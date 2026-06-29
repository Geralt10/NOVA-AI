import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import net from "node:net";

const socket = net.createConnection({
  host: "smtp.gmail.com",
  port: 587,
});

socket.on("connect", () => {
  console.log("TCP CONNECTED");
  socket.destroy();
});

socket.on("error", (err) => {
  console.error(err);
});

socket.setTimeout(10000, () => {
  console.log("TCP TIMEOUT");
  socket.destroy();
});

import connectDB from "./src/config/database.js";
import "./src/jobs/cleanupUnverifiedUsers.js";
import "./src/config/cache.js";
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);

initSocket(httpServer);

async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    console.error(error);
  }
}
startServer();
httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
