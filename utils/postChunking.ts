import { StoredPost } from "@/types";

export function splitChunks(arr: StoredPost[], chunkSize: number) {
	if (chunkSize <= 0) throw "chunkSize must be greater than 0";
	let result: StoredPost[][] = [];
	for (var i = 0; i < arr.length; i += chunkSize) {
		result[i / chunkSize] = arr.slice(i, i + chunkSize);
	}
	return result;
}
