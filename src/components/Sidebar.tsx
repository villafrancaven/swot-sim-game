"use client";

import { useUIStore } from "@/store/useUIStore";

export default function Sidebar() {
    const openModal = useUIStore((state) => state.openModal);

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white p-6 shadow-md z-50 space-y-4">
            <h1 className="text-2xl font-bold mb-6">SWOT Simulation</h1>

            <button
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => openModal("overview")}
            >
                📺 Overview Video
            </button>

            <button
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => openModal("mission")}
            >
                🎯 Mission
            </button>

            <button
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => openModal("dataroom")}
            >
                📁 Data Room
            </button>
        </aside>
    );
}
