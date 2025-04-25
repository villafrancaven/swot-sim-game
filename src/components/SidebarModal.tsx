"use client";

import { useUIStore } from "@/store/useUIStore";
import { useEffect } from "react";

export default function SidebarModal() {
    const { activeModal, closeModal } = useUIStore();

    useEffect(() => {
        const escClose = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        document.addEventListener("keydown", escClose);
        return () => document.removeEventListener("keydown", escClose);
    }, [closeModal]);

    if (!activeModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                >
                    ×
                </button>

                {activeModal === "overview" && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">
                            Overview Video
                        </h2>
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                            <iframe
                                className="w-full h-full rounded"
                                src="https://www.youtube.com/embed/DYh66w5aQos"
                                title="Finsimco Overview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </>
                )}

                {activeModal === "mission" && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">
                            Mission Objectives
                        </h2>
                        <p className="mb-2">
                            🧠 <strong>Risk Management:</strong> Assess risks,
                            control exposure, and protect the organization’s
                            integrity.
                        </p>
                        <p>
                            🚀 <strong>Business Development:</strong> Maximize
                            opportunities, drive growth, and achieve KPIs within
                            set constraints.
                        </p>
                    </>
                )}

                {activeModal === "dataroom" && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">
                            Data Room
                        </h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Only Risk Management can upload. Business Dev has
                            read-only access.
                        </p>
                        <div className="border p-4 rounded bg-gray-50">
                            <p className="text-gray-500 italic">
                                Data Room To Do...
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
