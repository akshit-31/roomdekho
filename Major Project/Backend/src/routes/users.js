import {Router} from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {query} from "../config/db.js";
import {auth} from "../middleware/auth.js";
import {ok} from "../utils/response.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `avatar-${unique}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for avatar"));
    }
  },
});

const r=Router();
r.get("/me",auth,async(req,res)=>{
  const uRes = await query(
    `SELECT id,name,email,phone,role,avatar,is_kyc_verified,is_profile_completed,created_at,intent,
            property_city,property_locality,property_address,id_proof_type,id_proof_number,approval_status
     FROM users WHERE id=$1`,[req.user.id]
  );
  const userRow = uRes.rows[0] || req.user;
  const p = await query("SELECT * FROM profiles WHERE user_id=$1",[req.user.id]);
  const profileData = p.rows[0] || {};
  const isComplete = Boolean(userRow.is_profile_completed || (profileData.gender && profileData.occupation));
  const user = {
    ...userRow,
    _id: String(userRow.id),
    id: String(userRow.id),
    phone: userRow.phone || "",
    avatarUrl: userRow.avatar,
    latitude: userRow.latitude ? Number(userRow.latitude) : null,
    longitude: userRow.longitude ? Number(userRow.longitude) : null,
    isProfileCompleted: isComplete,
    is_profile_completed: isComplete,
    intent: userRow.intent || profileData.looking_for || "both",
    lookingFor: userRow.intent || profileData.looking_for || "both",
    bio: profileData.bio || "",
    gender: profileData.gender || "",
    age: profileData.age || null,
    occupation: profileData.occupation || "",
    dob: profileData.dob || "",
    city: profileData.preferred_locations?.[0] || userRow.property_city || "",
    locality: profileData.preferred_locations?.[1] || userRow.property_locality || "",
    budgetMin: Number(profileData.budget_min || 0),
    budgetMax: Number(profileData.budget_max || 0),
    preferredLocations: profileData.preferred_locations || [],
    personalityTags: profileData.personality_tags || [],
    sleepSchedule: profileData.sleep_schedule || "",
    foodPreference: profileData.food_preference || "",
    cleanliness: profileData.cleanliness || "",
    smoking: profileData.smoking,
    pets: profileData.pets,
    propertyCity: userRow.property_city || "",
    propertyLocality: userRow.property_locality || "",
    propertyAddress: userRow.property_address || "",
    idProofType: userRow.id_proof_type || "",
    idProofNumber: userRow.id_proof_number || "",
    approvalStatus: userRow.approval_status || "approved",
    kyc: { status: userRow.is_kyc_verified ? "verified" : (userRow.approval_status === "pending" ? "pending" : "not_submitted") },
    preferences: {
      budgetMin: Number(profileData.budget_min || 0),
      budgetMax: Number(profileData.budget_max || 0),
      preferredLocations: profileData.preferred_locations || [],
      personalityTags: profileData.personality_tags || [],
      sleepSchedule: profileData.sleep_schedule || "",
      foodPreference: profileData.food_preference || "",
      cleanliness: profileData.cleanliness || "",
      smoking: profileData.smoking,
      pets: profileData.pets
    },
    profile: profileData
  };
  ok(res,200,"Profile fetched", user);
});
r.post("/me/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    let url = "";
    if (req.file) {
      const host = req.get("host");
      const protocol = req.protocol;
      const base = `${protocol}://${host}`;
      url = `${base}/uploads/${req.file.filename}`;
    } else if (req.body?.avatar || req.body?.avatarUrl) {
      url = req.body.avatar || req.body.avatarUrl;
    }

    if (!url) {
      return res.status(400).json({ success: false, message: "Avatar image is required" });
    }

    await query("UPDATE users SET avatar = $1, updated_at = now() WHERE id = $2", [url, req.user.id]);
    ok(res, 200, "Avatar updated successfully", { avatar: url, avatarUrl: url });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to upload avatar" });
  }
});

r.patch("/me/location", auth, async (req, res) => {
  try {
    const lat = Number(req.body.latitude);
    const lng = Number(req.body.longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: "Valid latitude and longitude are required" });
    }
    const { rows } = await query(
      "UPDATE users SET latitude=$1, longitude=$2, updated_at=now() WHERE id=$3 RETURNING id, name, email, latitude, longitude",
      [lat, lng, req.user.id]
    );
    ok(res, 200, "GPS location saved successfully", rows[0]);
  } catch (err) {
    console.error("Location update error:", err);
    res.status(500).json({ success: false, message: "Failed to update GPS location" });
  }
});

r.put("/me",auth,async(req,res)=>{
  const {
    name,phone,avatar,avatarUrl,bio,gender,age,occupation,dob,
    city,locality,preferredLocations,personalityTags,
    budgetMin,budgetMax,sleepSchedule,foodPreference,cleanliness,smoking,pets,
    propertyCity,propertyLocality,propertyAddress,
    intent,lookingFor,
    preferences
  }=req.body;

  const finalAvatar = avatar || avatarUrl;
  const finalPhone = phone;
  const finalPropCity = propertyCity || (city && req.user.role === "owner" ? city : undefined);
  const finalPropLoc = propertyLocality || (locality && req.user.role === "owner" ? locality : undefined);
  const finalPropAddr = propertyAddress;
  const finalIntent = intent || lookingFor;

  await query(
    `UPDATE users SET
       name=COALESCE($1,name),
       phone=COALESCE($2,phone),
       avatar=COALESCE($3,avatar),
       property_city=COALESCE($4,property_city),
       property_locality=COALESCE($5,property_locality),
       property_address=COALESCE($6,property_address),
       intent=COALESCE($7,intent),
       is_profile_completed=true,
       updated_at=now()
     WHERE id=$8`,
    [name, finalPhone, finalAvatar, finalPropCity, finalPropLoc, finalPropAddr, finalIntent, req.user.id]
  );

  const parsedAge = age ? parseInt(age, 10) : null;
  const rawMin = budgetMin ?? preferences?.budgetMin;
  const rawMax = budgetMax ?? preferences?.budgetMax;
  const parsedMin = rawMin ? Number(rawMin) : null;
  const parsedMax = rawMax ? Number(rawMax) : null;

  let locs = preferredLocations || preferences?.preferredLocations;
  if (!locs && (city || locality)) {
    locs = [city, locality].filter(Boolean);
  }
  const finalLocs = Array.isArray(locs) ? locs : (locs ? [locs] : null);
  const rawTags = personalityTags || preferences?.personalityTags;
  const tags = Array.isArray(rawTags) ? rawTags : (rawTags ? [rawTags] : null);

  const finalSleep = sleepSchedule || preferences?.sleepSchedule || null;
  const finalFood = foodPreference || preferences?.food || preferences?.foodPreference || null;
  const finalClean = cleanliness || preferences?.cleanliness || null;
  const finalSmoke = smoking !== undefined ? Boolean(smoking) : (preferences?.smoking !== undefined ? Boolean(preferences.smoking) : null);
  const finalPets = pets !== undefined ? Boolean(pets) : (preferences?.pets !== undefined ? Boolean(preferences.pets) : null);

  await query(
    `INSERT INTO profiles(
      user_id, bio, gender, age, occupation, dob, budget_min, budget_max,
      preferred_locations, personality_tags, sleep_schedule, food_preference, cleanliness, smoking, pets, looking_for
    ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT(user_id) DO UPDATE SET
      bio = COALESCE(EXCLUDED.bio, profiles.bio),
      gender = COALESCE(EXCLUDED.gender, profiles.gender),
      age = COALESCE(EXCLUDED.age, profiles.age),
      occupation = COALESCE(EXCLUDED.occupation, profiles.occupation),
      dob = COALESCE(EXCLUDED.dob, profiles.dob),
      budget_min = COALESCE(EXCLUDED.budget_min, profiles.budget_min),
      budget_max = COALESCE(EXCLUDED.budget_max, profiles.budget_max),
      preferred_locations = COALESCE(EXCLUDED.preferred_locations, profiles.preferred_locations),
      personality_tags = COALESCE(EXCLUDED.personality_tags, profiles.personality_tags),
      sleep_schedule = COALESCE(EXCLUDED.sleep_schedule, profiles.sleep_schedule),
      food_preference = COALESCE(EXCLUDED.food_preference, profiles.food_preference),
      cleanliness = COALESCE(EXCLUDED.cleanliness, profiles.cleanliness),
      smoking = COALESCE(EXCLUDED.smoking, profiles.smoking),
      pets = COALESCE(EXCLUDED.pets, profiles.pets),
      looking_for = COALESCE(EXCLUDED.looking_for, profiles.looking_for),
      updated_at = now()`,
    [
      req.user.id, bio||null, gender||null, parsedAge, occupation||null, dob||null,
      parsedMin, parsedMax, finalLocs||[], tags||[], finalSleep, finalFood,
      finalClean, finalSmoke, finalPets, finalIntent||null
    ]
  );

  const uRes = await query(
    `SELECT id,name,email,phone,role,avatar,is_kyc_verified,is_profile_completed,created_at,intent,
            property_city,property_locality,property_address,id_proof_type,id_proof_number,approval_status
     FROM users WHERE id=$1`,[req.user.id]
  );
  const userRow = uRes.rows[0];
  const p = await query("SELECT * FROM profiles WHERE user_id=$1",[req.user.id]);
  const profileData = p.rows[0] || {};
  const user = {
    ...userRow,
    _id: String(userRow.id),
    id: String(userRow.id),
    phone: userRow.phone || "",
    avatarUrl: userRow.avatar,
    isProfileCompleted: true,
    is_profile_completed: true,
    intent: userRow.intent || profileData.looking_for || "both",
    lookingFor: userRow.intent || profileData.looking_for || "both",
    bio: profileData.bio || "",
    gender: profileData.gender || "",
    age: profileData.age || null,
    occupation: profileData.occupation || "",
    dob: profileData.dob || "",
    city: profileData.preferred_locations?.[0] || userRow.property_city || "",
    locality: profileData.preferred_locations?.[1] || userRow.property_locality || "",
    budgetMin: Number(profileData.budget_min || 0),
    budgetMax: Number(profileData.budget_max || 0),
    preferredLocations: profileData.preferred_locations || [],
    personalityTags: profileData.personality_tags || [],
    sleepSchedule: profileData.sleep_schedule || "",
    foodPreference: profileData.food_preference || "",
    cleanliness: profileData.cleanliness || "",
    smoking: profileData.smoking,
    pets: profileData.pets,
    propertyCity: userRow.property_city || "",
    propertyLocality: userRow.property_locality || "",
    propertyAddress: userRow.property_address || "",
    idProofType: userRow.id_proof_type || "",
    idProofNumber: userRow.id_proof_number || "",
    approvalStatus: userRow.approval_status || "approved",
    kyc: { status: userRow.is_kyc_verified ? "verified" : (userRow.approval_status === "pending" ? "pending" : "not_submitted") },
    preferences: {
      budgetMin: Number(profileData.budget_min || 0),
      budgetMax: Number(profileData.budget_max || 0),
      preferredLocations: profileData.preferred_locations || [],
      personalityTags: profileData.personality_tags || [],
      sleepSchedule: profileData.sleep_schedule || "",
      foodPreference: profileData.food_preference || "",
      cleanliness: profileData.cleanliness || "",
      smoking: profileData.smoking,
      pets: profileData.pets
    },
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
