import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api.config";

let socket = null;

export function connectSocket(userId) {
  if (socket) return socket;
  socket = io(SOCKET_URL, { auth: { userId }, withCredentials: true });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
