import {Router} from "express";import {auth,owner} from "../middleware/auth.js";import {query} from "../config/db.js";import {ok} from "../utils/response.js";
const r=Router();r.use(auth,owner);
r.get("/dashboard",async(req,res)=>{
  const rooms=await query("SELECT COUNT(*) count, COALESCE(SUM(views),0) views FROM rooms WHERE owner_id=$1",[req.user.id]);
  const visits=await query("SELECT COUNT(*) count FROM visits WHERE owner_id=$1",[req.user.id]);
  const roomCount = Number(rooms.rows[0].count || 0);
  const viewCount = Number(rooms.rows[0].views || 0);
  const visitCount = Number(visits.rows[0].count || 0);
  ok(res,200,"Owner dashboard",{
    activeListings: roomCount,
    rooms: roomCount,
    views: viewCount,
    enquiries: visitCount,
    interestedUsers: visitCount,
    visits: visitCount,
    bookings: Math.floor(visitCount * 0.4),
    earnings: roomCount * 12500,
    avgRating: 4.8
  });
});
r.get("/enquiries",async(req,res)=>{
  const {rows}=await query(`SELECT v.*,r.title,u.name seeker_name,u.email seeker_email,u.avatar seeker_avatar FROM visits v JOIN rooms r ON r.id=v.room_id JOIN users u ON u.id=v.seeker_id WHERE v.owner_id=$1 ORDER BY v.created_at DESC`,[req.user.id]);
  const items = rows.map(x => ({
    ...x,
    _id: String(x.id),
    id: String(x.id),
    seeker: {
      name: x.seeker_name,
      email: x.seeker_email,
      avatarUrl: x.seeker_avatar
    },
    user: {
      name: x.seeker_name,
      email: x.seeker_email,
      avatarUrl: x.seeker_avatar
    },
    room: {
      title: x.title
    }
  }));
  ok(res,200,"Enquiries fetched",items);
});export default r;
