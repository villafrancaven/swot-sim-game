import { useEffect, useRef } from "react";
import { initSocket } from "@/api/socket";
import { useGameStore } from "@/store/useGameStore";
import { getRoomDetails } from "@/api/room";

export const usePhase2Socket = () => {
    const roomNumber = useGameStore((state) => state.roomNumber);
    const playerId = useGameStore((state) => state.playerId);
    const setPlayers = useGameStore((state) => state.setPlayers);

    const socketRef = useRef(initSocket());
    const socket = socketRef.current;

    useEffect(() => {
        if (!roomNumber || !playerId) return;

        const socket = initSocket();
        socketRef.current = socket;

        const joinRoom = async () => {
            try {
                const response = await getRoomDetails(String(roomNumber));
                const players = response.players;
                const currentPlayer = players.find((p) => p.id === playerId);

                if (!currentPlayer) {
                    console.warn("Current player not found in room");
                    return;
                }

                socket.emit("join_room", {
                    room_number: roomNumber,
                    name: currentPlayer.name,
                    role: currentPlayer.role,
                });

                console.log("✅ Joined room successfully");
                setPlayers(players);
            } catch (error) {
                console.error("❌ Failed to join room", error);
            }
        };

        joinRoom();

        // Listen for events
        socket.on("player_submitted", async () => {
            console.log("📥 Received player_submitted");
            try {
                const response = await getRoomDetails(String(roomNumber));
                setPlayers(response.players);
            } catch (error) {
                console.error(
                    "❌ Error fetching players on player_submitted",
                    error
                );
            }
        });

        socket.on("room_update", async () => {
            console.log("📥 Received room_update");
            try {
                const response = await getRoomDetails(String(roomNumber));
                setPlayers(response.players);
            } catch (error) {
                console.error(
                    "❌ Error fetching players on room_update",
                    error
                );
            }
        });

        socket.on("factor_updated", (data) => {
            console.log("📥 Received factor_updated", data);
        });

        return () => {
            socket.off("player_submitted");
            socket.off("room_update");
            socket.off("factor_updated");
        };
    }, [roomNumber, playerId, setPlayers]);

    return { socket };
};
