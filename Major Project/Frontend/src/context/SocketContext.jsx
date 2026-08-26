import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "../socket/socket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const user = useSelector((s) => s.auth.user);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.id) {
      const s = connectSocket(user.id);
      setSocket(s);
      return () => disconnectSocket();
    }
  }, [user?.id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  return useContext(SocketContext);
}
