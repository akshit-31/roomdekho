// Thin wrapper so we have one place to swap storage strategy later.
// Access tokens are kept in memory (see store/auth/auth.store.js) —
// this is only used for non-sensitive UI preferences (e.g. theme).
export const storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};
