import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: "/unibox/socket.io",
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export const getSocket = () => socket;
