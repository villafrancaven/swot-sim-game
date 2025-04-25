"use client";

import { useState, useEffect, useCallback } from "react";
import { getRoomDetails } from "@/api/room";
import { useGameStore } from "@/store/useGameStore";
import { submitPlayerResponses } from "@/api/player";
import { debounce } from "@/utils/debounce";
import { usePhase2Socket } from "./usePhase2Socket";
import { useRouter } from "next/navigation";

export default function Phase2Page() {
    const roomNumber = useGameStore((state) => state.roomNumber);
    const playerId = useGameStore((state) => state.playerId);
    const players = useGameStore((state) => state.players);
    const setPlayers = useGameStore((state) => state.setPlayers);
    const { socket } = usePhase2Socket();
    const router = useRouter();

    const me = players.find((p) => p.id === playerId);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!roomNumber) return;

            try {
                const response = await getRoomDetails(String(roomNumber));
                setPlayers(response.players);
            } catch (error) {
                console.error("Failed to load room details:", error);
            }
        };

        fetchRoom();
    }, [roomNumber, setPlayers]);

    const {
        players: gamePlayers,
        playerId: gamePlayerId,
        roomNumber: gameRoomNumber,
    } = useGameStore();

    const currentPlayer = gamePlayers.find((p) => p.id === gamePlayerId);
    const busdevPlayer = gamePlayers.find((p) => p.role === "BusDev");
    const riskPlayer = gamePlayers.find((p) => p.role === "Risk");

    const isBusDev = currentPlayer?.role === "BusDev";
    const isRisk = currentPlayer?.role === "Risk";

    const [localFactors, setLocalFactors] = useState({
        brand: {
            score: busdevPlayer?.factors.brand.score ?? 1,
            reason: busdevPlayer?.factors.brand.reason ?? "",
            status: riskPlayer?.factors.brand.status ?? "TBD",
        },
        tech: {
            score: busdevPlayer?.factors.tech.score ?? 1,
            reason: busdevPlayer?.factors.tech.reason ?? "",
            status: riskPlayer?.factors.tech.status ?? "TBD",
        },
    });

    useEffect(() => {
        if (busdevPlayer) {
            setLocalFactors({
                brand: {
                    score: busdevPlayer.factors.brand.score,
                    reason: busdevPlayer.factors.brand.reason,
                    status: riskPlayer?.factors.brand.status ?? "TBD",
                },
                tech: {
                    score: busdevPlayer.factors.tech.score,
                    reason: busdevPlayer.factors.tech.reason,
                    status: riskPlayer?.factors.tech.status ?? "TBD",
                },
            });
        }
    }, [busdevPlayer]);

    const submitChanges = async (updatedFactors = localFactors) => {
        try {
            const playerRequest = {
                brand_market_score: updatedFactors.brand.score,
                brand_market_reason: updatedFactors.brand.reason,
                tech_infra_score: updatedFactors.tech.score,
                tech_infra_reason: updatedFactors.tech.reason,
                brand_market_status: updatedFactors.brand.status,
                tech_infra_status: updatedFactors.tech.status,
            };

            await submitPlayerResponses(gamePlayerId, playerRequest);

            socket.emit("player_submitted", {
                player_id: gamePlayerId,
                room_id: gameRoomNumber,
                ...playerRequest,
            });

            console.log("Submitted:", playerRequest);
        } catch (error) {
            console.error("Failed to submit player responses:", error);
        }
    };

    const debouncedSubmitChanges = useCallback(
        debounce((updatedFactors) => {
            submitChanges(updatedFactors);
        }, 500),
        []
    );

    const handleInputChange = (
        factorKey: "brand" | "tech",
        field: "score" | "reason",
        value: number | string
    ) => {
        const updated = {
            ...localFactors,
            [factorKey]: {
                ...localFactors[factorKey],
                [field]: value,
            },
        };

        setLocalFactors(updated);
        debouncedSubmitChanges(updated);
    };

    const handleApproval = (factorKey: "brand" | "tech") => {
        const updated = {
            ...localFactors,
            [factorKey]: {
                ...localFactors[factorKey],
                status: "Okay",
            },
        };

        setLocalFactors(updated);
        submitChanges(updated);
    };

    const handleRevertToTBD = (factorKey: "brand" | "tech") => {
        const updated = {
            ...localFactors,
            [factorKey]: {
                ...localFactors[factorKey],
                status: "TBD",
            },
        };

        setLocalFactors(updated);
        submitChanges(updated);
    };

    const isAgreedToProceedEnabled =
        localFactors.brand.status === "Okay" &&
        localFactors.tech.status === "Okay";

    const handleProceed = () => {
        router.push("/swot/summary");
    };

    if (!currentPlayer || !busdevPlayer || !riskPlayer) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Stage 2: Structuring</h1>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                        {me?.name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                        {me?.role}
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-10">
                {/* Risk Team Scores */}
                <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                    <h2 className="text-lg font-bold mb-4">
                        Risk Team's Initial Scores
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {["brand", "tech"].map((factorKey) => {
                            const label =
                                factorKey === "brand"
                                    ? "Brand & Marketing"
                                    : "Tech & Infrastructure";
                            const score =
                                riskPlayer.factors[
                                    factorKey as "brand" | "tech"
                                ].score;

                            return (
                                <div
                                    key={factorKey}
                                    className="p-4 bg-white rounded-lg border shadow-sm"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold">
                                            {label}
                                        </h3>
                                        <span className="text-sm text-gray-600">
                                            Score: {score} / 10
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={10}
                                        value={score || 0}
                                        disabled
                                        className="w-full"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border rounded-xl bg-white shadow-md">
                    <h2 className="text-lg font-bold mb-4">
                        BusDev’s Factor Evaluation
                    </h2>
                    <div className="space-y-6">
                        {["brand", "tech"].map((factorKey) => {
                            const label =
                                factorKey === "brand"
                                    ? "Brand & Marketing"
                                    : "Tech & Infrastructure";
                            const factor =
                                localFactors[factorKey as "brand" | "tech"];

                            return (
                                <div
                                    key={factorKey}
                                    className="p-4 border rounded-2xl bg-white shadow-sm"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold">
                                            {label}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            Score: {factor.score} / 10
                                        </span>
                                    </div>

                                    <input
                                        type="range"
                                        min={1}
                                        max={10}
                                        value={factor.score || 0}
                                        disabled={!isBusDev}
                                        onChange={(e) =>
                                            handleInputChange(
                                                factorKey as "brand" | "tech",
                                                "score",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full mb-3"
                                    />

                                    <textarea
                                        className="w-full p-2 border rounded resize-none"
                                        rows={4}
                                        maxLength={300}
                                        placeholder="Enter bullet points (max 300 chars)"
                                        value={factor.reason || ""}
                                        disabled={!isBusDev}
                                        onChange={(e) =>
                                            handleInputChange(
                                                factorKey as "brand" | "tech",
                                                "reason",
                                                e.target.value
                                            )
                                        }
                                        onFocus={() => {
                                            if (
                                                isBusDev &&
                                                factor.reason.trim() === ""
                                            ) {
                                                handleInputChange(
                                                    factorKey as
                                                        | "brand"
                                                        | "tech",
                                                    "reason",
                                                    "• "
                                                );
                                            }
                                        }}
                                    />
                                    {isRisk && (
                                        <div className="flex mt-2">
                                            <button
                                                className="mr-2 px-4 py-2 bg-blue-500 text-sm text-white rounded hover:bg-blue-600 disabled:bg-blue-500 disabled:cursor-not-allowed"
                                                onClick={() =>
                                                    handleApproval(
                                                        factorKey as
                                                            | "brand"
                                                            | "tech"
                                                    )
                                                }
                                            >
                                                Okay
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-blue-500 text-sm text-white rounded hover:bg-blue-600 disabled:bg-blue-500 disabled:cursor-not-allowed"
                                                onClick={() =>
                                                    handleRevertToTBD(
                                                        factorKey as
                                                            | "tech"
                                                            | "brand"
                                                    )
                                                }
                                            >
                                                TBD
                                            </button>
                                        </div>
                                    )}
                                    <div className="mt-2 text-gray-500">
                                        Status:{" "}
                                        {
                                            riskPlayer?.factors[
                                                factorKey as "brand" | "tech"
                                            ].status
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={handleProceed}
                        disabled={!isAgreedToProceedEnabled}
                        className={`px-6 py-2 text-white rounded-full ${
                            isAgreedToProceedEnabled
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Agreed to Proceed
                    </button>
                </div>
            </div>
        </div>
    );
}
