import { Router } from "express";
import { query } from "../config/db.js";
import { ok } from "../utils/response.js";

const r = Router();

// GET /roommates & /api/v1/roommates - Fetch real PostgreSQL seekers/roommates with profiles
r.get("/", async (req, res) => {
  try {
    const { city, budget, maxBudget, foodHabit, gender, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const conditions = ["u.role IN ('seeker', 'roommate')"];
    const params = [];
    let paramIdx = 1;

    if (city) {
      conditions.push(`EXISTS (SELECT 1 FROM unnest(p.preferred_locations) loc WHERE LOWER(loc) LIKE LOWER($${paramIdx}))`);
      params.push(`%${city}%`);
      paramIdx++;
    }

    const targetBudget = budget || maxBudget;
    if (targetBudget) {
      conditions.push(`(p.budget_max <= $${paramIdx} OR p.budget_min <= $${paramIdx})`);
      params.push(Number(targetBudget));
      paramIdx++;
    }

    if (foodHabit && foodHabit.toLowerCase() !== "any") {
      conditions.push(`LOWER(p.food_preference) = LOWER($${paramIdx})`);
      params.push(foodHabit);
      paramIdx++;
    }

    if (gender && gender.toLowerCase() !== "any") {
      conditions.push(`LOWER(p.gender) = LOWER($${paramIdx})`);
      params.push(gender);
      paramIdx++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countRes = await query(
      `SELECT COUNT(DISTINCT u.id) FROM users u LEFT JOIN profiles p ON p.user_id = u.id ${whereClause}`,
      params
    );
    const total = parseInt(countRes.rows[0]?.count || 0, 10);

    const dataRes = await query(
      `SELECT 
        u.id, 
        u.name, 
        u.avatar, 
        u.role, 
        u.is_kyc_verified, 
        u.created_at,
        p.bio, 
        p.gender, 
        p.age, 
        p.occupation, 
        p.budget_min, 
        p.budget_max, 
        p.preferred_locations, 
        p.personality_tags, 
        p.sleep_schedule, 
        p.food_preference, 
        p.cleanliness, 
        p.smoking, 
        p.pets
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, Number(limit), offset]
    );

    const items = dataRes.rows.map((row) => ({
      _id: row.id,
      id: row.id,
      name: row.name,
      avatar: row.avatar,
      isKycVerified: row.is_kyc_verified,
      bio: row.bio || "Looking for a friendly roommate to share an apartment.",
      gender: row.gender || "Any",
      age: row.age || 23,
      occupation: row.occupation || "Working Professional",
      budgetMin: Number(row.budget_min || 5000),
      budgetMax: Number(row.budget_max || 15000),
      preferredLocations: row.preferred_locations || ["Delhi", "Noida", "Gurgaon"],
      personalityTags: row.personality_tags || ["Chill", "Clean", "Friendly"],
      sleepSchedule: row.sleep_schedule || "Night Owl",
      foodPreference: row.food_preference || "Vegetarian",
      cleanliness: row.cleanliness || "High",
      user: {
        _id: row.id,
        name: row.name,
        avatar: row.avatar,
        isKycVerified: row.is_kyc_verified,
      },
    }));

    ok(res, 200, "Roommates fetched successfully", {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (err) {
    console.error("Fetch roommates error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default r;
