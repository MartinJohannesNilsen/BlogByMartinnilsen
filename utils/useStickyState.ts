import { useEffect, useState } from "react";

export const useStickyState = (
	key: string,
	defaultValue: number | boolean | string | number[] | string[] | Date,
	stringified?: boolean,
	ensureFormat?: RegExp
) => {
	const [value, setValue] = useState(() => {
		if (typeof window !== "undefined") {
			const item = localStorage.getItem(key);

			// If empty, return defaultValue
			if (!item) return defaultValue;

			// If format check, check that it passes the regex or reset to defaultValue
			if (ensureFormat && !ensureFormat.test(item)) {
				const storedValue: any = stringified ? JSON.stringify(defaultValue) : defaultValue;
				localStorage.setItem(key, storedValue);
				return defaultValue;
			}

			// Parse if stringified, else return raw value
			if (stringified) {
				return JSON.parse(item);
			} else {
				return item;
			}
		}
		return defaultValue;
	});
	useEffect(() => {
		localStorage.setItem(key, stringified ? JSON.stringify(value) : value);
	}, [key, value]);
	return [value, setValue];
};
export default useStickyState;
