export default function FactorModal({
    title,
    hint,
    onClose,
}: {
    title: string;
    hint: string;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
                <button
                    className="absolute top-2 right-3 text-gray-500"
                    onClick={onClose}
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-gray-700">{hint}</p>
            </div>
        </div>
    );
}
