import {Router} from "express";import {auth} from "../middleware/auth.js";import {query} from "../config/db.js";import {ok} from "../utils/response.js";
const r=Router();r.use(auth);r.get("/",async(req,res)=>{const {rows}=await query("SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50",[req.user.id]);ok(res,200,"Notifications fetched",rows)});
r.patch("/:id/read",async(req,res)=>{await query("UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2",[req.params.id,req.user.id]);ok(res,200,"Notification marked read")});
r.patch("/read-all",async(req,res)=>{await query("UPDATE notifications SET is_read=true WHERE user_id=$1",[req.user.id]);ok(res,200,"Notifications marked read")});export default r;
