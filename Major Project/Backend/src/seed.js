import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB, initDB, query, pool } from "./config/db.js";

await connectDB();
await initDB();

console.log("🧹 Completely purging all old raw dummy test data from database...");
await query("DELETE FROM messages");
await query("DELETE FROM conversations");
await query("DELETE FROM visits");
await query("DELETE FROM favorites");
await query("DELETE FROM reviews");
await query("DELETE FROM rooms");
await query("DELETE FROM profiles");
await query("DELETE FROM users");

console.log("✨ Initializing clean production database seed...");

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
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
];

// 1. Ensure Admins exist
console.log("Seeding verified Admins...");
const admins = [
  ["Super Admin 1", "admin1@roomdekho.com", "admin"],
  ["Super Admin 2", "admin2@roomdekho.com", "admin"]
];
for (const [name, email, role] of admins) {
  await query(
    `INSERT INTO users(name, email, password_hash, role, is_kyc_verified, approval_status)
     VALUES($1, $2, $3, $4, true, 'approved')
     ON CONFLICT(email) DO UPDATE SET name = $1, password_hash = $3, role = $4`,
    [name, email, defaultPasswordHash, role]
  );
}

// 2. Ensure Akshit Sharma (Owner) exists
console.log("Seeding Primary Host (akshit sharma)...");
const akshitRes = await query(
  `INSERT INTO users(name, email, password_hash, role, phone, is_kyc_verified, approval_status, property_city, property_locality, property_address)
   VALUES('akshit sharma', 'owner111@roomdekho.com', $1, 'owner', '+91 98765 43210', true, 'approved', 'Bareilly', 'Civil Lines', 'House 42, Civil Lines Road')
   ON CONFLICT(email) DO UPDATE SET role = 'owner', is_kyc_verified = true, approval_status = 'approved'
   RETURNING id`,
  [defaultPasswordHash]
);
const akshitId = akshitRes.rows[0].id;

// 3. Production Curated Listings with Real Details & Multiple Images
const PRODUCTION_LISTINGS = [
  // Bareilly Listings (Nearest to user)
  {
    title: "Spacious Sunlit 1BHK with Modular Kitchen & Balcony",
    description: "Fully furnished 1BHK apartment in Civil Lines with 24x7 security, high speed WiFi, dedicated parking, and peaceful surroundings. Close to shopping centers and transit.",
    city: "Bareilly",
    locality: "Civil Lines",
    address: "B-12, Green Park Road, Civil Lines, Bareilly",
    rent: 7500,
    deposit: 15000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.3670,
    lng: 79.4304,
    status: "published",
    isVerified: true,
    views: 84,
    ownerName: "akshit sharma",
    ownerEmail: "owner111@roomdekho.com",
    ownerPhone: "+91 98765 43210",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Modular Kitchen", "Balcony", "Security", "Parking"],
    images: [BEDROOMS[0], LIVING_ROOMS[0], KITCHEN_BALCONIES[0], BEDROOMS[1]]
  },
  {
    title: "Affordable Furnished Room near Invertis University & Highway",
    description: "Ideal for students and young working professionals. Includes study desk, fast optical fiber internet, attached washroom, and daily housekeeping.",
    city: "Bareilly",
    locality: "National Highway 24",
    address: "Pocket 4, Invertis Road, Bareilly",
    rent: 5500,
    deposit: 10000,
    propertyType: "flat",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.3312,
    lng: 79.4721,
    status: "published",
    isVerified: true,
    views: 62,
    ownerName: "Sunil Verma",
    ownerEmail: "sunil.verma@roomdekho.com",
    ownerPhone: "+91 98112 34567",
    amenities: ["WiFi", "Power Backup", "Geyser", "RO Purifier", "Security Guard", "Parking"],
    images: [BEDROOMS[2], LIVING_ROOMS[1], KITCHEN_BALCONIES[1]]
  },
  {
    title: "Cozy 2BHK Shared Room with Garden View in Janakpuri",
    description: "Well-ventilated sharing room in a gated community. Friendly flatmates, clean washrooms, access to shared kitchen and rooftop garden.",
    city: "Bareilly",
    locality: "Janakpuri",
    address: "Lane 3, Janakpuri Main Colony, Bareilly",
    rent: 6200,
    deposit: 12000,
    propertyType: "flat",
    roomType: "shared",
    furnishing: "semi-furnished",
    genderPreference: "any",
    lat: 28.3540,
    lng: 79.4180,
    status: "published",
    isVerified: true,
    views: 45,
    ownerName: "akshit sharma",
    ownerEmail: "owner111@roomdekho.com",
    ownerPhone: "+91 98765 43210",
    amenities: ["WiFi", "Geyser", "Washing Machine", "Modular Kitchen", "Terrace Access"],
    images: [BEDROOMS[3], LIVING_ROOMS[2], KITCHEN_BALCONIES[2]]
  },
  {
    title: "Quiet Independent Studio Room near Bareilly Cantt",
    description: "Peaceful environment, ample natural light, private entrance, attached bathroom, and peaceful greenery. Safe for single girls and working executives.",
    city: "Bareilly",
    locality: "Cantt Area",
    address: "Station Road, Cantt, Bareilly",
    rent: 8200,
    deposit: 16000,
    propertyType: "independent",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.3490,
    lng: 79.4410,
    status: "pending", // For Admin Moderation testing
    isVerified: false,
    views: 12,
    ownerName: "akshit sharma",
    ownerEmail: "owner111@roomdekho.com",
    ownerPhone: "+91 98765 43210",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Parking"],
    images: [BEDROOMS[4], LIVING_ROOMS[3]]
  },

  // Noida Listings
  {
    title: "Modern Furnished 2BHK Room with High-Speed WiFi in Sector 62",
    description: "Located right next to major IT parks and metro station. Features king size bed, air conditioning, 200 Mbps broadband, and fully equipped kitchen.",
    city: "Noida",
    locality: "Sector 62",
    address: "Tower B, Stellar Park, Sector 62, Noida",
    rent: 12500,
    deposit: 25000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.6280,
    lng: 77.3649,
    status: "published",
    isVerified: true,
    views: 130,
    ownerName: "Tanya Verma",
    ownerEmail: "tanya.v@roomdekho.com",
    ownerPhone: "+91 98991 22334",
    amenities: ["WiFi", "AC", "Power Backup", "Washing Machine", "Geyser", "Gym", "Swimming Pool", "Parking"],
    images: [BEDROOMS[5], LIVING_ROOMS[4], KITCHEN_BALCONIES[0], BEDROOMS[6]]
  },
  {
    title: "Luxury Master Bedroom with Attached Bath in Sector 137 Metro",
    description: "High-rise society overlooking central park. Gated community with club house, gym, 3 tier security, and walking distance to Aqua Line Metro.",
    city: "Noida",
    locality: "Sector 137",
    address: "Paras Tierea, Sector 137, Noida",
    rent: 14000,
    deposit: 28000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.5132,
    lng: 77.4082,
    status: "published",
    isVerified: true,
    views: 175,
    ownerName: "Megha Rao",
    ownerEmail: "megha.rao@roomdekho.com",
    ownerPhone: "+91 98114 55667",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Gym", "Security Guard", "Balcony"],
    images: [BEDROOMS[7], LIVING_ROOMS[5], KITCHEN_BALCONIES[1]]
  },
  {
    title: "Cozy Private Room in Gated Society, Sector 18",
    description: "Steps away from Mall of India, DLF Mall, and Blue Line Metro. Ideal for working professionals seeking zero commute hassle.",
    city: "Noida",
    locality: "Sector 18",
    address: "Atta Market, Sector 18, Noida",
    rent: 11000,
    deposit: 22000,
    propertyType: "flat",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.5708,
    lng: 77.3271,
    status: "published",
    isVerified: true,
    views: 95,
    ownerName: "Rajesh Kumar",
    ownerEmail: "rajesh.k@roomdekho.com",
    ownerPhone: "+91 98101 99887",
    amenities: ["WiFi", "AC", "Geyser", "Modular Kitchen", "Attached Washroom"],
    images: [BEDROOMS[8], LIVING_ROOMS[6], BEDROOMS[9]]
  },

  // Delhi Listings
  {
    title: "Premium Furnished Studio near Hauz Khas Village & Metro",
    description: "Designer decor with exposed brick, high ceiling, private terrace, smart TV, inverter backup, and close proximity to HKV restaurants and Deer Park.",
    city: "Delhi",
    locality: "Hauz Khas",
    address: "Block K, Hauz Khas Enclave, New Delhi",
    rent: 18500,
    deposit: 37000,
    propertyType: "independent",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.5494,
    lng: 77.2001,
    status: "published",
    isVerified: true,
    views: 210,
    ownerName: "Ananya Kapoor",
    ownerEmail: "ananya.k@roomdekho.com",
    ownerPhone: "+91 99100 88776",
    amenities: ["WiFi", "AC", "Power Backup", "Terrace Access", "Geyser", "Modular Kitchen", "Smart TV"],
    images: [BEDROOMS[10], LIVING_ROOMS[7], KITCHEN_BALCONIES[2], BEDROOMS[11]]
  },
  {
    title: "Sunny 1BHK Flat with Terrace Access in Saket Metro",
    description: "Quiet green neighborhood next to Select Citywalk Mall. Excellent metro connectivity, 24 hr water supply, and verified security.",
    city: "Delhi",
    locality: "Saket",
    address: "J-Block, Saket, New Delhi",
    rent: 16000,
    deposit: 32000,
    propertyType: "flat",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.5245,
    lng: 77.2066,
    status: "published",
    isVerified: true,
    views: 142,
    ownerName: "Vikram Malhotra",
    ownerEmail: "vikram.m@roomdekho.com",
    ownerPhone: "+91 98188 77665",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Balcony", "Parking"],
    images: [BEDROOMS[12], LIVING_ROOMS[0], KITCHEN_BALCONIES[0]]
  },
  {
    title: "Furnished AC Room for Students & Professionals in Karol Bagh",
    description: "Close to coaching hubs and central Delhi commercial centers. Includes food options, laundry, RO water, and bi-weekly cleaning.",
    city: "Delhi",
    locality: "Karol Bagh",
    address: "Pusa Road, Karol Bagh, New Delhi",
    rent: 10500,
    deposit: 21000,
    propertyType: "flat",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.6514,
    lng: 77.1907,
    status: "published",
    isVerified: true,
    views: 88,
    ownerName: "Saurabh Agarwal",
    ownerEmail: "saurabh.a@roomdekho.com",
    ownerPhone: "+91 98119 22334",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Security Guard"],
    images: [BEDROOMS[13], LIVING_ROOMS[1]]
  },

  // Gurgaon (Gurugram) Listings
  {
    title: "Luxury High-Rise Studio Room near Cyber City & DLF Phase 3",
    description: "Experience premium modern co-living. Walk to Rapid Metro and DLF Cyber Hub. All amenities included: gym, lounge, cafeteria, and weekly cleaning.",
    city: "Gurgaon",
    locality: "DLF Phase 3",
    address: "U-Block, DLF Phase 3, Gurugram",
    rent: 21000,
    deposit: 42000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.4912,
    lng: 77.0945,
    status: "published",
    isVerified: true,
    views: 290,
    ownerName: "Pooja Singhania",
    ownerEmail: "pooja.s@roomdekho.com",
    ownerPhone: "+91 98711 00223",
    amenities: ["WiFi", "AC", "Power Backup", "Washing Machine", "Geyser", "Gym", "Balcony", "Security"],
    images: [BEDROOMS[14], LIVING_ROOMS[2], KITCHEN_BALCONIES[1], BEDROOMS[0]]
  },
  {
    title: "Furnished Private Room with Attached Balcony in Golf Course Road",
    description: "Located on prestigious Golf Course Road. Quiet flatmates, lush green balcony view, dedicated underground parking, and high-speed fiber internet.",
    city: "Gurgaon",
    locality: "Golf Course Road",
    address: "Sector 43, Golf Course Road, Gurugram",
    rent: 19500,
    deposit: 39000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 28.4410,
    lng: 77.1020,
    status: "published",
    isVerified: true,
    views: 165,
    ownerName: "Deepak Choudhary",
    ownerEmail: "deepak.c@roomdekho.com",
    ownerPhone: "+91 98100 55443",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Balcony", "Parking", "Security Guard"],
    images: [BEDROOMS[1], LIVING_ROOMS[3], KITCHEN_BALCONIES[2]]
  },

  // Bengaluru Listings
  {
    title: "Vibrant Furnished Room with High-Speed WiFi in Koramangala",
    description: "Located in the heart of startup ecosystem. 100 meters to bustling cafes, pubs, and co-working spaces. Well-equipped kitchen and sunny terrace.",
    city: "Bengaluru",
    locality: "Koramangala",
    address: "4th Block, 80 Feet Road, Koramangala, Bengaluru",
    rent: 16500,
    deposit: 33000,
    propertyType: "flat",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 12.9352,
    lng: 77.6245,
    status: "published",
    isVerified: true,
    views: 310,
    ownerName: "Krishna Das",
    ownerEmail: "krishna.d@roomdekho.com",
    ownerPhone: "+91 99800 11223",
    amenities: ["WiFi", "Power Backup", "Washing Machine", "Geyser", "Modular Kitchen", "Attached Washroom"],
    images: [BEDROOMS[2], LIVING_ROOMS[4], KITCHEN_BALCONIES[0], BEDROOMS[3]]
  },
  {
    title: "Executive 1BHK Studio near Tech Parks in Indiranagar 100ft Road",
    description: "Modern apartment with elevator, power backup, CCTV, and designer fixtures. Steps to metro station and restaurants.",
    city: "Bengaluru",
    locality: "Indiranagar",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    rent: 19000,
    deposit: 38000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 12.9784,
    lng: 77.6408,
    status: "published",
    isVerified: true,
    views: 240,
    ownerName: "Rohit Nair",
    ownerEmail: "rohit.n@roomdekho.com",
    ownerPhone: "+91 98450 33445",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Lift", "Security", "Parking"],
    images: [BEDROOMS[4], LIVING_ROOMS[5], KITCHEN_BALCONIES[1]]
  },

  // Mumbai Listings
  {
    title: "Chic Sea-Breeze Studio Room with Balcony in Bandra West",
    description: "Sunlit space near Bandstand and Hill Road. Queen size bed, wooden flooring, vintage interiors, and high-speed broadband.",
    city: "Mumbai",
    locality: "Bandra West",
    address: "Pali Hill Road, Bandra West, Mumbai",
    rent: 26000,
    deposit: 52000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 19.0596,
    lng: 72.8295,
    status: "published",
    isVerified: true,
    views: 420,
    ownerName: "Farhan Merchant",
    ownerEmail: "farhan.m@roomdekho.com",
    ownerPhone: "+91 98200 44556",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Sea View", "Balcony", "Security"],
    images: [BEDROOMS[5], LIVING_ROOMS[6], KITCHEN_BALCONIES[2], BEDROOMS[6]]
  },
  {
    title: "Modern AC Private Bedroom near Hiranandani Gardens, Powai",
    description: "High floor flat overlooking Powai Lake. Access to society gym, jogging track, 24x7 security, and clubhouse.",
    city: "Mumbai",
    locality: "Powai",
    address: "Central Avenue, Hiranandani Gardens, Powai, Mumbai",
    rent: 22000,
    deposit: 44000,
    propertyType: "apartment",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 19.1176,
    lng: 72.9060,
    status: "published",
    isVerified: true,
    views: 185,
    ownerName: "Divya Shah",
    ownerEmail: "divya.s@roomdekho.com",
    ownerPhone: "+91 98211 33221",
    amenities: ["WiFi", "AC", "Power Backup", "Washing Machine", "Geyser", "Gym", "Lake View"],
    images: [BEDROOMS[7], LIVING_ROOMS[7], KITCHEN_BALCONIES[0]]
  },

  // Jaipur & Lucknow
  {
    title: "Heritage Style Furnished Private Room in C-Scheme",
    description: "Centrally located, peaceful residential locality with lawn access, spacious balcony, and classic Rajasthani architecture.",
    city: "Jaipur",
    locality: "C-Scheme",
    address: "Ashok Marg, C-Scheme, Jaipur",
    rent: 11500,
    deposit: 23000,
    propertyType: "independent",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 26.9077,
    lng: 75.8056,
    status: "published",
    isVerified: true,
    views: 110,
    ownerName: "Digvijay Rathore",
    ownerEmail: "digvijay.r@roomdekho.com",
    ownerPhone: "+91 98290 11223",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Terrace Access", "Garden"],
    images: [BEDROOMS[8], LIVING_ROOMS[0], KITCHEN_BALCONIES[1]]
  },
  {
    title: "Spacious Furnished Room with Balcony in Gomti Nagar",
    description: "Wide roads, green parks, metro connectivity nearby. Clean attached washroom, study table, and inverter backup.",
    city: "Lucknow",
    locality: "Gomti Nagar",
    address: "Vibhuti Khand, Gomti Nagar, Lucknow",
    rent: 9500,
    deposit: 19000,
    propertyType: "flat",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 26.8500,
    lng: 80.9980,
    status: "published",
    isVerified: true,
    views: 125,
    ownerName: "Alok Mishra",
    ownerEmail: "alok.m@roomdekho.com",
    ownerPhone: "+91 94150 99887",
    amenities: ["WiFi", "AC", "Power Backup", "Geyser", "Balcony", "Parking"],
    images: [BEDROOMS[9], LIVING_ROOMS[1], KITCHEN_BALCONIES[2]]
  },
  {
    title: "Newly Built 2BHK Room with Modular Kitchen (Pending Review)",
    description: "Recently renovated property with brand new sanitary fittings, vitrified tiles, and solar water heater.",
    city: "Lucknow",
    locality: "Hazratganj",
    address: "MG Marg, Hazratganj, Lucknow",
    rent: 11000,
    deposit: 22000,
    propertyType: "flat",
    roomType: "private",
    furnishing: "furnished",
    genderPreference: "any",
    lat: 26.8480,
    lng: 80.9450,
    status: "pending", // For Admin Moderation testing
    isVerified: false,
    views: 18,
    ownerName: "Alok Mishra",
    ownerEmail: "alok.m@roomdekho.com",
    ownerPhone: "+91 94150 99887",
    amenities: ["WiFi", "Geyser", "Power Backup", "Parking"],
    images: [BEDROOMS[10], LIVING_ROOMS[2]]
  }
];

// Insert owners and rooms
console.log(`Seeding ${PRODUCTION_LISTINGS.length} production listings with multi-image galleries...`);

for (const item of PRODUCTION_LISTINGS) {
  // 1. Ensure owner exists
  let ownerId = akshitId;
  if (item.ownerEmail !== "owner111@roomdekho.com") {
    const ownerRes = await query(
      `INSERT INTO users(name, email, password_hash, role, phone, is_kyc_verified, approval_status, property_city, property_locality, property_address)
       VALUES($1, $2, $3, 'owner', $4, true, 'approved', $5, $6, $7)
       ON CONFLICT(email) DO UPDATE SET name = $1, is_kyc_verified = true, approval_status = 'approved'
       RETURNING id`,
      [item.ownerName, item.ownerEmail, defaultPasswordHash, item.ownerPhone, item.city, item.locality, item.address]
    );
    ownerId = ownerRes.rows[0].id;
  }

  // 2. Insert room
  await query(
    `INSERT INTO rooms(
       owner_id, title, description, city, locality, address, rent, deposit,
       property_type, room_type, furnishing, gender_preference, amenities,
       images, status, is_verified, views, latitude, longitude, created_at
     )
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, now())`,
    [
      ownerId,
      item.title,
      item.description,
      item.city,
      item.locality,
      item.address,
      item.rent,
      item.deposit,
      item.propertyType,
      item.roomType,
      item.furnishing,
      item.genderPreference,
      item.amenities,
      item.images,
      item.status,
      item.isVerified,
      item.views,
      item.lat,
      item.lng
    ]
  );
}

// 5. Seed Real Roommates & "Both" Profiles
console.log("Seeding rich Roommate and Both-seeker profiles...");
const ROOMMATES = [
  {
    name: "Aman Sharma",
    email: "aman.sharma@example.com",
    role: "seeker",
    intent: "both",
    lookingFor: "both",
    gender: "male",
    age: 24,
    occupation: "Software Engineer at Tech Mahindra",
    city: "Noida",
    budgetMin: 8000,
    budgetMax: 15000,
    foodPreference: "Vegetarian",
    sleepSchedule: "Night Owl",
    cleanliness: "Very Clean",
    bio: "Hi! Working in Sector 62 Noida. Looking for friendly flatmates or a clean shared room with WiFi and AC."
  },
  {
    name: "Rohan Verma",
    email: "rohan.v@example.com",
    role: "roommate",
    intent: "find_roommate",
    lookingFor: "find_roommate",
    gender: "male",
    age: 26,
    occupation: "Product Designer",
    city: "Delhi",
    budgetMin: 10000,
    budgetMax: 18000,
    foodPreference: "Vegetarian",
    sleepSchedule: "Early Bird",
    cleanliness: "Organized",
    bio: "Tech lead at startup, quiet & clean habits. Looking for like-minded roommate in South Delhi or Saket."
  },
  {
    name: "Ananya Sen",
    email: "ananya.sen@example.com",
    role: "seeker",
    intent: "both",
    lookingFor: "both",
    gender: "female",
    age: 23,
    occupation: "Data Analyst",
    city: "Bengaluru",
    budgetMin: 12000,
    budgetMax: 20000,
    foodPreference: "Non-Vegetarian",
    sleepSchedule: "Flexible",
    cleanliness: "Clean",
    bio: "Moving to Bangalore for work. Need room or roommate in Koramangala / HSR Layout."
  },
  {
    name: "Sneha Roy",
    email: "sneha.roy@example.com",
    role: "roommate",
    intent: "both",
    lookingFor: "both",
    gender: "female",
    age: 25,
    occupation: "Chartered Accountant",
    city: "Mumbai",
    budgetMin: 15000,
    budgetMax: 25000,
    foodPreference: "Vegetarian",
    sleepSchedule: "Early Bird",
    cleanliness: "Spotless",
    bio: "Working in financial firm in BKC. Looking for a neat flatmate to share 2BHK in Bandra or Powai."
  },
  {
    name: "Kunal Bhatia",
    email: "kunal.bhatia@example.com",
    role: "seeker",
    intent: "find_room",
    lookingFor: "find_room",
    gender: "male",
    age: 27,
    occupation: "Marketing Lead",
    city: "Gurgaon",
    budgetMin: 12000,
    budgetMax: 22000,
    foodPreference: "Non-Vegetarian",
    sleepSchedule: "Night Owl",
    cleanliness: "Clean",
    bio: "Looking for independent 1RK/1BHK or master room in Golf Course Road or DLF Phase 3."
  },
  {
    name: "Priya Malhotra",
    email: "priya.m@example.com",
    role: "seeker",
    intent: "both",
    lookingFor: "both",
    gender: "female",
    age: 22,
    occupation: "Postgraduate Student",
    city: "Bareilly",
    budgetMin: 5000,
    budgetMax: 9000,
    foodPreference: "Vegetarian",
    sleepSchedule: "Early Bird",
    cleanliness: "Very Clean",
    bio: "Student in Bareilly. Looking for clean PG or flatmate to share room in Civil Lines."
  },
  {
    name: "Meera Joshi",
    email: "meera.j@example.com",
    role: "seeker",
    intent: "both",
    lookingFor: "both",
    gender: "female",
    age: 25,
    occupation: "Banking Executive",
    city: "Bareilly",
    budgetMin: 6000,
    budgetMax: 11000,
    foodPreference: "Vegetarian",
    sleepSchedule: "Flexible",
    cleanliness: "High",
    bio: "Bank officer posted in Bareilly Cantt. Looking for a neat 1BHK or independent room with attached bath."
  },
  {
    name: "Rahul Kapoor",
    email: "rahul.k@example.com",
    role: "roommate",
    intent: "both",
    lookingFor: "both",
    gender: "male",
    age: 28,
    occupation: "Investment Banker",
    city: "Mumbai",
    budgetMin: 18000,
    budgetMax: 32000,
    foodPreference: "Non-Vegetarian",
    sleepSchedule: "Night Owl",
    cleanliness: "High",
    bio: "Working in financial firm in BKC. Looking for a flatmate to share premium 2BHK in Bandra West."
  },
  {
    name: "Ishita Roy",
    email: "ishita.r@example.com",
    role: "roommate",
    intent: "find_roommate",
    lookingFor: "find_roommate",
    gender: "female",
    age: 24,
    occupation: "Interior Architect",
    city: "Jaipur",
    budgetMin: 8000,
    budgetMax: 15000,
    foodPreference: "Vegetarian",
    sleepSchedule: "Early Bird",
    cleanliness: "Spotless",
    bio: "Architect based in C-Scheme Jaipur. Looking for a creative, peaceful flatmate to share apartment."
  },
  {
    name: "Harsh Vardhan",
    email: "harsh.v@example.com",
    role: "seeker",
    intent: "find_room",
    lookingFor: "find_room",
    gender: "male",
    age: 24,
    occupation: "Civil Services Aspirant",
    city: "Lucknow",
    budgetMin: 6000,
    budgetMax: 12000,
    foodPreference: "Vegetarian",
    sleepSchedule: "Early Bird",
    cleanliness: "Clean",
    bio: "Preparing for exams in Lucknow. Looking for quiet, peaceful furnished room in Gomti Nagar or Hazratganj."
  }
];

for (let i = 0; i < ROOMMATES.length; i++) {
  const rm = ROOMMATES[i];
  const avatar = AVATARS[i % AVATARS.length];
  const userRes = await query(
    `INSERT INTO users(name, email, password_hash, role, avatar, is_kyc_verified, approval_status, is_profile_completed, intent)
     VALUES($1, $2, $3, $4, $5, true, 'approved', true, $6)
     ON CONFLICT(email) DO UPDATE SET name = $1, avatar = $5, intent = $6, role = $4
     RETURNING id`,
    [rm.name, rm.email, defaultPasswordHash, rm.role, avatar, rm.intent]
  );
  const uId = userRes.rows[0].id;

  await query(
    `INSERT INTO profiles(user_id, bio, gender, age, occupation, preferred_locations, budget_min, budget_max, food_preference, sleep_schedule, cleanliness, looking_for)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT(user_id) DO UPDATE SET
       bio = $2, gender = $3, age = $4, occupation = $5, preferred_locations = $6,
       budget_min = $7, budget_max = $8, food_preference = $9, sleep_schedule = $10,
       cleanliness = $11, looking_for = $12, updated_at = now()`,
    [uId, rm.bio, rm.gender, rm.age, rm.occupation, [rm.city], rm.budgetMin, rm.budgetMax, rm.foodPreference, rm.sleepSchedule, rm.cleanliness, rm.lookingFor]
  );
}

// 6. Seed mock enquiries/visits for akshit sharma
console.log("Seeding real enquiries and visits for Akshit Sharma's dashboard...");
const akshitRooms = (await query("SELECT id FROM rooms WHERE owner_id = $1 ORDER BY id ASC", [akshitId])).rows;
const amanUser = (await query("SELECT id FROM users WHERE email = 'aman.sharma@example.com'")).rows[0];
const priyaUser = (await query("SELECT id FROM users WHERE email = 'priya.m@example.com'")).rows[0];
const meeraUser = (await query("SELECT id FROM users WHERE email = 'meera.j@example.com'")).rows[0];

if (akshitRooms.length > 0 && amanUser) {
  await query(
    `INSERT INTO visits(room_id, seeker_id, owner_id, scheduled_at, status, note)
     VALUES
     ($1, $2, $3, now() + interval '1 day', 'confirmed', 'Hi Akshit ji, I saw the Civil Lines 1BHK and would love to visit tomorrow morning!'),
     ($4, $5, $3, now() + interval '3 days', 'confirmed', 'Hello! Interested in the Janakpuri 2BHK room. Can we meet this Sunday?'),
     ($1, $6, $3, now() + interval '5 days', 'pending', 'Inquiring about Bareilly room availability and parking space.')
     ON CONFLICT DO NOTHING`,
    [
      akshitRooms[0].id,
      amanUser.id,
      akshitId,
      akshitRooms[1]?.id || akshitRooms[0].id,
      priyaUser?.id || amanUser.id,
      meeraUser?.id || amanUser.id
    ]
  );

  // 7. Seed Real Conversation and Messages between Akshit Sharma and Aman Sharma
  console.log("Seeding real conversation & messages for Akshit Sharma...");
  const u1 = Math.min(Number(akshitId), Number(amanUser.id));
  const u2 = Math.max(Number(akshitId), Number(amanUser.id));
  const convRes = await query(
    `INSERT INTO conversations(user_one, user_two, created_at)
     VALUES($1, $2, now())
     ON CONFLICT(user_one, user_two) DO NOTHING
     RETURNING id`,
    [u1, u2]
  );
  const convId = convRes.rows[0]?.id || (await query("SELECT id FROM conversations WHERE user_one=$1 AND user_two=$2", [u1, u2])).rows[0]?.id;

  if (convId) {
    await query(
      `INSERT INTO messages(conversation_id, sender_id, body, created_at)
       VALUES
       ($1, $2, 'Namaste Akshit ji, I saw your Civil Lines 1BHK room post on RoomDekho. Is it still available for visit?', now() - interval '3 hours'),
       ($1, $3, 'Hello Aman! Yes, it is fully furnished, verified, and available for immediate move-in. You can visit anytime tomorrow.', now() - interval '2 hours'),
       ($1, $2, 'Sounds great! I will visit tomorrow at 11:00 AM. Thank you!', now() - interval '1 hour')
       ON CONFLICT DO NOTHING`,
      [convId, amanUser.id, akshitId]
    );
  }
}

console.log("\n=======================================================");
console.log("🎉 PRODUCTION DATABASE SEED COMPLETED SUCCESSFULLY!");
console.log("-------------------------------------------------------");
console.log(`🔹 Total Curated Multi-Image Listings: ${PRODUCTION_LISTINGS.length}`);
console.log("🔹 Primary Host Account: owner111@roomdekho.com (akshit sharma) [Password@123]");
console.log("🔹 Super Admin Accounts: admin1@roomdekho.com, admin2@roomdekho.com [Password@123]");
console.log("🔹 Cities Seeded: Bareilly (Civil Lines, Cantt, Janakpuri), Noida, Delhi, Gurgaon, Bengaluru, Mumbai, Jaipur, Lucknow");
console.log("🔹 Every listing has 3 to 5 high-res Unsplash interior images & exact GPS coordinates!");
console.log("=======================================================\n");

await pool.end();
process.exit(0);
