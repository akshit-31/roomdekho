import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB, initDB, query, pool } from "./config/db.js";

await connectDB();
await initDB();

console.log("🧹 Completely purging all old data from database...");
await query("DELETE FROM messages");
await query("DELETE FROM conversations");
await query("DELETE FROM visits");
await query("DELETE FROM favorites");
await query("DELETE FROM reviews");
await query("DELETE FROM rooms");
await query("DELETE FROM profiles");
await query("DELETE FROM users");

console.log("✨ Initializing clean production database seed...");

// Hash Password@123 once for all accounts for maximum speed
const defaultPasswordHash = await bcrypt.hash("Password@123", 10);

// Curated high-res Unsplash photo collections for real estate
const BEDROOMS = [
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502005229762-ee1b2b93e007?auto=format&fit=crop&w=1200&q=80"
];

const LIVING_ROOMS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80"
];

const KITCHEN_BALCONIES = [
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80"
];

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
];

// 1. Seed 2 Super Admins (admin1@roomdekho.com, admin2@roomdekho.com)
console.log("Seeding 2 Super Admins...");
const adminEmails = ["admin1@roomdekho.com", "admin2@roomdekho.com"];
for (let i = 0; i < adminEmails.length; i++) {
  await query(
    `INSERT INTO users(name, email, password_hash, role, is_kyc_verified, approval_status, is_profile_completed, avatar)
     VALUES($1, $2, $3, 'admin', true, 'approved', true, $4)`,
    [`Super Admin ${i + 1}`, adminEmails[i], defaultPasswordHash, AVATARS[i]]
  );
}

// City coordinates mapping for exact GPS tagging
const CITIES = [
  { city: "Bareilly", locality: "Civil Lines", lat: 28.3670, lng: 79.4304 },
  { city: "Bareilly", locality: "Invertis Highway", lat: 28.3312, lng: 79.4721 },
  { city: "Bareilly", locality: "Janakpuri", lat: 28.3540, lng: 79.4180 },
  { city: "Bareilly", locality: "Bareilly Cantt", lat: 28.3490, lng: 79.4410 },
  { city: "Bareilly", locality: "Rajendra Nagar", lat: 28.3750, lng: 79.4210 },
  { city: "Bareilly", locality: "DD Puram", lat: 28.3710, lng: 79.4120 },
  { city: "Noida", locality: "Sector 62", lat: 28.6280, lng: 77.3649 },
  { city: "Noida", locality: "Sector 18", lat: 28.5708, lng: 77.3271 },
  { city: "Noida", locality: "Sector 137", lat: 28.5132, lng: 77.4082 },
  { city: "Noida", locality: "Sector 76", lat: 28.5720, lng: 77.3820 },
  { city: "Delhi", locality: "Hauz Khas", lat: 28.5494, lng: 77.2001 },
  { city: "Delhi", locality: "Saket", lat: 28.5245, lng: 77.2066 },
  { city: "Delhi", locality: "Karol Bagh", lat: 28.6514, lng: 77.1907 },
  { city: "Delhi", locality: "Lajpat Nagar", lat: 28.5677, lng: 77.2433 },
  { city: "Gurgaon", locality: "Cyber City", lat: 28.4912, lng: 77.0945 },
  { city: "Gurgaon", locality: "Golf Course Road", lat: 28.4410, lng: 77.1020 },
  { city: "Gurgaon", locality: "DLF Phase 3", lat: 28.4890, lng: 77.0980 },
  { city: "Bengaluru", locality: "Koramangala", lat: 12.9352, lng: 77.6245 },
  { city: "Bengaluru", locality: "Indiranagar", lat: 12.9784, lng: 77.6408 },
  { city: "Bengaluru", locality: "HSR Layout", lat: 12.9121, lng: 77.6446 },
  { city: "Mumbai", locality: "Bandra West", lat: 19.0596, lng: 72.8295 },
  { city: "Mumbai", locality: "Powai", lat: 19.1176, lng: 72.9060 },
  { city: "Mumbai", locality: "Andheri East", lat: 19.1136, lng: 72.8697 },
  { city: "Jaipur", locality: "C-Scheme", lat: 26.9077, lng: 75.8056 },
  { city: "Jaipur", locality: "Malviya Nagar", lat: 26.8520, lng: 75.8160 },
  { city: "Lucknow", locality: "Gomti Nagar", lat: 26.8500, lng: 80.9980 },
  { city: "Lucknow", locality: "Hazratganj", lat: 26.8480, lng: 80.9450 }
];

const OWNER_NAMES = [
  "Akshit Sharma", "Sunil Verma", "Tanya Verma", "Megha Rao", "Rajesh Kumar",
  "Ananya Kapoor", "Vikram Malhotra", "Saurabh Agarwal", "Pooja Singhania", "Deepak Choudhary",
  "Krishna Das", "Rohit Nair", "Farhan Merchant", "Divya Shah", "Digvijay Rathore",
  "Alok Mishra", "Amitabh Saxena", "Naveen Jindal", "Pankaj Tiwari", "Vandana Batra",
  "Manoj Rawat", "Rekha Aggarwal", "Sanjay Gupta", "Neelam Pandey", "Arun Bhatnagar",
  "Geeta Kaushik", "Vijay Chauhan", "Ritu Singhal", "Harish Oberoi", "Sunita Mathur",
  "Kamal Joshi", "Preeti Sethi", "Ashok Tyagi", "Bhavna Mehra", "Dinesh Khandelwal",
  "Shobha Rani", "Lalit Mohan", "Poonam Goel", "Satish Bhardwaj", "Madhu Bala",
  "Rajendra Prasad", "Kavita Bajpai", "Mahesh Tripathi", "Sudha Murthy", "Girish Chawla",
  "Anita Rastogi", "Mukesh Agnihotri", "Sarojini Naidu", "Hemant Mishra", "Sushma Swaraj"
];

// 2. Seed 50 Room Owners (owner1@roomdekho.com to owner50@roomdekho.com)
console.log("Seeding 50 Room Owners (owner1@roomdekho.com to owner50@roomdekho.com)...");
const ownerIds = [];

for (let i = 1; i <= 50; i++) {
  const email = `owner${i}@roomdekho.com`;
  const name = OWNER_NAMES[i - 1] || `Property Host ${i}`;
  const cityObj = CITIES[(i - 1) % CITIES.length];
  const phone = `+91 ${9800000000 + i * 137}`;
  const avatar = AVATARS[(i - 1) % AVATARS.length];

  const res = await query(
    `INSERT INTO users(name, email, password_hash, role, phone, is_kyc_verified, approval_status, is_profile_completed, property_city, property_locality, property_address, avatar)
     VALUES($1, $2, $3, 'owner', $4, true, 'approved', true, $5, $6, $7, $8)
     RETURNING id`,
    [
      name,
      email,
      defaultPasswordHash,
      phone,
      cityObj.city,
      cityObj.locality,
      `${i * 12}, ${cityObj.locality} Main Road, ${cityObj.city}`,
      avatar
    ]
  );
  ownerIds.push({ id: res.rows[0].id, name, email, cityObj });
}

// Also seed alias owner111@roomdekho.com mapped to Akshit Sharma for backward-compatibility
await query(
  `INSERT INTO users(name, email, password_hash, role, phone, is_kyc_verified, approval_status, is_profile_completed, property_city, property_locality, property_address, avatar)
   VALUES('Akshit Sharma', 'owner111@roomdekho.com', $1, 'owner', '+91 98765 43210', true, 'approved', true, 'Bareilly', 'Civil Lines', 'House 42, Civil Lines Road, Bareilly', $2)
   ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'owner', is_kyc_verified = true, approval_status = 'approved', is_profile_completed = true`,
  [defaultPasswordHash, AVATARS[0]]
);

// 3. Seed Production Listings across the 50 Owners
console.log("Seeding 50+ Curated Multi-Image Listings across Room Owners...");

const ROOM_TEMPLATES = [
  {
    title: "Spacious Sunlit 1BHK with Modular Kitchen & Balcony",
    description: "Fully furnished 1BHK apartment with 24x7 security, high speed WiFi, dedicated parking, and peaceful surroundings. Close to shopping centers and transit.",
    rent: 7500,
    deposit: 15000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished"
  },
  {
    title: "Affordable Furnished Room near Highway & Universities",
    description: "Peaceful environment for students and working professionals. Inverter power backup, RO water, attached clean washroom, and daily cleaning.",
    rent: 5500,
    deposit: 10000,
    propertyType: "independent",
    roomType: "private",
    furnishing: "furnished"
  },
  {
    title: "Cozy 2BHK Shared Room with Garden View & Inverter",
    description: "Gated society, serene view, modern kitchen with refrigerator and microwave. Very safe locality with friendly neighborhood.",
    rent: 6200,
    deposit: 12000,
    propertyType: "flat",
    roomType: "shared",
    furnishing: "furnished"
  },
  {
    title: "Quiet Independent Studio Room near Metro & Highway",
    description: "Independent studio with separate entry, wide balcony, geyser, study desk, and high speed fiber connection.",
    rent: 8000,
    deposit: 16000,
    propertyType: "studio",
    roomType: "private",
    furnishing: "semi-furnished"
  },
  {
    title: "Luxury Master Bedroom with Attached Bath & AC",
    description: "Premium society flat with clubhouse, swimming pool, and high floor skyline view. Fully air conditioned with designer wardrobe.",
    rent: 14500,
    deposit: 29000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished"
  },
  {
    title: "Executive 1BHK Studio near Tech Parks & Metro",
    description: "Designed for corporate professionals. Power backup, lift, dedicated covered two-wheeler and car parking, walking distance to metro station.",
    rent: 16000,
    deposit: 32000,
    propertyType: "flat",
    roomType: "private",
    furnishing: "furnished"
  }
];

const AMENITIES_POOL = [
  ["WiFi", "AC", "Power Backup", "Geyser", "RO Water", "Parking"],
  ["WiFi", "Washing Machine", "Geyser", "Power Backup", "Balcony"],
  ["WiFi", "AC", "Gym", "Power Backup", "CCTV", "Lift", "Security"],
  ["WiFi", "Geyser", "RO Water", "Power Backup", "Study Table"],
  ["WiFi", "AC", "TV", "Refrigerator", "Balcony", "Clubhouse"]
];

for (let i = 0; i < ownerIds.length; i++) {
  const o = ownerIds[i];
  const tmpl = ROOM_TEMPLATES[i % ROOM_TEMPLATES.length];
  const amens = AMENITIES_POOL[i % AMENITIES_POOL.length];
  const bedImg = BEDROOMS[i % BEDROOMS.length];
  const livImg = LIVING_ROOMS[i % LIVING_ROOMS.length];
  const kitImg = KITCHEN_BALCONIES[i % KITCHEN_BALCONIES.length];
  const extraBed = BEDROOMS[(i + 3) % BEDROOMS.length];

  // Randomise status: first 46 published, 4 pending for admin moderation testing
  const status = i < 46 ? "published" : "pending";
  const isVerified = status === "published";

  // Jitter coordinates slightly around city center
  const latOffset = (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.04;
  const lngOffset = (((i * 49297 + 9301) % 233280) / 233280 - 0.5) * 0.04;
  const lat = Number((o.cityObj.lat + latOffset).toFixed(6));
  const lng = Number((o.cityObj.lng + lngOffset).toFixed(6));

  await query(
    `INSERT INTO rooms(
       owner_id, title, description, city, locality, address, rent, deposit,
       property_type, room_type, furnishing, gender_preference, amenities,
       images, status, is_verified, views, latitude, longitude, created_at
     )
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'any', $12, $13, $14, $15, $16, $17, $18, now() - ($19 || ' hours')::interval)`,
    [
      o.id,
      `${tmpl.title} in ${o.cityObj.locality}`,
      tmpl.description,
      o.cityObj.city,
      o.cityObj.locality,
      `${(i + 1) * 7}, ${o.cityObj.locality}, ${o.cityObj.city}`,
      tmpl.rent + (i % 5) * 500,
      tmpl.deposit + (i % 5) * 1000,
      tmpl.propertyType,
      tmpl.roomType,
      tmpl.furnishing,
      amens,
      [bedImg, livImg, kitImg, extraBed],
      status,
      isVerified,
      80 + (i * 7) % 150,
      lat,
      lng,
      (i * 3)
    ]
  );
}

// 4. Seed 100 Users (user1@roomdekho.com to user100@roomdekho.com)
console.log("Seeding 100 Users (user1@roomdekho.com to user100@roomdekho.com)...");

const FIRST_NAMES_MALE = [
  "Aman", "Rohan", "Rahul", "Kunal", "Harsh", "Aditya", "Ayush", "Varun",
  "Kartik", "Shivam", "Nikhil", "Abhishek", "Prateek", "Gaurav", "Siddharth",
  "Manish", "Deepak", "Yash", "Ankit", "Arjun", "Vishal", "Mayank", "Ravi", "Mohit", "Tarun"
];

const FIRST_NAMES_FEMALE = [
  "Priya", "Sneha", "Ananya", "Ishita", "Meera", "Pooja", "Neha", "Divya",
  "Kavya", "Rhea", "Simran", "Aakanksha", "Tanya", "Swati", "Shreya",
  "Tanvi", "Akanksha", "Bhavna", "Kritika", "Deepika", "Nandini", "Shruti", "Pallavi", "Preeti", "Aishwarya"
];

const LAST_NAMES = [
  "Sharma", "Verma", "Patel", "Sen", "Kapoor", "Roy", "Vardhan", "Joshi",
  "Gupta", "Malhotra", "Saxena", "Bhatia", "Choudhary", "Singh", "Nair",
  "Das", "Agarwal", "Rathore", "Mishra", "Pandey", "Trivedi", "Shukla", "Bansal", "Mehta", "Reddy"
];

const OCCUPATIONS = [
  "Software Engineer", "UI/UX Designer", "Data Scientist", "Chartered Accountant",
  "Marketing Manager", "Financial Analyst", "Medical Student", "Civil Services Aspirant",
  "HR Specialist", "Business Consultant", "Content Strategist", "Product Manager",
  "Legal Associate", "Architect", "Research Fellow"
];

const USER_PREF_CITIES = [
  "Bareilly", "Noida", "Delhi", "Gurgaon", "Bengaluru", "Mumbai", "Jaipur", "Lucknow"
];

const FOOD_PREFS = ["Vegetarian", "Non-Vegetarian", "Vegetarian", "Vegetarian", "Vegan"];
const SLEEP_PREFS = ["Night Owl", "Early Bird", "Flexible", "Early Bird", "Night Owl"];
const CLEAN_PREFS = ["Spotless", "Very Clean", "High", "Clean"];
const INTENTS = ["both", "both", "find_roommate", "both", "find_room"];

const userRecords = [];

for (let i = 1; i <= 100; i++) {
  const isFemale = i % 2 === 0;
  const firstName = isFemale
    ? FIRST_NAMES_FEMALE[(i - 1) % FIRST_NAMES_FEMALE.length]
    : FIRST_NAMES_MALE[(i - 1) % FIRST_NAMES_MALE.length];
  const lastName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const email = `user${i}@roomdekho.com`;
  const avatar = AVATARS[(i - 1) % AVATARS.length];
  const intent = INTENTS[(i - 1) % INTENTS.length];
  const role = intent === "find_roommate" ? "roommate" : "seeker";
  const city = USER_PREF_CITIES[(i - 1) % USER_PREF_CITIES.length];
  const occupation = OCCUPATIONS[(i - 1) % OCCUPATIONS.length];
  const age = 21 + (i % 12);
  const budgetMin = 4000 + (i % 6) * 1000;
  const budgetMax = 8000 + (i % 8) * 2000;
  const food = FOOD_PREFS[i % FOOD_PREFS.length];
  const sleep = SLEEP_PREFS[i % SLEEP_PREFS.length];
  const cleanliness = CLEAN_PREFS[i % CLEAN_PREFS.length];

  const bio = isFemale
    ? `Hi, I am ${firstName}! Working as a ${occupation} in ${city}. Looking for a clean, peaceful apartment with like-minded flatmates.`
    : `Hey there! ${firstName} here, ${occupation} based in ${city}. Value cleanliness, mutual respect, and quiet evenings. Let's connect!`;

  const uRes = await query(
    `INSERT INTO users(name, email, password_hash, role, avatar, is_kyc_verified, approval_status, is_profile_completed, intent, created_at)
     VALUES($1, $2, $3, $4, $5, true, 'approved', true, $6, now() - ($7 || ' hours')::interval)
     RETURNING id`,
    [fullName, email, defaultPasswordHash, role, avatar, intent, i]
  );
  const uId = uRes.rows[0].id;

  await query(
    `INSERT INTO profiles(user_id, bio, gender, age, occupation, preferred_locations, budget_min, budget_max, food_preference, sleep_schedule, cleanliness, looking_for)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      uId,
      bio,
      isFemale ? "female" : "male",
      age,
      occupation,
      [city],
      budgetMin,
      budgetMax,
      food,
      sleep,
      cleanliness,
      intent
    ]
  );

  userRecords.push({ id: uId, name: fullName, email });
}

// 5. Seed Real Interactions (Enquiries & Messages) for owner1@roomdekho.com
console.log("Seeding real visits and chat messages for owner1@roomdekho.com...");
const owner1 = ownerIds[0];
const owner1Rooms = (await query("SELECT id FROM rooms WHERE owner_id = $1", [owner1.id])).rows;
const user1 = userRecords[0];
const user2 = userRecords[1];

if (owner1Rooms.length > 0 && user1) {
  // Visits
  await query(
    `INSERT INTO visits(room_id, seeker_id, owner_id, scheduled_at, status, note)
     VALUES
     ($1, $2, $3, now() + interval '1 day', 'confirmed', 'Hi! I saw your Bareilly listing and would love to visit tomorrow morning.'),
     ($1, $4, $3, now() + interval '3 days', 'confirmed', 'Hello! Interested in inspecting the room this Sunday.')`,
    [owner1Rooms[0].id, user1.id, owner1.id, user2.id]
  );

  // Conversation between owner1 and user1
  const u1 = Math.min(Number(owner1.id), Number(user1.id));
  const u2 = Math.max(Number(owner1.id), Number(user1.id));
  const convRes = await query(
    `INSERT INTO conversations(user_one, user_two, created_at, updated_at)
     VALUES($1, $2, now() - interval '2 hours', now())
     RETURNING id`,
    [u1, u2]
  );
  const convId = convRes.rows[0].id;

  await query(
    `INSERT INTO messages(conversation_id, sender_id, body, created_at)
     VALUES
     ($1, $2, 'Namaste! I saw your Bareilly Civil Lines room listing on RoomDekho. Is it still available?', now() - interval '2 hours'),
     ($1, $3, 'Hello! Yes, it is fully furnished, verified, and available for immediate move-in. When would you like to visit?', now() - interval '1 hour'),
     ($1, $2, 'Great! I will visit tomorrow at 11:00 AM. Thank you!', now() - interval '30 minutes')`,
    [convId, user1.id, owner1.id]
  );
}

// Ensure all seeded users, owners, and admins have is_profile_completed = true
await query("UPDATE users SET is_profile_completed = true");

console.log("\n=======================================================");
console.log("🎉 PRODUCTION DATABASE SEED COMPLETED SUCCESSFULLY!");
console.log("-------------------------------------------------------");
console.log("🔹 2 Super Admins: admin1@roomdekho.com, admin2@roomdekho.com [Password@123]");
console.log("🔹 50 Room Owners: owner1@roomdekho.com to owner50@roomdekho.com [Password@123]");
console.log("🔹 100 Seekers/Roommates: user1@roomdekho.com to user100@roomdekho.com [Password@123]");
console.log("🔹 50+ Curated Listings with Real Details, GPS & High-Res Unsplash Galleries!");
console.log("🔹 Every User has complete profile, bio, lifestyle preferences & avatar!");
console.log("=======================================================\n");

await pool.end();
process.exit(0);
