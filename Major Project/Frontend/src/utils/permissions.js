export function hasRole(user, ...roles) {
  return !!user && roles.includes(user.role);
}

export function isOwner(user) {
  return hasRole(user, "owner");
}

export function isAdmin(user) {
  return hasRole(user, "admin");
}
