import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { signAccess, signRefresh } from "../utils/auth.js";
import { auth } from "../middleware/auth.js";
import { ok } from "../utils/response.js";
const router=Router();
const setRefreshCookie=(res,token)=>res.cookie("refreshToken",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",maxAge:7*24*60*60*1000});

router.post("/register", async (req,res)=>{
  const {name,email,password,role="seeker"}=req.body;
  if(!name||!email||!password) return res.status(400).json({success:false,message:"Name, email and password are required"});
  if(password.length<8) return res.status(400).json({success:false,message:"Password must contain at least 8 characters"});
  const exists=await query("SELECT id FROM users WHERE email=$1",[email.toLowerCase()]);
  if(exists.rows[0]) return res.status(409).json({success:false,message:"Email already registered"});
  const hash=await bcrypt.hash(password,12);
  const safeRole=["seeker","roommate","owner"].includes(role)?role:"seeker";
  const {rows}=await query("INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role,avatar,is_kyc_verified", [name,email.toLowerCase(),hash,safeRole]);
  const user=rows[0];
  const refresh=signRefresh(user); setRefreshCookie(res,refresh); return ok(res,201,"Registration successful",{user,accessToken:signAccess(user)});
});

router.post("/login",async(req,res)=>{
  const {email,password}=req.body;
  const {rows}=await query("SELECT * FROM users WHERE email=$1",[email?.toLowerCase()]);
  const user=rows[0];
  if(!user || !(await bcrypt.compare(password||"",user.password_hash))) return res.status(401).json({success:false,message:"Invalid email or password"});
  if(user.is_blocked) return res.status(403).json({success:false,message:"Account is blocked"});
  await query("UPDATE users SET last_login_at=now(),updated_at=now() WHERE id=$1",[user.id]);
  const safe={id:user.id,name:user.name,email:user.email,phone:user.phone,role:user.role,avatar:user.avatar,is_kyc_verified:user.is_kyc_verified};
  const refresh=signRefresh(safe); setRefreshCookie(res,refresh); return ok(res,200,"Login successful",{user:safe,accessToken:signAccess(safe)});
});

router.post("/refresh",async(req,res)=>{
  const token=req.body?.refreshToken || req.cookies?.refreshToken;
  if(!token) return res.status(401).json({success:false,message:"Refresh token required"});
  try {
    const p=jwt.verify(token,process.env.JWT_REFRESH_SECRET);
    const {rows}=await query("SELECT id,name,email,role,avatar,is_kyc_verified FROM users WHERE id=$1 AND is_blocked=false",[p.userId]);
    if(!rows[0]) throw new Error();
    return ok(res,200,"Token refreshed",{accessToken:signAccess(rows[0])});
  } catch { return res.status(401).json({success:false,message:"Invalid refresh token"}); }
});

router.post("/logout",(req,res)=>ok(res,200,"Logged out"));
router.post("/kyc",auth,async(req,res)=>{
  await query("UPDATE users SET is_kyc_verified=true,updated_at=now() WHERE id=$1",[req.user.id]);
  ok(res,200,"KYC submitted",{verified:true});
});
router.get("/me",auth,async(req,res)=>ok(res,200,"Profile fetched",{user:req.user}));
export default router;
