import { create } from "zustand";

type Factor = {
    score: number;
    reason: string;
    status: "TBD" | "Okay";
};

type Role = "BusDev" | "Risk";

export type Player = {
    id: number;
    name: string;
    role: Role;
    factors: {
        brand: Factor;
        tech: Factor;
    };
};

type GameState = {
    roomNumber: number;
    players: Player[];
    playerId: number;
    setRoomNumber: (room: number) => void;
    setPlayers: (players: Player[]) => void;
    setPlayerId: (id: number) => void;
    updateMyFactor: (
        factorKey: "brand" | "tech",
        score?: number,
        reason?: string
    ) => void;
    updatePlayerData: (updatedPlayer: Player) => void;
    updateFactorStatus: (
        playerId: number,
        factorKey: "brand" | "tech",
        status: "TBD" | "Okay"
    ) => void;
};

export const useGameStore = create<GameState>((set) => ({
    roomNumber: 0,
    players: [],
    playerId: 0,
    setRoomNumber: (roomNumber) => set(() => ({ roomNumber })),
    setPlayers: (players) => set(() => ({ players })),
    setPlayerId: (playerId) => set(() => ({ playerId })),
    updateMyFactor: (factorKey, score, reason) =>
        set((state) => {
            const updatedPlayers = state.players.map((player) => {
                if (player.id !== state.playerId) return player;

                const updatedFactor = {
                    ...player.factors[factorKey],
                    ...(score !== undefined ? { score } : {}),
                    ...(reason !== undefined ? { reason } : {}),
                };

                return {
                    ...player,
                    factors: {
                        ...player.factors,
                        [factorKey]: updatedFactor,
                    },
                };
            });

            return { players: updatedPlayers };
        }),
    updatePlayerData: (updatedPlayer) =>
        set((state) => {
            const updatedPlayers = state.players.map((player) =>
                player.id === updatedPlayer.id
                    ? { ...player, ...updatedPlayer }
                    : player
            );
            return { players: updatedPlayers };
        }),
    updateFactorStatus: (playerId, factorKey, status) =>
        set((state) => {
            const updatedPlayers = state.players.map((player) => {
                if (player.id !== playerId || player.role === "BusDev") return player;

                const updatedFactor = {
                    ...player.factors[factorKey],
                    status,
                };

                return {
                    ...player,
                    factors: {
                        ...player.factors,
                        [factorKey]: updatedFactor,
                    },
                };
            });

            return { players: updatedPlayers };
        }),
}));
