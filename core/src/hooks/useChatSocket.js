import { useEffect, useState } from "react";
import { initSocket, getSocket } from "../api/socket.js";

export function useChatSocket(userId, token) {
  const [chatList, setChatList] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!userId || !token) return;

    const socket = initSocket();

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
      setSocketConnected(true);

      // Register user
      // socket.emit("register_user", { user_id: userId });
    });

    socket.on("register_user", (data) => {
      console.log("User registered:", data);

      // Fetch chat list immediately after registration
      socket.emit("fetch_user_chat_list", { user_id: userId });
    });

    socket.on("user_chat_list", (data) => {
      console.log("Chat list received:", data);
      setChatList(data);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("register_user");
      socket.off("user_chat_list");
      socket.off("connect_error");
      socket.off("error");
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [userId, token]);

  return { chatList, socketConnected, socket: getSocket() };
}
