import {Router} from "express";import {auth} from "../middleware/auth.js";import {query} from "../config/db.js";import {ok} from "../utils/response.js";
const r=Router();
r.get("/mine",auth,async(req,res)=>{
  const type=req.query.type||"received";
  let q;
  if(type==="written"){
    q=`SELECT rv.*,u.name reviewer_name,u.avatar reviewer_avatar FROM reviews rv JOIN users u ON u.id=rv.reviewer_id WHERE rv.reviewer_id=$1 ORDER BY rv.created_at DESC`;
  }else{
    q=`SELECT rv.*,u.name reviewer_name,u.avatar reviewer_avatar FROM reviews rv JOIN users u ON u.id=rv.reviewer_id WHERE rv.target_type='user' AND rv.target_id=$1 ORDER BY rv.created_at DESC`;
  }
  const {rows}=await query(q,[req.user.id]);
  const items=rows.map(x=>({...x,_id:String(x.id),id:String(x.id),author:{name:x.reviewer_name,avatarUrl:x.reviewer_avatar}}));
  ok(res,200,"My reviews",items);
});
r.get("/:targetType/:targetId",async(req,res)=>{const {rows}=await query("SELECT rv.*,u.name reviewer_name,u.avatar reviewer_avatar FROM reviews rv JOIN users u ON u.id=rv.reviewer_id WHERE target_type=$1 AND target_id=$2 ORDER BY created_at DESC",[req.params.targetType,req.params.targetId]);const items=rows.map(x=>({...x,_id:String(x.id),id:String(x.id),author:{name:x.reviewer_name,avatarUrl:x.reviewer_avatar}}));ok(res,200,"Reviews fetched",items)});
r.post("/",auth,async(req,res)=>{const b=req.body;if(!b.targetType||!b.targetId||!b.rating)return res.status(400).json({success:false,message:"Target and rating are required"});const {rows}=await query("INSERT INTO reviews(reviewer_id,target_type,target_id,rating,comment) VALUES($1,$2,$3,$4,$5) RETURNING *",[req.user.id,b.targetType,b.targetId,b.rating,b.comment]);ok(res,201,"Review added",{...rows[0],_id:String(rows[0].id)})});
r.post("/:id/report",auth,async(req,res)=>ok(res,200,"Review reported",{id:req.params.id}));export default r;
