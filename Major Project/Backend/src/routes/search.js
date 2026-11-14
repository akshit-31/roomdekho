import {Router} from "express"; import {query} from "../config/db.js"; import {ok} from "../utils/response.js"; import {roomRow} from "./rooms.js";
const r=Router();
r.get("/", async (req, res) => {
  const { q, city, minRent, maxRent, lat, lng } = req.query;
  const w = ["r.status='published'"], p = [];
  let i = 1;
  if (q) {
    w.push(`(LOWER(r.title) LIKE LOWER($${i}) OR LOWER(r.city) LIKE LOWER($${i}) OR LOWER(r.locality) LIKE LOWER($${i}))`);
    p.push(`%${q}%`);
    i++;
  }
  if (city) {
    w.push(`LOWER(r.city)=LOWER($${i++})`);
    p.push(city);
  }
  if (minRent) {
    w.push(`r.rent >= $${i++}`);
    p.push(Number(minRent));
  }
  if (maxRent) {
    w.push(`r.rent <= $${i++}`);
    p.push(Number(maxRent));
  }

  const hasGps = (lat !== undefined && lng !== undefined && !isNaN(Number(lat)) && !isNaN(Number(lng)));
  let distanceSelect = "";
  let order = "r.created_at DESC";
  if (hasGps) {
    distanceSelect = `,
      ROUND(CAST(
        6371 * acos(
          LEAST(1.0, GREATEST(-1.0,
            cos(radians($${i++})) * cos(radians(COALESCE(r.latitude, 28.6139))) *
            cos(radians(COALESCE(r.longitude, 77.2090)) - radians($${i++})) +
            sin(radians($${i-2})) * sin(radians(COALESCE(r.latitude, 28.6139)))
          ))
        ) AS numeric
      ), 1) AS distance
    `;
    p.push(Number(lat), Number(lng));
    order = "distance ASC, r.created_at DESC";
  }

  const { rows } = await query(
    `SELECT r.*, u.name owner_name, u.avatar owner_avatar, u.is_kyc_verified owner_kyc ${distanceSelect}
     FROM rooms r
     JOIN users u ON u.id = r.owner_id
     WHERE ${w.join(" AND ")}
     ORDER BY ${order}
     LIMIT 50`,
    p
  );
  const items = rows.map(roomRow);
  ok(res, 200, "Search results", { items, total: items.length });
});
export default r;
