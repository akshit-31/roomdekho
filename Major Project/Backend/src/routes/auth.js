import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { signAccess, signRefresh } from "../utils/auth.js";
import { auth } from "../middleware/auth.js";
import { ok } from "../utils/response.js";
const router=Router();
const setRefreshCookie = (res, token) =>
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

router.post("/register", async (req,res)=>{
  const {
    name,
    email,
    password,
    role="seeker",
    phone,
    gender,
    age,
    dob,
    occupation,
    bio,
    city,
    locality,
    preferredLocations,
    budgetMin,
    budgetMax,
    foodPreference,
    sleepSchedule,
    cleanliness,
    smoking,
    pets,
    propertyCity,
    propertyLocality,
    propertyAddress,
    idProofType,
    idProofNumber,
    intent="both"
  } = req.body;

  if(!name||!email||!password) return res.status(400).json({success:false,message:"Name, email and password are required"});
  if(password.length<8) return res.status(400).json({success:false,message:"Password must contain at least 8 characters"});
  const exists=await query("SELECT id FROM users WHERE email=$1",[email.toLowerCase()]);
  if(exists.rows[0]) return res.status(409).json({success:false,message:"Email already registered"});
  const hash=await bcrypt.hash(password,12);
  const safeRole=["seeker","roommate","owner"].includes(role)?role:"seeker";
  const safeIntent=["find_room","find_roommate","both"].includes(intent)?intent:"both";

  const parsedAge = age ? parseInt(age, 10) : null;
  const parsedMin = budgetMin ? Number(budgetMin) : null;
  const parsedMax = budgetMax ? Number(budgetMax) : null;
  const finalCity = propertyCity || city || "";
  const finalLocality = propertyLocality || locality || "";

  // 1. Room Owner verification flow (Requires Location & ID, Pending Admin Approval)
  if (safeRole === "owner") {
    if (!phone) {
      return res.status(400).json({success:false, message:"Phone number is required for Room Owner verification"});
    }
    if (!finalCity || !propertyAddress) {
      return res.status(400).json({success:false, message:"Property city and address are required for location verification"});
    }

    const {rows}=await query(
      `INSERT INTO users(name, email, password_hash, role, phone, property_city, property_locality, property_address, id_proof_type, id_proof_number, approval_status, is_kyc_verified, is_profile_completed)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', false, true)
       RETURNING id, name, email, role, phone, property_city, property_locality, property_address, id_proof_type, id_proof_number, approval_status, is_kyc_verified, is_profile_completed, created_at`,
      [
        name,
        email.toLowerCase(),
        hash,
        "owner",
        phone,
        finalCity,
        finalLocality,
        propertyAddress,
        idProofType || "Aadhaar Card",
        idProofNumber || ""
      ]
    );

    const user = rows[0];

    // Create profile entry for owner
    const ownerLocs = [finalCity, finalLocality].filter(Boolean);
    await query(
      `INSERT INTO profiles(user_id, bio, gender, age, occupation, dob, preferred_locations)
       VALUES($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT(user_id) DO UPDATE SET
         bio=COALESCE(EXCLUDED.bio, profiles.bio),
         gender=COALESCE(EXCLUDED.gender, profiles.gender),
         age=COALESCE(EXCLUDED.age, profiles.age),
         occupation=COALESCE(EXCLUDED.occupation, profiles.occupation),
         dob=COALESCE(EXCLUDED.dob, profiles.dob),
         preferred_locations=COALESCE(EXCLUDED.preferred_locations, profiles.preferred_locations),
         updated_at=now()`,
      [user.id, bio || `Property Owner managing rooms in ${finalCity}`, gender || null, parsedAge, occupation || "Property Owner", dob || null, ownerLocs]
    );

    const safeOwner = {
      ...user,
      _id: String(user.id),
      id: String(user.id),
      isProfileCompleted: true,
      gender: gender || "",
      age: parsedAge,
      dob: dob || "",
      occupation: occupation || "Property Owner",
      bio: bio || `Property Owner managing rooms in ${finalCity}`,
      city: finalCity,
      locality: finalLocality,
      propertyCity: finalCity,
      propertyLocality: finalLocality,
      propertyAddress: propertyAddress,
      idProofType: idProofType || "Aadhaar Card",
      idProofNumber: idProofNumber || "",
      approvalStatus: "pending",
      kyc: { status: "pending" }
    };

    return ok(res, 201, "Room Owner registration submitted! Your account is pending Admin approval for your property location. You will receive access once approved by admin.", {
      pendingApproval: true,
      user: safeOwner
    });
  }

  // 2. Seeker / Roommate direct instant access
  const locs = Array.isArray(preferredLocations)
    ? preferredLocations
    : [city, locality].filter(Boolean);

  const hasProfileDetails = Boolean(gender || occupation || city || phone || budgetMax || bio);
  const isComplete = hasProfileDetails;

  const {rows}=await query(
    `INSERT INTO users(name,email,password_hash,role,phone,approval_status,is_kyc_verified,is_profile_completed,intent)
     VALUES($1,$2,$3,$4,$5,'approved',true,$6,$7)
     RETURNING id,name,email,role,phone,avatar,is_kyc_verified,approval_status,is_profile_completed,intent,created_at`,
    [name, email.toLowerCase(), hash, safeRole, phone || null, isComplete, safeIntent]
  );
  const user=rows[0];

  // Save profile record immediately
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
      sleep_schedule = COALESCE(EXCLUDED.sleep_schedule, profiles.sleep_schedule),
      food_preference = COALESCE(EXCLUDED.food_preference, profiles.food_preference),
      cleanliness = COALESCE(EXCLUDED.cleanliness, profiles.cleanliness),
      smoking = COALESCE(EXCLUDED.smoking, profiles.smoking),
      pets = COALESCE(EXCLUDED.pets, profiles.pets),
      looking_for = COALESCE(EXCLUDED.looking_for, profiles.looking_for),
      updated_at = now()`,
    [
      user.id,
      bio || (finalCity ? `Looking for room/roommates in ${finalCity}` : "RoomDekho member"),
      gender || null,
      parsedAge,
      occupation || "Professional",
      dob || null,
      parsedMin || 0,
      parsedMax || 0,
      locs,
      [],
      sleepSchedule || "Flexible",
      foodPreference || "Vegetarian",
      cleanliness || "High",
      smoking !== undefined ? Boolean(smoking) : null,
      pets !== undefined ? Boolean(pets) : null,
      safeIntent
    ]
  );

  const safeUser = {
    ...user,
    _id: String(user.id),
    id: String(user.id),
    phone: user.phone || phone || "",
    isProfileCompleted: isComplete,
    intent: safeIntent,
    lookingFor: safeIntent,
    gender: gender || "",
    age: parsedAge,
    dob: dob || "",
    occupation: occupation || "Professional",
    bio: bio || (finalCity ? `Looking for room/roommates in ${finalCity}` : "RoomDekho member"),
    city: locs[0] || "",
    locality: locs[1] || "",
    preferredLocations: locs,
    budgetMin: parsedMin || 0,
    budgetMax: parsedMax || 0,
    foodPreference: foodPreference || "Vegetarian",
    sleepSchedule: sleepSchedule || "Flexible",
    cleanliness: cleanliness || "High",
    smoking: smoking !== undefined ? Boolean(smoking) : false,
    pets: pets !== undefined ? Boolean(pets) : false,
    kyc: { status: "verified" },
    preferences: {
      budgetMin: parsedMin || 0,
      budgetMax: parsedMax || 0,
      preferredLocations: locs,
      personalityTags: [],
      sleepSchedule: sleepSchedule || "Flexible",
      foodPreference: foodPreference || "Vegetarian",
      cleanliness: cleanliness || "High",
      smoking: smoking !== undefined ? Boolean(smoking) : false,
      pets: pets !== undefined ? Boolean(pets) : false,
    }
  };

  const refresh=signRefresh(safeUser);
  setRefreshCookie(res,refresh);
  return ok(res,201,"Registration successful",{user:safeUser,accessToken:signAccess(safeUser)});
});

router.post("/login",async(req,res)=>{
  const {email,password,role}=req.body;
  const {rows}=await query("SELECT * FROM users WHERE email=$1",[email?.toLowerCase()?.trim()]);
  const user=rows[0];
  if(!user || !(await bcrypt.compare(password||"",user.password_hash))) return res.status(401).json({success:false,message:"Invalid email or password"});
  if(user.is_blocked) return res.status(403).json({success:false,message:"Account is blocked by administration"});

  // Role validation: Prevent User login from Owner tab, and Owner login from User tab
  if (role) {
    const requested = String(role).toLowerCase().trim();
    if (requested === "owner") {
      if (user.role !== "owner") {
        return res.status(403).json({
          success: false,
          roleMismatch: true,
          requestedRole: "owner",
          actualRole: user.role,
          message: "Yeh account User (Room Seeker) ke roop mein registered hai. Kripya 'User' tab select karke login karein."
        });
      }
    } else if (requested === "seeker" || requested === "user") {
      if (user.role === "owner") {
        return res.status(403).json({
          success: false,
          roleMismatch: true,
          requestedRole: "seeker",
          actualRole: "owner",
          message: "Yeh account Room Owner ke roop mein registered hai. Kripya 'Room Owner' tab select karke login karein."
        });
      }
      if (user.role === "admin") {
        return res.status(403).json({
          success: false,
          roleMismatch: true,
          requestedRole: "seeker",
          actualRole: "admin",
          message: "Yeh account Administrator privileges rakhta hai. Kripya Admin portal se login karein."
        });
      }
    } else if (requested === "admin") {
      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          roleMismatch: true,
          requestedRole: "admin",
          actualRole: user.role,
          message: "Access Denied: Is account ke paas administrator privileges nahi hain."
        });
      }
    }
  }

  // Owner verification checks
  if (user.role === "owner" && user.approval_status === "pending") {
    return res.status(403).json({
      success: false,
      isPendingApproval: true,
      message: "Your Room Owner account is currently under review by our Admin team. Property location verification is in progress. You will be able to log in once approved."
    });
  }
  if (user.role === "owner" && user.approval_status === "rejected") {
    return res.status(403).json({
      success: false,
      message: "Your Room Owner application has been rejected by the admin team. Please contact support at support@roomdekho.com."
    });
  }

  await query("UPDATE users SET last_login_at=now(),updated_at=now() WHERE id=$1",[user.id]);
  const p = await query("SELECT * FROM profiles WHERE user_id=$1",[user.id]);
  const profileData = p.rows[0] || {};
  const isComplete = Boolean(user.is_profile_completed || (profileData.gender && profileData.occupation));
  const safe={
    id:user.id,
    _id:String(user.id),
    name:user.name,
    email:user.email,
    phone:user.phone || "",
    role:user.role,
    avatar:user.avatar,
    avatarUrl:user.avatar,
    is_kyc_verified:user.is_kyc_verified,
    approval_status:user.approval_status,
    approvalStatus:user.approval_status || "approved",
    is_profile_completed:isComplete,
    isProfileCompleted:isComplete,
    intent: user.intent || profileData.looking_for || "both",
    lookingFor: user.intent || profileData.looking_for || "both",
    gender:profileData.gender || "",
    age:profileData.age || null,
    dob:profileData.dob || "",
    occupation:profileData.occupation || "",
    bio:profileData.bio || "",
    city:profileData.preferred_locations?.[0] || user.property_city || "",
    locality:profileData.preferred_locations?.[1] || user.property_locality || "",
    preferredLocations:profileData.preferred_locations || [],
    budgetMin:Number(profileData.budget_min || 0),
    budgetMax:Number(profileData.budget_max || 0),
    foodPreference:profileData.food_preference || "",
    sleepSchedule:profileData.sleep_schedule || "",
    cleanliness:profileData.cleanliness || "",
    smoking:profileData.smoking,
    pets:profileData.pets,
    propertyCity:user.property_city || "",
    propertyLocality:user.property_locality || "",
    propertyAddress:user.property_address || "",
    idProofType:user.id_proof_type || "",
    idProofNumber:user.id_proof_number || "",
    kyc: { status: user.is_kyc_verified ? "verified" : (user.approval_status === "pending" ? "pending" : "not_submitted") },
    preferences: {
      budgetMin:Number(profileData.budget_min || 0),
      budgetMax:Number(profileData.budget_max || 0),
      preferredLocations:profileData.preferred_locations || [],
      personalityTags:profileData.personality_tags || [],
      sleepSchedule:profileData.sleep_schedule || "",
      foodPreference:profileData.food_preference || "",
      cleanliness:profileData.cleanliness || "",
      smoking:profileData.smoking,
      pets:profileData.pets
    }
  };
  const refresh=signRefresh(safe);
  setRefreshCookie(res,refresh);
  return ok(res,200,"Login successful",{user:safe,accessToken:signAccess(safe)});
});

router.post("/refresh",async(req,res)=>{
  const token=req.body?.refreshToken || req.cookies?.refreshToken;
  if(!token) return res.status(401).json({success:false,message:"Refresh token required"});
  try {
    const p=jwt.verify(token,process.env.JWT_REFRESH_SECRET);
    const {rows}=await query(
      `SELECT id,name,email,phone,role,avatar,is_kyc_verified,approval_status,is_profile_completed,intent,
              property_city,property_locality,property_address,id_proof_type,id_proof_number
       FROM users WHERE id=$1 AND is_blocked=false`,[p.userId]
    );
    if(!rows[0]) throw new Error();
    const u = rows[0];
    const prof = await query("SELECT * FROM profiles WHERE user_id=$1",[u.id]);
    const profileData = prof.rows[0] || {};
    const isComplete = Boolean(u.is_profile_completed || (profileData.gender && profileData.occupation));
    const safeUser = {
      ...u,
      _id: String(u.id),
      phone: u.phone || "",
      avatarUrl: u.avatar,
      isProfileCompleted: isComplete,
      is_profile_completed: isComplete,
      approvalStatus: u.approval_status || "approved",
      intent: u.intent || profileData.looking_for || "both",
      lookingFor: u.intent || profileData.looking_for || "both",
      gender: profileData.gender || "",
      age: profileData.age || null,
      dob: profileData.dob || "",
      occupation: profileData.occupation || "",
      bio: profileData.bio || "",
      city: profileData.preferred_locations?.[0] || u.property_city || "",
      locality: profileData.preferred_locations?.[1] || u.property_locality || "",
      preferredLocations: profileData.preferred_locations || [],
      budgetMin: Number(profileData.budget_min || 0),
      budgetMax: Number(profileData.budget_max || 0),
      foodPreference: profileData.food_preference || "",
      sleepSchedule: profileData.sleep_schedule || "",
      cleanliness: profileData.cleanliness || "",
      smoking: profileData.smoking,
      pets: profileData.pets,
      propertyCity: u.property_city || "",
      propertyLocality: u.property_locality || "",
      propertyAddress: u.property_address || "",
      idProofType: u.id_proof_type || "",
      idProofNumber: u.id_proof_number || "",
      kyc: { status: u.is_kyc_verified ? "verified" : (u.approval_status === "pending" ? "pending" : "not_submitted") },
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
      }
    };
    return ok(res,200,"Token refreshed",{accessToken:signAccess(safeUser), user: safeUser});
  } catch { return res.status(401).json({success:false,message:"Invalid refresh token"}); }
});

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

router.post("/logout", (req, res) => {
  clearRefreshCookie(res);
  return ok(res, 200, "Logged out successfully");
});

router.get("/logout", (req, res) => {
  clearRefreshCookie(res);
  return ok(res, 200, "Logged out successfully");
});
router.post("/kyc",auth,async(req,res)=>{
  await query("UPDATE users SET is_kyc_verified=true,updated_at=now() WHERE id=$1",[req.user.id]);
  ok(res,200,"KYC submitted",{verified:true});
});
router.get("/me",auth,async(req,res)=>ok(res,200,"Profile fetched",{user:req.user}));
export default router;
