export default function FactorSlider({
    title,
    value,
    text,
    onChangeScore,
    onChangeText,
    onOpenModal,
}: {
    title: string;
    value: number;
    text: string;
    onChangeScore: (val: number) => void;
    onChangeText: (val: string) => void;
    onOpenModal?: () => void;
}) {
    return (
        <div className="p-4 border rounded-2xl shadow-md mb-4 bg-white">
            <div className="flex justify-between items-center mb-2">
                <h2
                    className="text-lg font-semibold cursor-pointer"
                    onClick={onOpenModal}
                >
                    {title}
                </h2>
                <span className="text-sm text-gray-500">Score: {value}</span>
            </div>
            <input
                type="range"
                min={1}
                max={10}
                value={value}
                onChange={(e) => onChangeScore(Number(e.target.value))}
                className="w-full mb-3"
            />
            <textarea
                className="w-full p-2 border rounded resize-none"
                rows={4}
                maxLength={300}
                placeholder="Enter bullet points (max 300 chars)"
                value={text}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        const target = e.target as HTMLTextAreaElement;
                        const { selectionStart, selectionEnd } = target;
                        const newValue =
                            text.slice(0, selectionStart) +
                            "\n• " +
                            text.slice(selectionEnd);
                        onChangeText(newValue);
                        setTimeout(() => {
                            target.selectionStart = target.selectionEnd =
                                selectionStart + 3;
                        }, 0);
                    }
                }}
                onChange={(e) => onChangeText(e.target.value)}
                onFocus={() => {
                    if (text.trim() === "") {
                        onChangeText("• ");
                    }
                }}
            />
        </div>
    );
}
