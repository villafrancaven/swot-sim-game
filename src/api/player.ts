import { BASE_API_URL, HttpMethod } from "@/utils/HttpMethod";
import { PlayerRequest } from "./models/room";

export const submitPlayerResponses = async (
    player_id: number,
    responses: PlayerRequest
): Promise<{ message: string }> => {
    const response = await HttpMethod.post(
        `${BASE_API_URL}/api/players/${player_id}/responses`,
        responses
    );
    return response;
};
