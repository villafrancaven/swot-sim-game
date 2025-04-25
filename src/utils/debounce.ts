export const debounce = (
    fn: (...args: any[]) => void,
    delay: number | undefined
) => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};
