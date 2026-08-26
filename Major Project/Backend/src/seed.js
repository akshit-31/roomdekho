import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB, initDB, query, pool } from "./config/db.js";

await connectDB();
await initDB();

const password = await bcrypt.hash("Password@123", 12);

const owners = [
  ["Demo Owner", "owner@example.com", "owner"],
  ["Roommate User", "roommate@example.com", "roommate"],
  ["Demo Seeker", "seeker@example.com", "seeker"]
];

for (const [name,email,role] of owners) {
  await query(
    `INSERT INTO users(name,email,password_hash,role,is_kyc_verified)
     VALUES($1,$2,$3,$4,$5)
     ON CONFLICT(email) DO NOTHING`,
    [name,email,password,role,role==="owner"]
  );
}

const owner = (await query("SELECT id FROM users WHERE email='owner@example.com'")).rows[0];

const count = (await query("SELECT COUNT(*) FROM rooms")).rows[0].count;
if (Number(count) === 0) {
  await query(
    `INSERT INTO rooms
     (owner_id,title,description,city,locality,rent,deposit,property_type,room_type,furnishing,amenities,images,is_verified)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [
      owner.id,
      "Bright private room near college",
      "A clean and comfortable room with easy access to public transport.",
      "Bareilly",
      "Civil Lines",
      7000,
      7000,
      "apartment",
      "private",
      "furnished",
      ["WiFi","Parking","Power Backup"],
      [],
      true
    ]
  );
}

console.log("Demo data ready.");
console.log("Owner: owner@example.com / Password@123");
console.log("Roommate: roommate@example.com / Password@123");
console.log("Seeker: seeker@example.com / Password@123");
await pool.end();
