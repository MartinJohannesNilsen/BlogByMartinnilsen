import { signOut } from "next-auth/react";

const localStorageToBeCleared = ["notificationsRead", "lastRead"];

export function userSignOut(callbackUrl?: string, clearLocalStorage?: boolean) {
	signOut(callbackUrl ? { callbackUrl: callbackUrl } : {}).then(() => {
		clearLocalStorage && localStorageToBeCleared.map((item) => localStorage.removeItem(item));
	});
}
