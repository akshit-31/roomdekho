import { getSocket } from "./socket";

export function onNotification(cb) {
  getSocket()?.on("notification:new", cb);
  return () => getSocket()?.off("notification:new", cb);
}
