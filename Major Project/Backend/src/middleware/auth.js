import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({success:false,message:"Authentication required"});
    const payload = jwt.verify(header.slice(7), process.env.JWT_ACCESS_SECRET);
    const { rows } = await query("SELECT id,name,email,phone,role,avatar,is_kyc_verified,is_blocked,created_at FROM users WHERE id=$1", [payload.userId]);
    if (!rows[0] || rows[0].is_blocked) return res.status(401).json({success:false,message:"Invalid or blocked account"});
    req.user = rows[0];
    next();
  } catch {
    res.status(401).json({success:false,message:"Invalid or expired access token"});
  }
}
export function owner(req,res,next) {
  if (!["owner","admin"].includes(req.user.role)) return res.status(403).json({success:false,message:"Owner access required"});
  next();
}
export function admin(req,res,next) {
  if (req.user.role !== "admin") return res.status(403).json({success:false,message:"Admin access required"});
  next();
}
