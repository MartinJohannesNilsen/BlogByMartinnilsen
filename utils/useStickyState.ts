import { useEffect, useState } from "react";

export const useStickyState = (
  key: string,
  defaultValue: number | boolean | string | number[] | string[] | Date
) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(key)) || defaultValue;
    }
    return defaultValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};
export default useStickyState;
