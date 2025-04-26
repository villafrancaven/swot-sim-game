"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { createRoom } from "@/api/room";

export default function RegisterPage() {
    const router = useRouter();

    const setRoomNumberStore = useGameStore((state) => state.setRoomNumber);
    const setPlayersStore = useGameStore((state) => state.setPlayers);
    const setPlayerIdStore = useGameStore((state) => state.setPlayerId);

    const [name, setName] = useState("");
    const [team, setTeam] = useState<"busdev" | "risk" | null>(null);
    const [roomNumber, setRoomNumber] = useState<number | "">("");
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({
        name: "",
        team: "",
        roomNumber: "",
    });

    const [submitError, setSubmitError] = useState("");

    const validateForm = () => {
        const newErrors = {
            name: name ? "" : "Name is required",
            team: team ? "" : "Team selection is required",
            roomNumber:
                roomNumber === ""
                    ? "Room number is required"
                    : isNaN(Number(roomNumber))
                    ? "Room number must be a valid number"
                    : "",
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setSubmitError("");

        try {
            const response = await createRoom(
                roomNumber.toString(),
                name,
                team === "busdev" ? "BusDev" : "Risk"
            );

            const player = response.players.find(
                (player) => player.name === name
            );
            if (player) {
                setPlayerIdStore(player.id);
                setRoomNumberStore(Number(response.room_number));
                setPlayersStore(
                    response.players.map((player) => ({
                        ...player,
                        factors: {
                            brand: { score: 0, reason: "", status: "TBD" },
                            tech: { score: 0, reason: "", status: "TBD" },
                        },
                    }))
                );
            }

            router.push("/swot");
        } catch (error: any) {
            console.error("Failed to create room:", error);
            setSubmitError(
                error?.error ||
                    "Failed to create or join room. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    Enter A Simulation Room
                </h1>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Your Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Select Team
                    </label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setTeam("busdev")}
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                                team === "busdev"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100"
                            }`}
                        >
                            Business Development
                        </button>
                        <button
                            onClick={() => setTeam("risk")}
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                                team === "risk"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100"
                            }`}
                        >
                            Risk Management
                        </button>
                    </div>
                    {errors.team && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.team}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-medium">
                        Room Number
                    </label>
                    <input
                        type="number"
                        value={roomNumber}
                        onChange={(e) =>
                            setRoomNumber(
                                e.target.value ? Number(e.target.value) : ""
                            )
                        }
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.roomNumber && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.roomNumber}
                        </p>
                    )}
                </div>

                {submitError && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {submitError}
                    </p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-opacity ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isLoading && (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    )}
                    {isLoading ? "Entering..." : "Enter Room"}
                </button>
            </div>
        </main>
    );
}
