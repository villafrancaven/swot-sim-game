import { PlayerRequest } from "@/api/models/room";

export const BASE_API_URL =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000";

export const HttpMethod = {
    async get(url: string | URL | Request, headers = {}) {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        });
        return handleResponse(response);
    },

    async post(url: string | URL | Request, body: PlayerRequest, headers = {}) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    async put(url: string | URL | Request, body: any, headers = {}) {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    async delete(url: string | URL | Request, body: any, headers = {}) {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },
};

async function handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
}
