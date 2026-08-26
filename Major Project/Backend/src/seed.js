import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB, initDB, query, pool } from "./config/db.js";

await connectDB();
await initDB();

console.log("Starting bulk database seed...");

const defaultPasswordHash = await bcrypt.hash("Password@123", 10);

// Cities & Localities for Indian context
const CITIES_LOCALITIES = [
  { city: "Delhi", localities: ["Laxmi Nagar", "Connaught Place", "Saket", "Dwarka", "Rohini", "Hauz Khas", "Karol Bagh"] },
  { city: "Noida", localities: ["Sector 62", "Sector 18", "Sector 137", "Sector 50", "Sector 76", "Greater Noida"] },
  { city: "Gurgaon", localities: ["Cyber City", "DLF Phase 3", "Sector 56", "Golf Course Road", "Sohna Road"] },
  { city: "Bengaluru", localities: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Electronic City"] },
  { city: "Jaipur", localities: ["Malviya Nagar", "Vaishali Nagar", "Raja Park", "Mansarovar", "C-Scheme"] },
  { city: "Mumbai", localities: ["Andheri West", "Bandra East", "Powai", "Thane", "Navi Mumbai"] },
];

const FIRST_NAMES = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Ananya", "Diya", "Sanya", "Priya", "Riya", "Aadhya", "Pari", "Anika", "Navya", "Angel",
  "Kavya", "Avani", "Myra", "Ira", "Ahana", "Rohan", "Vikram", "Rahul", "Amit", "Siddharth",
  "Neha", "Pooja", "Simran", "Sneha", "Tanya", "Akash", "Manish", "Gaurav", "Deepak", "Nikhil",
  "Kiran", "Kunal", "Saurabh", "Varun", "Yash", "Tanvi", "Megha", "Shreya", "Kavita", "Divya"
];

const LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Shah", "Mehta", "Joshi", "Jain",
  "Rao", "Nair", "Reddy", "Chowdhury", "Das", "Roy", "Banerjee", "Agarwal", "Bhatia", "Kapoor"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. Seed 2 Admins
console.log("Seeding 2 Admins...");
const admins = [
  ["Super Admin 1", "admin1@roomdekho.com", "admin"],
  ["Super Admin 2", "admin2@roomdekho.com", "admin"]
];
for (const [name, email, role] of admins) {
  await query(
    `INSERT INTO users(name, email, password_hash, role, is_kyc_verified)
     VALUES($1, $2, $3, $4, $5)
     ON CONFLICT(email) DO UPDATE SET password_hash = $3`,
    [name, email, defaultPasswordHash, role, true]
  );
}

// 2. Seed 50 Room Owners
console.log("Seeding 50 Room Owners...");
const ownerIds = [];
for (let i = 1; i <= 50; i++) {
  const firstName = getRandomItem(FIRST_NAMES);
  const lastName = getRandomItem(LAST_NAMES);
  const name = `${firstName} ${lastName} (Owner)`;
  const email = `owner${i}@roomdekho.com`;
  
  const res = await query(
    `INSERT INTO users(name, email, password_hash, role, is_kyc_verified)
     VALUES($1, $2, $3, $4, $5)
     ON CONFLICT(email) DO UPDATE SET name = $1
     RETURNING id`,
    [name, email, defaultPasswordHash, "owner", true]
  );
  ownerIds.push(res.rows[0].id);
}

// 3. Seed 50 Roommates
console.log("Seeding 50 Roommates...");
for (let i = 1; i <= 50; i++) {
  const firstName = getRandomItem(FIRST_NAMES);
  const lastName = getRandomItem(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const email = `roommate${i}@roomdekho.com`;
  
  await query(
    `INSERT INTO users(name, email, password_hash, role, is_kyc_verified)
     VALUES($1, $2, $3, $4, $5)
     ON CONFLICT(email) DO NOTHING`,
    [name, email, defaultPasswordHash, "roommate", true]
  );
}

// 4. Seed 50 Room Seekers / Roomfinders
console.log("Seeding 50 Room Finders / Seekers...");
for (let i = 1; i <= 50; i++) {
  const firstName = getRandomItem(FIRST_NAMES);
  const lastName = getRandomItem(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const email = `seeker${i}@roomdekho.com`;
  
  await query(
    `INSERT INTO users(name, email, password_hash, role, is_kyc_verified)
     VALUES($1, $2, $3, $4, $5)
     ON CONFLICT(email) DO NOTHING`,
    [name, email, defaultPasswordHash, "seeker", true]
  );
}

// Keep legacy demo accounts active
const demoAccounts = [
  ["Demo Owner", "owner@example.com", "owner"],
  ["Demo Roommate", "roommate@example.com", "roommate"],
  ["Demo Seeker", "seeker@example.com", "seeker"]
];
for (const [name, email, role] of demoAccounts) {
  await query(
    `INSERT INTO users(name, email, password_hash, role, is_kyc_verified)
     VALUES($1, $2, $3, $4, $5)
     ON CONFLICT(email) DO NOTHING`,
    [name, email, defaultPasswordHash, role, true]
  );
}

// 5. Seed Rooms for Owners (at least 1 room per owner = ~50+ rooms)
console.log("Seeding Rooms for Owners...");
const PROPERTY_TYPES = ["apartment", "flat", "independent"];
const ROOM_TYPES = ["private", "shared"];
const FURNISHING_TYPES = ["furnished", "semi-furnished", "unfurnished"];
const AMENITIES_LIST = ["WiFi", "AC", "Power Backup", "Washing Machine", "Geyser", "Parking", "Security", "Gym"];

for (let i = 0; i < ownerIds.length; i++) {
  const ownerId = ownerIds[i];
  const locationObj = getRandomItem(CITIES_LOCALITIES);
  const locality = getRandomItem(locationObj.localities);
  const rent = getRandomInt(5000, 25000);
  const deposit = rent * 2;
  const propType = getRandomItem(PROPERTY_TYPES);
  const roomType = getRandomItem(ROOM_TYPES);
  const furnishing = getRandomItem(FURNISHING_TYPES);
  const title = `Comfortable ${furnishing} ${roomType} room in ${locality}`;
  const description = `Beautiful ${propType} located in ${locality}, ${locationObj.city}. Close to public transport and market area.`;

  await query(
    `INSERT INTO rooms
     (owner_id, title, description, city, locality, rent, deposit, property_type, room_type, furnishing, amenities, images, is_verified)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [
      ownerId,
      title,
      description,
      locationObj.city,
      locality,
      rent,
      deposit,
      propType,
      roomType,
      furnishing,
      AMENITIES_LIST.slice(0, getRandomInt(3, 7)),
      [],
      true
    ]
  );
}

console.log("\n=======================================================");
console.log("🎉 SUCCESS! Supabase Database Seed Completed:");
console.log("-------------------------------------------------------");
console.log("🔹 Admins: 2 accounts (admin1@roomdekho.com, admin2@roomdekho.com)");
console.log("🔹 Room Owners: 50 accounts (owner1@roomdekho.com to owner50@roomdekho.com)");
console.log("🔹 Roommates: 50 accounts (roommate1@roomdekho.com to roommate50@roomdekho.com)");
console.log("🔹 Room Finders: 50 accounts (seeker1@roomdekho.com to seeker50@roomdekho.com)");
console.log("🔹 Rooms Created: 50+ property listings in Supabase!");
console.log("🔑 Default Password for all seeded accounts: Password@123");
console.log("=======================================================\n");

await pool.end();
