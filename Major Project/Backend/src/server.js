import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, initDB } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import profileRoutes from "./routes/profile.js";
import roomRoutes from "./routes/rooms.js";
import matchRoutes from "./routes/matches.js";
import searchRoutes from "./routes/search.js";
import visitRoutes from "./routes/visits.js";
import chatRoutes from "./routes/chat.js";
import notificationRoutes from "./routes/notifications.js";
import reviewRoutes from "./routes/reviews.js";
import expenseRoutes from "./routes/expenses.js";
import recommendationRoutes from "./routes/recommendations.js";
import ownerRoutes from "./routes/owner.js";
import reportRoutes from "./routes/reports.js";
import adminRoutes from "./routes/admin.js";
import analyticsRoutes from "./routes/analytics.js";
import documentRoutes from "./routes/documents.js";
import paymentRoutes from "./routes/payments.js";
import roommateRoutes from "./routes/roommates.js";
import uploadRoutes from "./routes/upload.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.includes("vercel.app") ||
      origin.includes("onrender.com")
    ) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
};

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:corsOptions});
app.set("io",io);

io.on("connection",(socket)=>{
  const authUserId = socket.handshake.auth?.userId;
  if (authUserId) {
    socket.join(`user:${authUserId}`);
  }

  socket.on("joinConversation",(id)=>socket.join(`conversation:${id}`));
  socket.on("chat:join",(id)=>socket.join(`conversation:${id}`));
  socket.on("chat:leave",(id)=>socket.leave(`conversation:${id}`));

  socket.on("chat:typing",({conversationId,userId,isTyping})=>{
    socket.to(`conversation:${conversationId}`).emit("chat:typing",{userId,isTyping});
  });

  socket.on("chat:message",async(payload)=>{
    try {
      const convId = payload.conversationId;
      const text = payload.message?.text || payload.text || payload.body;
      const senderId = authUserId || payload.senderId || payload.userId;
      if (convId && text) {
        const { rows } = await query(
          "INSERT INTO messages(conversation_id, sender_id, body) VALUES($1, $2, $3) RETURNING *",
          [convId, senderId || 1, text]
        );
        const msg = { ...rows[0], _id: String(rows[0].id), text: rows[0].body };
        io.to(`conversation:${convId}`).emit("chat:message", msg);
        io.to(`conversation:${convId}`).emit("message:new", msg);
      }
    } catch (err) {
      console.error("Socket chat error:", err);
    }
  });
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors(corsOptions));
app.use(express.json({limit:"20mb"}));
app.use(express.urlencoded({extended:true,limit:"20mb"}));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(morgan("dev"));
app.use("/api",rateLimit({windowMs:15*60*1000,max:300}));

app.get("/api/health",(_req,res)=>res.json({success:true,message:"Room Searcher API is running"}));

function mount(prefix){
  app.use(`${prefix}/auth`,authRoutes);
  app.use(`${prefix}/users`,userRoutes);
  app.use(`${prefix}/profile`,profileRoutes);
  app.use(`${prefix}/rooms`,roomRoutes);
  app.use(`${prefix}/properties`,roomRoutes);
  app.use(`${prefix}/match`,matchRoutes);
  app.use(`${prefix}/matches`,matchRoutes);
  app.use(`${prefix}/search`,searchRoutes);
  app.use(`${prefix}/bookings/visits`,visitRoutes);
  app.use(`${prefix}/visits`,visitRoutes);
  app.use(`${prefix}/chat`,chatRoutes);
  app.use(`${prefix}/notifications`,notificationRoutes);
  app.use(`${prefix}/reviews`,reviewRoutes);
  app.use(`${prefix}/expenses`,expenseRoutes);
  app.use(`${prefix}/recommendations`,recommendationRoutes);
  app.use(`${prefix}/owner`,ownerRoutes);
  app.use(`${prefix}/reports`,reportRoutes);
  app.use(`${prefix}/admin`,adminRoutes);
  app.use(`${prefix}/analytics`,analyticsRoutes);
  app.use(`${prefix}/documents`,documentRoutes);
  app.use(`${prefix}/payments`,paymentRoutes);
  app.use(`${prefix}/roommates`,roommateRoutes);
  app.use(`${prefix}/upload`,uploadRoutes);
}
mount("/api/v1");
mount("/api");

app.use((req,res)=>res.status(404).json({success:false,message:`Route not found: ${req.method} ${req.originalUrl}`}));
app.use((err,_req,res,_next)=>{
  console.error(err);
  res.status(err.status||500).json({success:false,message:err.message||"Something went wrong"});
});

const port = Number(process.env.PORT || 5000);

server.listen(port, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${port} (PORT=${port})`);
});

async function start() {
  try {
    await connectDB();
    await initDB();
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database connection / init error:", err);
  }
}
start();

const shutdown = () => {
  if (server && server.listening) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.once("SIGUSR2", shutdown);
