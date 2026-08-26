export function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

// Haversine formula — client-side estimate for quick UI display;
// authoritative distance/duration comes from the backend maps API.
export function haversineKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
