"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FactorSlider from "@/components/FactorSlider";
import FactorModal from "@/components/FactorModal";
import { useGameStore } from "@/store/useGameStore";
import { factorInfo } from "@/utils/constants";
import { submitPlayerResponses } from "@/api/player";
import { useUIStore } from "@/store/useUIStore";

export default function Phase1Page() {
    const [modalKey, setModalKey] = useState<null | keyof typeof factorInfo>(
        null
    );
    const router = useRouter();

    const playerId = useGameStore((s) => s.playerId);
    const players = useGameStore((s) => s.players);
    const updateMyFactor = useGameStore((s) => s.updateMyFactor);

    const openModal = useUIStore((s) => s.openModal);

    const me = players.find((p) => p.id === playerId);

    useEffect(() => {
        openModal("mission");
    }, [openModal]);

    if (!me) return null;

    const handleSubmit = async () => {
        try {
            const payload = {
                brand_market_score: me.factors.brand.score,
                brand_market_reason: me.factors.brand.reason,
                tech_infra_score: me.factors.tech.score,
                tech_infra_reason: me.factors.tech.reason,
            };

            await submitPlayerResponses(playerId, payload);
            router.push("/swot/phase2");
        } catch (error) {
            console.error("Failed to submit responses", error);
            alert("Oops! Something went wrong. Please try again.");
        }
    };

    const scores = Object.values(me.factors).map((f) => f.score);
    const averageScore = scores.length
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length
        : 0;

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Stage 1: Analysis and Due Diligence
                </h1>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                        {me.name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                        {me.role}
                    </p>
                </div>
            </div>

            {Object.entries(factorInfo).map(([key, { title }]) => {
                const typedKey = key as "brand" | "tech";
                return (
                    <FactorSlider
                        key={typedKey}
                        title={title}
                        value={me.factors[typedKey].score}
                        text={me.factors[typedKey].reason}
                        onChangeScore={(val) => updateMyFactor(typedKey, val)}
                        onChangeText={(val) =>
                            updateMyFactor(typedKey, undefined, val)
                        }
                        onOpenModal={() => setModalKey(typedKey)}
                    />
                );
            })}

            <div className="mt-4 text-right text-gray-700 font-medium">
                Average Score:{" "}
                <span className="font-bold">{averageScore.toFixed(1)}</span>
            </div>

            {modalKey && (
                <FactorModal
                    title={factorInfo[modalKey].title}
                    hint={factorInfo[modalKey].hint}
                    onClose={() => setModalKey(null)}
                />
            )}

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
                >
                    Submit & Continue
                </button>
            </div>
        </main>
    );
}
