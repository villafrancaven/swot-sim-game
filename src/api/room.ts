// @ts-nocheck
import { BASE_API_URL, HttpMethod } from "@/utils/HttpMethod";
import { Room } from "./models/player";

export const createRoom = async (
    room_number: string,
    name: string,
    role: "BusDev" | "Risk"
): Promise<Room> => {
    const response = await HttpMethod.post(
        `${BASE_API_URL}/api/rooms/${room_number}`,
        { name, role }
    );
    return response;
};

export const getRoomDetails = async (room_number: string): Promise<Room> => {
    const response = await HttpMethod.get(
        `${BASE_API_URL}/api/rooms/${room_number}`
    );
    return response;
};
