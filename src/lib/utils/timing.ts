export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
	let timeoutId: ReturnType<typeof setTimeout>;
	return ((...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), ms);
	}) as T;
}
