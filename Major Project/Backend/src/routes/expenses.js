import {Router} from "express";import {auth} from "../middleware/auth.js";import {query} from "../config/db.js";import {ok} from "../utils/response.js";
const r=Router();r.use(auth);
r.post("/rent-calculator",async(req,res)=>{const rent=Number(req.body.rent||0),electricity=Number(req.body.electricity||0),wifi=Number(req.body.wifi||0),maintenance=Number(req.body.maintenance||0),people=Number(req.body.people||1);const total=rent+electricity+wifi+maintenance;ok(res,200,"Rent calculated",{total,perPerson:total/people})});
r.post("/split",async(req,res)=>{const amount=Number(req.body.amount||0),people=Math.max(Number(req.body.people||req.body.totalPeople||1),1);ok(res,200,"Expense split",{amount,people,perPerson:amount/people})});
r.get("/mine",async(req,res)=>{const {rows}=await query("SELECT * FROM expenses WHERE user_id=$1 ORDER BY created_at DESC",[req.user.id]);ok(res,200,"Expenses fetched",rows)});
r.post("/",async(req,res)=>{const {rows}=await query("INSERT INTO expenses(user_id,title,amount,total_people) VALUES($1,$2,$3,$4) RETURNING *",[req.user.id,req.body.title,req.body.amount,req.body.totalPeople||1]);ok(res,201,"Expense added",rows[0])});
r.patch("/:id/paid",async(req,res)=>{const {rows}=await query("UPDATE expenses SET paid=true WHERE id=$1 AND user_id=$2 RETURNING *",[req.params.id,req.user.id]);ok(res,200,"Expense marked paid",rows[0]||null)});export default r;
