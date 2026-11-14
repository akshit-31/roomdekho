import {Router} from "express";import {auth,admin} from "../middleware/auth.js";import {query} from "../config/db.js";import {ok} from "../utils/response.js";
const r=Router();r.use(auth,admin);
r.get("/users", async (req, res) => {
  const { search, role, page = 1, limit = 50 } = req.query;
  let q = `
    SELECT u.id, u.name, u.email, u.role, u.is_blocked, u.is_kyc_verified, u.created_at, u.avatar, u.intent,
           p.looking_for
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
  `;
  const p = [];
  const conds = [];
  let i = 1;

  if (search) {
    conds.push(`(LOWER(u.name) LIKE LOWER($${i}) OR LOWER(u.email) LIKE LOWER($${i}))`);
    p.push(`%${search}%`);
    i++;
  }

  if (role) {
    if (role === "both") {
      conds.push(`(COALESCE(u.intent, p.looking_for) = 'both') AND u.role NOT IN ('admin')`);
    } else if (role === "owner") {
      conds.push(`u.role = 'owner'`);
    } else if (role === "admin") {
      conds.push(`u.role = 'admin'`);
    } else if (role === "roommate") {
      conds.push(`(u.role = 'roommate' OR u.intent = 'find_roommate' OR p.looking_for = 'find_roommate' OR p.looking_for = 'roommate')`);
    } else if (role === "seeker") {
      conds.push(`(u.role = 'seeker' AND (COALESCE(u.intent, p.looking_for, 'find_room') IN ('find_room', 'seeker', 'room_seeker')))`);
    } else {
      conds.push(`u.role = $${i}`);
      p.push(role);
      i++;
    }
  }

  if (conds.length) {
    q += " WHERE " + conds.join(" AND ");
  }

  const countQ = conds.length ? `SELECT COUNT(*) FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE ${conds.join(" AND ")}` : `SELECT COUNT(*) FROM users`;
  const countRes = await query(countQ, p);
  const total = Number(countRes.rows[0].count);

  q += " ORDER BY u.created_at DESC";

  const lim = Math.min(Number(limit) || 50, 100);
  const off = (Math.max(Number(page) || 1, 1) - 1) * lim;
  q += ` LIMIT $${i++} OFFSET $${i++}`;
  p.push(lim, off);

  const { rows } = await query(q, p);
  const items = rows.map((u) => ({
    ...u,
    _id: String(u.id),
    id: String(u.id),
    avatarUrl: u.avatar,
    isBanned: Boolean(u.is_blocked),
    createdAt: u.created_at,
    intent: u.intent || u.looking_for || (u.role === "owner" ? "owner" : "both"),
    lookingFor: u.looking_for || u.intent || "both",
    kyc: { status: u.is_kyc_verified ? "verified" : "not_submitted" },
  }));

  ok(res, 200, "Users fetched", { items, total });
});

r.patch("/users/:id/ban", async (req, res) => {
  const { rows } = await query("UPDATE users SET is_blocked=$1 WHERE id=$2 RETURNING id,name,is_blocked", [
    req.body.blocked !== false,
    req.params.id,
  ]);
  ok(res, 200, "User updated", rows[0]);
});

r.get("/listings", async (req, res) => {
  const { status, search, page = 1, limit = 50 } = req.query;
  let q = `
    SELECT r.*, u.name owner_name, u.email owner_email, u.phone owner_phone, u.avatar owner_avatar
    FROM rooms r
    JOIN users u ON u.id = r.owner_id
  `;
  const p = [];
  const conds = [];
  let i = 1;

  if (status && status !== "all") {
    conds.push(`r.status = $${i++}`);
    p.push(status);
  }

  if (search) {
    conds.push(`(LOWER(r.title) LIKE LOWER($${i}) OR LOWER(r.city) LIKE LOWER($${i}) OR LOWER(u.name) LIKE LOWER($${i}))`);
    p.push(`%${search}%`);
    i++;
  }

  if (conds.length) {
    q += " WHERE " + conds.join(" AND ");
  }

  const countQ = conds.length ? `SELECT COUNT(*) FROM rooms r JOIN users u ON u.id = r.owner_id WHERE ${conds.join(" AND ")}` : `SELECT COUNT(*) FROM rooms r`;
  const countRes = await query(countQ, p);
  const total = Number(countRes.rows[0].count);

  q += `
    ORDER BY
      CASE
        WHEN r.status = 'pending' THEN 0
        WHEN r.status = 'published' THEN 1
        WHEN r.status = 'rejected' THEN 2
        ELSE 3
      END,
      r.created_at DESC
  `;

  const lim = Math.min(Number(limit) || 50, 100);
  const off = (Math.max(Number(page) || 1, 1) - 1) * lim;
  q += ` LIMIT $${i++} OFFSET $${i++}`;
  p.push(lim, off);

  const { rows } = await query(q, p);
  const items = rows.map((r) => ({
    ...r,
    _id: String(r.id),
    id: String(r.id),
    title: r.title,
    status: r.status || "pending",
    isVerified: Boolean(r.is_verified),
    rent: Number(r.rent),
    deposit: Number(r.deposit || 0),
    propertyType: r.property_type,
    roomType: r.room_type,
    furnishing: r.furnishing,
    city: r.city,
    locality: r.locality,
    address: {
      city: r.city,
      locality: r.locality,
      line1: r.address || "",
    },
    owner: {
      id: String(r.owner_id),
      name: r.owner_name,
      email: r.owner_email,
      phone: r.owner_phone,
      avatar: r.owner_avatar,
    },
    media: (r.images || []).map((img) => ({ url: img })),
    createdAt: r.created_at,
  }));

  ok(res, 200, "Listings fetched", { items, total });
});

r.patch("/listings/:id/moderate", async (req, res) => {
  const action = req.body.action || req.body.status;
  const isApprove = action === "approve" || action === "approved" || action === "published";
  const newStatus = isApprove ? "published" : "rejected";
  const isVerified = isApprove;

  const { rows } = await query(
    `UPDATE rooms
     SET status = $1, is_verified = $2, updated_at = now()
     WHERE id = $3
     RETURNING *`,
    [newStatus, isVerified, req.params.id]
  );

  if (!rows[0]) {
    return res.status(404).json({ success: false, message: "Listing not found" });
  }

  ok(res, 200, `Listing ${isApprove ? "approved & published to seekers" : "rejected"} successfully`, {
    ...rows[0],
    _id: String(rows[0].id),
    id: String(rows[0].id),
    status: rows[0].status,
    isVerified: Boolean(rows[0].is_verified),
  });
});
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
