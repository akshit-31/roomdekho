import {Router} from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {query} from "../config/db.js";
import {auth,owner} from "../middleware/auth.js";
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
    cb(null, `room-${unique}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

const r=Router();

const CITY_COORDS = {
  delhi: { lat: 28.6139, lng: 77.2090 },
  noida: { lat: 28.5355, lng: 77.3910 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 }
};

export function getRoomCoords(city, id) {
  const normCity = String(city || "delhi").toLowerCase().trim();
  const base = CITY_COORDS[normCity] || CITY_COORDS.delhi;
  const seed = Number(id) || 1;
  const latOffset = (((seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.08;
  const lngOffset = (((seed * 49297 + 9301) % 233280) / 233280 - 0.5) * 0.08;
  return {
    lat: Number((base.lat + latOffset).toFixed(6)),
    lng: Number((base.lng + lngOffset).toFixed(6))
  };
}

export function roomRow(x){
  const imgList = Array.isArray(x.images) ? x.images : [];
  const coords = getRoomCoords(x.city, x.id);
  const locationObj = {
    type: "Point",
    coordinates: [coords.lng, coords.lat],
    lat: coords.lat,
    lng: coords.lng,
    latitude: coords.lat,
    longitude: coords.lng,
    address: `${x.locality ? x.locality + ', ' : ''}${x.city}`
  };
  return {
    ...x,
    _id: String(x.id),
    id: String(x.id),
    title: x.title || "",
    description: x.description || "",
    city: x.city || "",
    locality: x.locality || "",
    address: {
      city: x.city || "",
      locality: x.locality || "",
      line1: x.address || "",
      addressLine: x.address || ""
    },
    location: locationObj,
    media: imgList.length > 0 ? imgList.map(img => ({ url: img })) : [],
    images: imgList,
    amenities: Array.isArray(x.amenities) ? x.amenities : [],
    isVerified: Boolean(x.is_verified),
    occupancy: {
      genderPreference: x.gender_preference || "any"
    },
    genderPreference: x.gender_preference || "any",
    rent: Number(x.rent || 0),
    deposit: Number(x.deposit || 0),
    views: Number(x.views || 0),
    stats: {
      views: Number(x.views || 0),
      enquiries: 0
    },
    owner: {
      _id: String(x.owner_id),
      id: String(x.owner_id),
      userId: String(x.owner_id),
      name: x.owner_name,
      avatar: x.owner_avatar,
      avatarUrl: x.owner_avatar,
      isKycVerified: Boolean(x.owner_kyc)
    }
  };
}
r.get("/",async(req,res)=>{
 const {city,minRent,maxRent,propertyType,roomType,furnishing,sort="newest",limit=12,page=1}=req.query;
 const where=["r.status='published'"], params=[]; let i=1;
 if(city){where.push(`LOWER(r.city)=LOWER($${i++})`);params.push(city)}
 if(minRent){where.push(`r.rent >= $${i++}`);params.push(Number(minRent))}
 if(maxRent){where.push(`r.rent <= $${i++}`);params.push(Number(maxRent))}
 if(propertyType){where.push(`r.property_type=$${i++}`);params.push(propertyType)}
 if(roomType){where.push(`r.room_type=$${i++}`);params.push(roomType)}
 if(furnishing){where.push(`r.furnishing=$${i++}`);params.push(furnishing)}
 const order=sort==="price"? "r.rent ASC":sort==="price_desc"?"r.rent DESC":"r.created_at DESC";
 const lim=Math.min(Number(limit)||12,50), off=(Math.max(Number(page)||1,1)-1)*lim;
 const q=`SELECT r.*,u.name owner_name,u.avatar owner_avatar,u.is_kyc_verified owner_kyc FROM rooms r JOIN users u ON u.id=r.owner_id WHERE ${where.join(" AND ")} ORDER BY ${order} LIMIT $${i++} OFFSET $${i++}`;
 const {rows}=await query(q,[...params,lim,off]); const c=await query(`SELECT COUNT(*) FROM rooms r WHERE ${where.join(" AND ")}`,params);
 ok(res,200,"Rooms fetched",{items:rows.map(roomRow),pagination:{page:Number(page)||1,limit:lim,total:Number(c.rows[0].count),pages:Math.ceil(Number(c.rows[0].count)/lim)}});
});
r.get("/mine",auth,owner,async(req,res)=>{const {rows}=await query("SELECT * FROM rooms WHERE owner_id=$1 ORDER BY created_at DESC",[req.user.id]);ok(res,200,"My rooms",{items:rows.map(roomRow),total:rows.length})});
r.get("/:id",async(req,res)=>{
 const {rows}=await query("SELECT r.*,u.name owner_name,u.avatar owner_avatar,u.is_kyc_verified owner_kyc FROM rooms r JOIN users u ON u.id=r.owner_id WHERE r.id=$1",[req.params.id]);
 if(!rows[0])return res.status(404).json({success:false,message:"Room not found"});
 await query("UPDATE rooms SET views=views+1 WHERE id=$1",[req.params.id]); ok(res,200,"Room fetched",roomRow(rows[0]));
});
r.post("/",auth,owner,async(req,res)=>{
 const b=req.body; if(!b.title||!b.city||b.rent===undefined)return res.status(400).json({success:false,message:"Title, city and rent are required"});
 const validDate = (b.availableFrom && !isNaN(Date.parse(b.availableFrom))) ? b.availableFrom : null;
 const {rows}=await query(
   `INSERT INTO rooms(owner_id,title,description,city,locality,address,rent,deposit,property_type,room_type,furnishing,gender_preference,available_from,amenities,images,status,is_verified)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'pending',false)
    RETURNING *`,
   [req.user.id,b.title,b.description,b.city,b.locality,b.address,b.rent,b.deposit||0,b.propertyType||"apartment",b.roomType||"private",b.furnishing||"furnished",b.genderPreference||"any",validDate,b.amenities||[],b.images||[]]
 );
 ok(res,201,"Room created (pending admin approval)",roomRow(rows[0]));
});
r.put("/:id",auth,owner,async(req,res)=>{const b=req.body; const {rows}=await query(`UPDATE rooms SET title=COALESCE($1,title),description=COALESCE($2,description),city=COALESCE($3,city),locality=COALESCE($4,locality),address=COALESCE($5,address),rent=COALESCE($6,rent),deposit=COALESCE($7,deposit),property_type=COALESCE($8,property_type),room_type=COALESCE($9,room_type),furnishing=COALESCE($10,furnishing),amenities=COALESCE($11,amenities),images=COALESCE($12,images),updated_at=now() WHERE id=$13 AND owner_id=$14 RETURNING *`,[b.title,b.description,b.city,b.locality,b.address,b.rent,b.deposit,b.propertyType,b.roomType,b.furnishing,b.amenities,b.images,req.params.id,req.user.id]);if(!rows[0])return res.status(404).json({success:false,message:"Room not found"});ok(res,200,"Room updated",rows[0])});
r.delete("/:id",auth,owner,async(req,res)=>{await query("DELETE FROM rooms WHERE id=$1 AND owner_id=$2",[req.params.id,req.user.id]);ok(res,200,"Room deleted")});
r.patch("/:id/publish",auth,owner,async(req,res)=>{const {rows}=await query("UPDATE rooms SET status='pending',is_verified=false,updated_at=now() WHERE id=$1 AND owner_id=$2 RETURNING *",[req.params.id,req.user.id]);ok(res,200,"Room submitted for admin approval",rows[0]||null)});
r.patch("/:id/rented",auth,owner,async(req,res)=>{const {rows}=await query("UPDATE rooms SET status='rented',updated_at=now() WHERE id=$1 AND owner_id=$2 RETURNING *",[req.params.id,req.user.id]);ok(res,200,"Room marked rented",rows[0]||null)});
r.post("/:id/media", auth, owner, upload.any(), async (req, res) => {
  try {
    let urls = [];
    const files = req.files || [];
    if (files.length > 0) {
      const host = req.get("host");
      const protocol = req.protocol;
      const base = `${protocol}://${host}`;
      urls = files.map((f) => `${base}/uploads/${f.filename}`);
    } else if (req.body?.url) {
      urls = [req.body.url];
    } else if (Array.isArray(req.body?.urls)) {
      urls = req.body.urls;
    }

    if (urls.length === 0) {
      return res.status(400).json({ success: false, message: "No photos or image URLs provided" });
    }

    const { rows } = await query(
      `UPDATE rooms 
       SET images = COALESCE(images, '{}'::text[]) || $1::text[], 
           updated_at = now() 
       WHERE id = $2 AND owner_id = $3 
       RETURNING *`,
      [urls, req.params.id, req.user.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: "Room not found or unauthorized" });
    }

    ok(res, 200, `${urls.length} media item(s) added successfully`, rows[0]);
  } catch (err) {
    console.error("Room media upload error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to upload media" });
  }
});
r.post("/:id/favorite",auth,async(req,res)=>{await query("INSERT INTO favorites(user_id,room_id) VALUES($1,$2) ON CONFLICT DO NOTHING",[req.user.id,req.params.id]);ok(res,200,"Added to favorites")});
r.delete("/:id/favorite",auth,async(req,res)=>{await query("DELETE FROM favorites WHERE user_id=$1 AND room_id=$2",[req.user.id,req.params.id]);ok(res,200,"Removed from favorites")});
export default r;
