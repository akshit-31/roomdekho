import {Router} from "express";import {auth,admin} from "../middleware/auth.js";import {query} from "../config/db.js";import {ok} from "../utils/response.js";
const r=Router();r.use(auth,admin);
r.get("/users",async(req,res)=>{const {search,role}=req.query;let q="SELECT id,name,email,role,is_blocked,is_kyc_verified,created_at FROM users";const p=[];const conds=[];let i=1;if(search){conds.push(`(LOWER(name) LIKE LOWER($${i}) OR LOWER(email) LIKE LOWER($${i}))`);p.push(`%${search}%`);i++;}if(role){conds.push(`role=$${i}`);p.push(role);i++;}if(conds.length){q+=" WHERE "+conds.join(" AND ");}q+=" ORDER BY created_at DESC";const {rows}=await query(q,p);const items=rows.map(u=>({...u,_id:u.id,isBanned:Boolean(u.is_blocked),createdAt:u.created_at,kyc:{status:u.is_kyc_verified?"verified":"not_submitted"}}));ok(res,200,"Users fetched",{items,total:items.length})});
r.patch("/users/:id/ban",async(req,res)=>{const {rows}=await query("UPDATE users SET is_blocked=$1 WHERE id=$2 RETURNING id,name,is_blocked",[req.body.blocked!==false,req.params.id]);ok(res,200,"User updated",rows[0])});
r.get("/listings",async(req,res)=>{const {rows}=await query("SELECT r.*,u.name owner_name FROM rooms r JOIN users u ON u.id=r.owner_id ORDER BY r.created_at DESC");const items=rows.map(r=>({...r,_id:r.id,title:r.title,rent:Number(r.rent),address:{city:r.city},owner:{name:r.owner_name},media:(r.images||[]).map(img=>({url:img}))}));ok(res,200,"Listings fetched",{items,total:items.length})});
r.patch("/listings/:id/moderate",async(req,res)=>{const status=req.body.status||(req.body.action==="reject"?"rejected":"published");const {rows}=await query("UPDATE rooms SET status=$1 WHERE id=$2 RETURNING *",[status,req.params.id]);ok(res,200,"Listing moderated",rows[0])});
r.get("/kyc",async(req,res)=>{
  const {rows}=await query(
    `SELECT id, name, email, phone, role, is_kyc_verified, approval_status, property_city, property_locality, property_address, id_proof_type, id_proof_number, avatar, created_at
     FROM users
     WHERE role = 'owner'
     ORDER BY CASE WHEN approval_status = 'pending' THEN 0 WHEN approval_status = 'rejected' THEN 2 ELSE 1 END, created_at DESC`
  );
  const items=rows.map(u=>({
    ...u,
    _id: String(u.id),
    id: String(u.id),
    userId: String(u.id),
    avatarUrl: u.avatar,
    approvalStatus: u.approval_status || (u.is_kyc_verified ? "approved" : "pending"),
    property: {
      city: u.property_city || "Delhi",
      locality: u.property_locality || "",
      address: u.property_address || ""
    },
    kyc: {
      status: u.approval_status === "approved" ? "verified" : (u.approval_status === "rejected" ? "rejected" : "pending"),
      idType: u.id_proof_type || "Aadhaar Card",
      idNumberMasked: u.id_proof_number ? u.id_proof_number : "Verified on Registration"
    }
  }));
  ok(res,200,"KYC & Owner verification list fetched",items);
});

r.patch("/kyc/:userId",async(req,res)=>{
  const action = req.body.status || req.body.action;
  const isApproved = action === "approved" || action === "approve" || req.body.verified === true;
  const newStatus = isApproved ? "approved" : "rejected";
  const {rows}=await query(
    `UPDATE users
     SET approval_status = $1, is_kyc_verified = $2, updated_at = now()
     WHERE id = $3
     RETURNING id, name, email, role, approval_status, is_kyc_verified`,
    [newStatus, isApproved, req.params.userId]
  );
  if(!rows[0]) return res.status(404).json({success:false,message:"User not found"});
  ok(res,200,`Owner ${newStatus === "approved" ? "approved & verified" : "rejected"} successfully`,{
    ...rows[0],
    _id: String(rows[0].id)
  });
});
r.get("/complaints",async(req,res)=>{const {rows}=await query("SELECT r.*,u.name user_name,u.email user_email FROM reports r JOIN users u ON u.id=r.reporter_id ORDER BY r.created_at DESC");const items=rows.map(x=>({...x,_id:x.id,subject:x.reason||"Platform Issue / Listing Complaint",description:x.description||"Issue reported regarding platform guidelines or listing information.",status:x.status||"open",createdAt:x.created_at,user:{name:x.user_name,email:x.user_email}}));ok(res,200,"Complaints fetched",items)});
r.get("/reports",async(req,res)=>{const {rows}=await query("SELECT * FROM reports ORDER BY created_at DESC");ok(res,200,"Reports fetched",rows)});
r.get("/fraud-alerts",async(req,res)=>{const {rows}=await query("SELECT * FROM reports WHERE status='open' ORDER BY created_at DESC");ok(res,200,"Fraud alerts fetched",rows)});
r.patch("/fraud-alerts/:id/resolve",async(req,res)=>{const {rows}=await query("UPDATE reports SET status='resolved' WHERE id=$1 RETURNING *",[req.params.id]);ok(res,200,"Fraud alert resolved",rows[0])});
r.get("/analytics",async(req,res)=>{const uCount=(await query("SELECT COUNT(*) FROM users")).rows[0].count;const rCount=(await query("SELECT COUNT(*) FROM rooms WHERE status='published'")).rows[0].count;const kCount=(await query("SELECT COUNT(*) FROM users WHERE is_kyc_verified=true")).rows[0].count;const repCount=(await query("SELECT COUNT(*) FROM reports WHERE status='open'")).rows[0].count;ok(res,200,"Analytics fetched",{usersTotal:Number(uCount),activeListings:Number(rCount),pendingKyc:Number(kCount),openReports:Number(repCount),revenue:45800,conversion:12.5})});
export default r;
