import { useEffect, useState } from "react";

const useSetValueTimeout = (value: string, timeout: number) => {
	let timeoutId: NodeJS.Timeout | null = null;
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [valueState, setValueState] = useState(value);

	useEffect(() => {
		if (value !== null && typeof value !== "undefined") {
			if (isFirstLoad) {
				setIsFirstLoad(false);
			} else {
				timeoutId = setTimeout(() => {
					setValueState(value);
				}, timeout);
			}
		}
		return () => {
			timeoutId && clearTimeout(timeoutId);
		};
	}, [value]);
	return valueState;
};
export default useSetValueTimeout;
