export interface Player {
    factors: {
        brand: { score: number; reason: string; status: "TBD" | "Okay" };
        tech: { score: number; reason: string; status: "TBD" | "Okay" };
    };
    id: number;
    name: string;
    role: "BusDev" | "Risk";
    brand_market_score?: number;
    brand_market_reason?: string;
    tech_infra_score?: number;
    tech_infra_reason?: string;
}

export interface Room {
    room_number: string;
    players: Player[];
}
