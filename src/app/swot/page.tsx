"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initSocket, disconnectSocket } from "@/api/socket";
import { useGameStore } from "@/store/useGameStore";

export default function SWOTLanding() {
    const router = useRouter();

    const roomNumber = useGameStore((state) => state.roomNumber);
    const playerId = useGameStore((state) => state.playerId);
    const players = useGameStore((state) => state.players);

    const myPlayer = players.find((p) => p.id === playerId);
    const name = myPlayer?.name;
    const role = myPlayer?.role;

    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!roomNumber || !name || !role) return;

        const socket = initSocket();

        socket.emit("join_room", {
            room_number: roomNumber,
            name,
            role,
        });

        socket.off("room_update");
        socket.on("room_update", (data: { players: string[] }) => {
            setPlayerNames(data.players);
            setReady(data.players.length === 2);
        });

        return () => {
            socket.off("room_update");
            disconnectSocket();
        };
    }, [roomNumber, name, role]);

    const handleStart = () => {
        router.push("/swot/phase1");
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-white">
            <div className="max-w-md w-full p-6 rounded-2xl shadow-lg border border-gray-200">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Welcome to Room {roomNumber}
                </h1>

                <div className="mb-4 text-center">
                    {playerNames.length < 2 ? (
                        <p className="text-gray-700">
                            Waiting for other player to join...
                        </p>
                    ) : null}
                    <ul className="mt-4 space-y-2">
                        {playerNames.map((player, index) => (
                            <li
                                key={index}
                                className="bg-blue-100 rounded-lg py-2 px-4 text-blue-900"
                            >
                                {player}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={handleStart}
                    disabled={!ready}
                    className={`w-full py-2 mt-4 rounded-lg font-semibold transition ${
                        ready
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                    {ready ? "Start Game" : "Waiting for player..."}
                </button>
            </div>
        </main>
    );
}
