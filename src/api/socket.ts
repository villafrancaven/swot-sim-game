import { io, Socket } from "socket.io-client";
import { BASE_API_URL } from "@/utils/HttpMethod";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
    if (!socket) {
        socket = io(BASE_API_URL, {
            transports: ["websocket", "polling"],
        });

        // Listener for successful connection
        socket.on("connect", () => {
            console.log("Socket connected:", socket?.id);
        });

        // Listener for connection errors
        socket.on("connect_error", (error: any) => {
            console.error("Socket connection error:", error);
        });

        // Listener for disconnection events
        socket.on("disconnect", (reason: string) => {
            console.log("Socket disconnected:", reason);
        });
    }
    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log("Socket connection terminated.");
        socket = null;
    }
};
