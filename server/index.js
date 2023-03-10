import cors from "cors";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import router from "./api/routes.js";
import sockets from "./socket/sockets.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

const app = express();
const PORT = process.env.PORT;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://chat-app-neon-zeta.vercel.app"],
    credentials: true
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://chat-app-neon-zeta.vercel.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use("/", router);

io.on("connection", sockets);

httpServer.listen(PORT, () => {
  console.log("Server is running ");
});
