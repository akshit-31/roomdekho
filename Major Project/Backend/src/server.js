import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import { connectDB, initDB } from "./config/db.js";

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

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:process.env.CLIENT_URL||"http://localhost:5173",credentials:true}});
app.set("io",io);

io.on("connection",(socket)=>{
  socket.on("joinConversation",(id)=>socket.join(`conversation:${id}`));
});

app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URL||"http://localhost:5173",credentials:true}));
app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
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
}
mount("/api/v1");
mount("/api");

app.use((req,res)=>res.status(404).json({success:false,message:`Route not found: ${req.method} ${req.originalUrl}`}));
app.use((err,_req,res,_next)=>{
  console.error(err);
  res.status(err.status||500).json({success:false,message:err.message||"Something went wrong"});
});

const port=Number(process.env.PORT||5000);
async function start(){
  await connectDB();
  await initDB();
  server.listen(port,()=>console.log(`API running on http://localhost:${port}`));
}
start().catch(err=>{console.error("Server start failed:",err);process.exit(1)});
