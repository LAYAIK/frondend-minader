import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(userId) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    const s = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3003", {
      transports: ["websocket"],
      withCredentials: true
    });
    socketRef.current = s;
    s.on("connect", () => {
      console.log("Socket connected", s.id);
      s.emit("joinUser", { userId });
    });
    return () => s.disconnect();
  }, [userId]);

  return socketRef;
}
