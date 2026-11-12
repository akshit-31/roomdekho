import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { query } from "../config/db.js";
import { ok } from "../utils/response.js";

const r = Router();
r.use(auth);

// GET /chat - List all conversations for active user
r.get("/", async (req, res) => {
  const { rows } = await query(
    `SELECT c.*, 
            CASE WHEN c.user_one=$1 THEN c.user_two ELSE c.user_one END AS other_user_id, 
            u.name AS other_user_name, 
            u.email AS other_user_email, 
            u.role AS other_user_role, 
            u.avatar AS other_user_avatar,
            (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
            (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_at
     FROM conversations c 
     JOIN users u ON u.id = (CASE WHEN c.user_one=$1 THEN c.user_two ELSE c.user_one END) 
     WHERE c.user_one=$1 OR c.user_two=$1 
     ORDER BY COALESCE((SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1), c.created_at) DESC`,
    [req.user.id]
  );

  const items = rows.map((x) => ({
    ...x,
    _id: String(x.id),
    id: String(x.id),
    lastMessage: x.last_message || "Started a new conversation",
    updatedAt: x.last_message_at || x.created_at,
    otherUser: {
      _id: String(x.other_user_id),
      id: String(x.other_user_id),
      name: x.other_user_name,
      email: x.other_user_email,
      role: x.other_user_role,
      avatarUrl: x.other_user_avatar,
    },
  }));
  ok(res, 200, "Conversations fetched", items);
});

// POST /chat - Start or get existing conversation with a user
r.post("/", async (req, res) => {
  let { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, message: "userId required" });
  userId = Number(userId);

  if (userId === Number(req.user.id)) {
    return res.status(400).json({ success: false, message: "Cannot start a chat with yourself" });
  }

  let a = Math.min(req.user.id, userId);
  let b = Math.max(req.user.id, userId);

  const { rows } = await query(
    `INSERT INTO conversations(user_one, user_two) 
     VALUES($1, $2) 
     ON CONFLICT(user_one, user_two) DO UPDATE SET updated_at=now() 
     RETURNING *`,
    [a, b]
  );

  const otherUserRes = await query("SELECT id, name, email, role, avatar FROM users WHERE id=$1", [userId]);
  const otherUser = otherUserRes.rows[0] || {};

  const conv = {
    ...rows[0],
    _id: String(rows[0].id),
    id: String(rows[0].id),
    otherUser: {
      _id: String(otherUser.id),
      id: String(otherUser.id),
      name: otherUser.name,
      email: otherUser.email,
      role: otherUser.role,
      avatarUrl: otherUser.avatar,
    },
  };

  ok(res, 201, "Conversation ready", conv);
});

// GET /chat/:id - Get conversation details & message history
r.get("/:id", async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM conversations WHERE id=$1 AND (user_one=$2 OR user_two=$2)",
    [req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ success: false, message: "Conversation not found" });

  const otherUserId = rows[0].user_one === req.user.id ? rows[0].user_two : rows[0].user_one;
  const otherUserRes = await query("SELECT id, name, email, role, avatar FROM users WHERE id=$1", [otherUserId]);
  const otherUser = otherUserRes.rows[0] || {};

  const m = await query(
    `SELECT m.*, u.name sender_name, u.avatar sender_avatar 
     FROM messages m 
     JOIN users u ON u.id = m.sender_id 
     WHERE m.conversation_id = $1 
     ORDER BY m.created_at ASC`,
    [req.params.id]
  );

  const messages = m.rows.map((x) => ({
    ...x,
    _id: String(x.id),
    id: String(x.id),
    text: x.body,
    content: x.body,
    imageUrl: x.image_url,
    sentAt: x.created_at,
    senderId: String(x.sender_id),
    sender: {
      _id: String(x.sender_id),
      name: x.sender_name,
      avatarUrl: x.sender_avatar,
    },
  }));

  ok(res, 200, "Conversation fetched", {
    conversation: {
      ...rows[0],
      _id: String(rows[0].id),
      id: String(rows[0].id),
      otherUser: {
        _id: String(otherUser.id),
        id: String(otherUser.id),
        name: otherUser.name,
        email: otherUser.email,
        role: otherUser.role,
        avatarUrl: otherUser.avatar,
      },
    },
    messages,
  });
});

// POST /chat/:id/messages - Send text or image message
r.post("/:id/messages", async (req, res) => {
  const c = (
    await query("SELECT * FROM conversations WHERE id=$1 AND (user_one=$2 OR user_two=$2)", [
      req.params.id,
      req.user.id,
    ])
  ).rows[0];

  if (!c) return res.status(404).json({ success: false, message: "Conversation not found" });

  const text = req.body.body || req.body.text || req.body.message || "";
  const imageUrl = req.body.imageUrl || req.body.image || null;

  if (!text && !imageUrl) {
    return res.status(400).json({ success: false, message: "Message text or image is required" });
  }

  const { rows } = await query(
    "INSERT INTO messages(conversation_id, sender_id, body, image_url) VALUES($1, $2, $3, $4) RETURNING *",
    [req.params.id, req.user.id, text, imageUrl]
  );

  const u = (await query("SELECT name, avatar FROM users WHERE id=$1", [req.user.id])).rows[0] || {};
  const msg = {
    ...rows[0],
    _id: String(rows[0].id),
    id: String(rows[0].id),
    text: rows[0].body,
    content: rows[0].body,
    imageUrl: rows[0].image_url,
    sentAt: rows[0].created_at,
    senderId: String(rows[0].sender_id),
    sender: {
      _id: String(rows[0].sender_id),
      name: u.name,
      avatarUrl: u.avatar,
    },
  };

  req.app.get("io")?.to(`conversation:${req.params.id}`).emit("chat:message", msg);
  req.app.get("io")?.to(`conversation:${req.params.id}`).emit("message:new", msg);
  ok(res, 201, "Message sent", msg);
});

// GET /chat/:id/search
r.get("/:id/search", async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM messages WHERE conversation_id=$1 AND body ILIKE $2 ORDER BY created_at DESC",
    [req.params.id, `%${req.query.q || ""}%`]
  );
  ok(res, 200, "Messages found", rows);
});

export default r;
