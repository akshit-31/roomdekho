import { getSocket } from "./socket";

export function onPresenceUpdate(cb) {
  getSocket()?.on("presence:update", cb);
  return () => getSocket()?.off("presence:update", cb);
}
