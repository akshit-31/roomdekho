import {Router} from "express";
import {query} from "../config/db.js";
import {auth} from "../middleware/auth.js";
import {ok} from "../utils/response.js";
const r=Router();
r.get("/me",auth,async(req,res)=>{
  const uRes = await query("SELECT id,name,email,phone,role,avatar,is_kyc_verified,created_at FROM users WHERE id=$1",[req.user.id]);
  const userRow = uRes.rows[0] || req.user;
  const p = await query("SELECT * FROM profiles WHERE user_id=$1",[req.user.id]);
  const profileData = p.rows[0] || {};
  const user = {
    ...userRow,
    _id: userRow.id,
    avatarUrl: userRow.avatar,
    bio: profileData.bio || "",
    gender: profileData.gender || "",
    age: profileData.age || null,
    occupation: profileData.occupation || "",
    dob: profileData.dob || "",
    kyc: { status: userRow.is_kyc_verified ? "verified" : "not_submitted" },
    profile: profileData
  };
  ok(res,200,"Profile fetched", user);
});
r.put("/me",auth,async(req,res)=>{
  const {name,phone,avatar,bio,gender,age,occupation,dob}=req.body;
  await query("UPDATE users SET name=COALESCE($1,name),phone=COALESCE($2,phone),avatar=COALESCE($3,avatar),updated_at=now() WHERE id=$4",[name,phone,avatar,req.user.id]);
  if(bio !== undefined || gender !== undefined || age !== undefined || occupation !== undefined || dob !== undefined) {
    await query(
      `INSERT INTO profiles(user_id,bio,gender,age,occupation,dob) VALUES($1,$2,$3,$4,$5,$6)
       ON CONFLICT(user_id) DO UPDATE SET bio=EXCLUDED.bio,gender=EXCLUDED.gender,age=EXCLUDED.age,occupation=EXCLUDED.occupation,dob=EXCLUDED.dob,updated_at=now()`,
      [req.user.id, bio||null, gender||null, age||null, occupation||null, dob||null]
    );
  }
  const uRes = await query("SELECT id,name,email,phone,role,avatar,is_kyc_verified FROM users WHERE id=$1",[req.user.id]);
  const userRow = uRes.rows[0];
  const p = await query("SELECT * FROM profiles WHERE user_id=$1",[req.user.id]);
  const profileData = p.rows[0] || {};
  const user = {
    ...userRow,
    _id: userRow.id,
    avatarUrl: userRow.avatar,
    bio: profileData.bio || "",
    gender: profileData.gender || "",
    age: profileData.age || null,
    occupation: profileData.occupation || "",
    dob: profileData.dob || "",
    kyc: { status: userRow.is_kyc_verified ? "verified" : "not_submitted" },
    profile: profileData
  };
  ok(res,200,"Profile updated", user);
});
r.get("/:id",async(req,res)=>{
 const {rows}=await query("SELECT id,name,avatar,role,is_kyc_verified,created_at FROM users WHERE id=$1",[req.params.id]);
 if(!rows[0]) return res.status(404).json({success:false,message:"User not found"});
 const u = rows[0];
 const p=await query("SELECT bio,gender,age,occupation,budget_min,budget_max,preferred_locations,personality_tags,sleep_schedule,food_preference,cleanliness,smoking,pets,dob FROM profiles WHERE user_id=$1",[req.params.id]);
 const pr = p.rows[0] || {};
 const adapted = {
   _id: String(u.id),
   id: String(u.id),
   userId: String(u.id),
   name: u.name,
   avatar: u.avatar,
   avatarUrl: u.avatar,
   role: u.role,
   isKycVerified: Boolean(u.is_kyc_verified),
   kyc: { status: u.is_kyc_verified ? "verified" : "not_submitted" },
   bio: pr.bio || "Looking for a friendly roommate to share an apartment.",
   gender: pr.gender || "Any",
   age: pr.age || null,
   occupation: pr.occupation || "",
   dob: pr.dob || "",
   preferences: {
     budgetMin: Number(pr.budget_min || 0),
     budgetMax: Number(pr.budget_max || 0),
     preferredLocations: pr.preferred_locations || [],
     personalityTags: pr.personality_tags || [],
     sleepSchedule: pr.sleep_schedule || "",
     food: pr.food_preference || "",
     foodPreference: pr.food_preference || "",
     cleanliness: pr.cleanliness || "",
     smoking: pr.smoking,
     pets: pr.pets
   },
   user: u,
   profile: pr
 };
 ok(res,200,"User fetched", adapted);
});
r.get("/me/devices",auth,async(req,res)=>{const {rows}=await query("SELECT id,name,created_at FROM devices WHERE user_id=$1 ORDER BY created_at DESC",[req.user.id]);ok(res,200,"Devices fetched",rows)});
r.delete("/me/devices/:deviceId",auth,async(req,res)=>{await query("DELETE FROM devices WHERE id=$1 AND user_id=$2",[req.params.deviceId,req.user.id]);ok(res,200,"Device removed")});
export default r;
