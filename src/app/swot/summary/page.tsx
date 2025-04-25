"use client";

import { useGameStore } from "@/store/useGameStore";

export default function SummaryPage() {
    const { players } = useGameStore();

    const averageScore = (role: "BusDev" | "Risk") => {
        const teamPlayers = players.filter((player) => player.role === role);
        const totalScore = teamPlayers.reduce((total, player) => {
            const brandScore = player.factors.brand.score || 0;
            const techScore = player.factors.tech.score || 0;
            return total + brandScore + techScore;
        }, 0);
        const average =
            teamPlayers.length > 0 ? totalScore / teamPlayers.length : 0;
        return average.toFixed(2);
    };

    const getReasonsAndScores = (role: "BusDev" | "Risk") => {
        return players
            .filter((player) => player.role === role)
            .map((player) => ({
                name: player.name,
                brandScore: player.factors.brand.score,
                techScore: player.factors.tech.score,
                reasons: {
                    brand: player.factors.brand.reason,
                    tech: player.factors.tech.reason,
                },
            }));
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Game Summary</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold">Average Score</h2>
                <p className="mt-2 text-lg">
                    Business Development: {averageScore("BusDev")}
                </p>
                <p className="mt-2 text-lg">
                    Risk Management: {averageScore("Risk")}
                </p>
            </div>

            <div className="space-y-6 w-full max-w-4xl">
                <div className="bg-blue-100 p-6 rounded-xl shadow-xl">
                    <h3 className="font-semibold text-xl mb-2">
                        Business Development Team
                    </h3>
                    {getReasonsAndScores("BusDev").map((player) => (
                        <div
                            key={player.name}
                            className="mb-4 p-4 border rounded-lg bg-white shadow-md"
                        >
                            <h4 className="font-semibold">{player.name}</h4>
                            <div className="mb-2">
                                <p>
                                    <strong>Brand Score:</strong>{" "}
                                    {player.brandScore}
                                </p>
                                <p>
                                    <strong>Brand Reason:</strong>{" "}
                                    {player.reasons.brand}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Tech Score:</strong>{" "}
                                    {player.techScore}
                                </p>
                                <p>
                                    <strong>Tech Reason:</strong>{" "}
                                    {player.reasons.tech}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-red-100 p-6 rounded-xl shadow-xl">
                    <h3 className="font-semibold text-xl mb-2">
                        Risk Management Team
                    </h3>
                    {getReasonsAndScores("Risk").map((player) => (
                        <div
                            key={player.name}
                            className="mb-4 p-4 border rounded-lg bg-white shadow-md"
                        >
                            <h4 className="font-semibold">{player.name}</h4>
                            <div className="mb-2">
                                <p>
                                    <strong>Brand Score:</strong>{" "}
                                    {player.brandScore}
                                </p>
                                <p>
                                    <strong>Brand Reason:</strong>{" "}
                                    {player.reasons.brand}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Tech Score:</strong>{" "}
                                    {player.techScore}
                                </p>
                                <p>
                                    <strong>Tech Reason:</strong>{" "}
                                    {player.reasons.tech}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
