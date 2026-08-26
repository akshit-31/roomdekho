import {Router} from "express";
import {query} from "../config/db.js";
import {auth} from "../middleware/auth.js";
import {ok} from "../utils/response.js";
const r=Router();
r.get("/me",auth,async(req,res)=>{
 const p=await query("SELECT * FROM profiles WHERE user_id=$1",[req.user.id]);
 const user = {
   ...req.user,
   _id: req.user.id,
   avatarUrl: req.user.avatar,
   kyc: { status: req.user.is_kyc_verified ? "verified" : "not_submitted" },
   profile: p.rows[0] || null
 };
 ok(res,200,"Profile fetched", user);
});
r.put("/me",auth,async(req,res)=>{
 const {name,phone,avatar}=req.body;
 await query("UPDATE users SET name=COALESCE($1,name),phone=COALESCE($2,phone),avatar=COALESCE($3,avatar),updated_at=now() WHERE id=$4",[name,phone,avatar,req.user.id]);
 const {rows}=await query("SELECT id,name,email,phone,role,avatar,is_kyc_verified FROM users WHERE id=$1",[req.user.id]);
 ok(res,200,"Profile updated",{user:rows[0]});
});
r.get("/:id",async(req,res)=>{
 const {rows}=await query("SELECT id,name,avatar,role,is_kyc_verified,created_at FROM users WHERE id=$1",[req.params.id]);
 if(!rows[0]) return res.status(404).json({success:false,message:"User not found"});
 const p=await query("SELECT bio,gender,age,occupation,budget_min,budget_max,preferred_locations,personality_tags,sleep_schedule,food_preference,cleanliness,smoking,pets FROM profiles WHERE user_id=$1",[req.params.id]);
 ok(res,200,"User fetched",{user:rows[0],profile:p.rows[0]||null});
});
r.get("/me/devices",auth,async(req,res)=>{const {rows}=await query("SELECT id,name,created_at FROM devices WHERE user_id=$1 ORDER BY created_at DESC",[req.user.id]);ok(res,200,"Devices fetched",rows)});
r.delete("/me/devices/:deviceId",auth,async(req,res)=>{await query("DELETE FROM devices WHERE id=$1 AND user_id=$2",[req.params.deviceId,req.user.id]);ok(res,200,"Device removed")});
export default r;
