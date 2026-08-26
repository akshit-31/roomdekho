import {Router} from "express";
import {query} from "../config/db.js";
import {auth,owner} from "../middleware/auth.js";
import {ok} from "../utils/response.js";
const r=Router();

function roomRow(x){return {...x, owner:{id:x.owner_id,name:x.owner_name,avatar:x.owner_avatar,isKycVerified:x.owner_kyc}, amenities:x.amenities||[],images:x.images||[],rent:Number(x.rent),deposit:Number(x.deposit||0)}}
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
r.get("/mine",auth,owner,async(req,res)=>{const {rows}=await query("SELECT * FROM rooms WHERE owner_id=$1 ORDER BY created_at DESC",[req.user.id]);ok(res,200,"My rooms",rows)});
r.get("/:id",async(req,res)=>{
 const {rows}=await query("SELECT r.*,u.name owner_name,u.avatar owner_avatar,u.is_kyc_verified owner_kyc FROM rooms r JOIN users u ON u.id=r.owner_id WHERE r.id=$1",[req.params.id]);
 if(!rows[0])return res.status(404).json({success:false,message:"Room not found"});
 await query("UPDATE rooms SET views=views+1 WHERE id=$1",[req.params.id]); ok(res,200,"Room fetched",roomRow(rows[0]));
});
r.post("/",auth,owner,async(req,res)=>{
 const b=req.body; if(!b.title||!b.city||b.rent===undefined)return res.status(400).json({success:false,message:"Title, city and rent are required"});
 const {rows}=await query(`INSERT INTO rooms(owner_id,title,description,city,locality,address,rent,deposit,property_type,room_type,furnishing,gender_preference,available_from,amenities,images,is_verified) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,[req.user.id,b.title,b.description,b.city,b.locality,b.address,b.rent,b.deposit||0,b.propertyType||"apartment",b.roomType||"private",b.furnishing||"furnished",b.genderPreference,b.availableFrom,b.amenities||[],b.images||[],req.user.is_kyc_verified]);
 ok(res,201,"Room created",rows[0]);
});
r.put("/:id",auth,owner,async(req,res)=>{const b=req.body; const {rows}=await query(`UPDATE rooms SET title=COALESCE($1,title),description=COALESCE($2,description),city=COALESCE($3,city),locality=COALESCE($4,locality),address=COALESCE($5,address),rent=COALESCE($6,rent),deposit=COALESCE($7,deposit),property_type=COALESCE($8,property_type),room_type=COALESCE($9,room_type),furnishing=COALESCE($10,furnishing),amenities=COALESCE($11,amenities),images=COALESCE($12,images),updated_at=now() WHERE id=$13 AND owner_id=$14 RETURNING *`,[b.title,b.description,b.city,b.locality,b.address,b.rent,b.deposit,b.propertyType,b.roomType,b.furnishing,b.amenities,b.images,req.params.id,req.user.id]);if(!rows[0])return res.status(404).json({success:false,message:"Room not found"});ok(res,200,"Room updated",rows[0])});
r.delete("/:id",auth,owner,async(req,res)=>{await query("DELETE FROM rooms WHERE id=$1 AND owner_id=$2",[req.params.id,req.user.id]);ok(res,200,"Room deleted")});
r.patch("/:id/publish",auth,owner,async(req,res)=>{const {rows}=await query("UPDATE rooms SET status='published',updated_at=now() WHERE id=$1 AND owner_id=$2 RETURNING *",[req.params.id,req.user.id]);ok(res,200,"Room published",rows[0]||null)});
r.patch("/:id/rented",auth,owner,async(req,res)=>{const {rows}=await query("UPDATE rooms SET status='rented',updated_at=now() WHERE id=$1 AND owner_id=$2 RETURNING *",[req.params.id,req.user.id]);ok(res,200,"Room marked rented",rows[0]||null)});
r.post("/:id/media",auth,owner,async(req,res)=>{const url=req.body?.url; if(!url)return res.status(400).json({success:false,message:"Image URL is required"});const {rows}=await query("UPDATE rooms SET images=array_append(images,$1),updated_at=now() WHERE id=$2 AND owner_id=$3 RETURNING *",[url,req.params.id,req.user.id]);ok(res,200,"Image added",rows[0])});
r.post("/:id/favorite",auth,async(req,res)=>{await query("INSERT INTO favorites(user_id,room_id) VALUES($1,$2) ON CONFLICT DO NOTHING",[req.user.id,req.params.id]);ok(res,200,"Added to favorites")});
r.delete("/:id/favorite",auth,async(req,res)=>{await query("DELETE FROM favorites WHERE user_id=$1 AND room_id=$2",[req.user.id,req.params.id]);ok(res,200,"Removed from favorites")});
export default r;
