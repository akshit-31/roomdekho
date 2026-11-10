import {Router} from "express";import {auth} from "../middleware/auth.js";import {query} from "../config/db.js";import {ok} from "../utils/response.js";
const r=Router();r.use(auth);
r.post("/",async(req,res)=>{
  const {propertyId,roomId,scheduledAt,scheduledDate,timeSlot,note}=req.body;
  const id=roomId||propertyId;
  const room=(await query("SELECT * FROM rooms WHERE id=$1",[id])).rows[0];
  if(!room)return res.status(404).json({success:false,message:"Room not found"});
  const visitDate = scheduledAt || scheduledDate || new Date().toISOString();
  const visitNote = note || timeSlot || "";
  const {rows}=await query("INSERT INTO visits(room_id,seeker_id,owner_id,scheduled_at,note) VALUES($1,$2,$3,$4,$5) RETURNING *",[id,req.user.id,room.owner_id,visitDate,visitNote]);
  ok(res,201,"Visit requested",rows[0]);
});
r.get("/mine",async(req,res)=>{
  const {rows}=await query(`SELECT v.*,r.title,r.city,r.locality,r.images FROM visits v JOIN rooms r ON r.id=v.room_id WHERE v.seeker_id=$1 OR v.owner_id=$1 ORDER BY v.scheduled_at DESC`,[req.user.id]);
  const items = rows.map(v => {
    const imgs = Array.isArray(v.images) ? v.images : [];
    return {
      ...v,
      _id: String(v.id),
      id: String(v.id),
      scheduledDate: v.scheduled_at,
      timeSlot: v.note || "10:00 AM - 12:00 PM",
      room: {
        _id: String(v.room_id),
        id: String(v.room_id),
        title: v.title,
        city: v.city,
        locality: v.locality,
        address: { city: v.city, locality: v.locality },
        media: imgs.length > 0 ? imgs.map(url => ({ url })) : []
      }
    };
  });
  ok(res,200,"Visits fetched",items);
});
r.patch("/:id/approve",async(req,res)=>update(req,res,"approved"));
r.patch("/:id/reschedule",async(req,res)=>update(req,res,"pending"));
r.patch("/:id/cancel",async(req,res)=>update(req,res,"cancelled"));
async function update(req,res,status){
  const nextDate = req.body.scheduledAt || req.body.scheduledDate || null;
  const {rows}=await query("UPDATE visits SET status=$1,scheduled_at=COALESCE($2,scheduled_at) WHERE id=$3 AND (seeker_id=$4 OR owner_id=$4) RETURNING *",[status,nextDate,req.params.id,req.user.id]);
  if(!rows[0])return res.status(404).json({success:false,message:"Visit not found"});
  ok(res,200,"Visit updated",rows[0]);
}
export default r;
