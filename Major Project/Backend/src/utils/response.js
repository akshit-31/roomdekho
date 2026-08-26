export function ok(res, status, message, data = null) {
  return res.status(status).json({ success: true, message, data });
}
export function fail(res, status, message) {
  return res.status(status).json({ success: false, message });
}
