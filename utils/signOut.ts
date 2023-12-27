import { signOut } from "next-auth/react";

const localStorageToBeCleared = ["notificationsRead", "lastRead"];

export function userSignOut() {
  signOut({ callbackUrl: "/" }).then(() => {
    localStorageToBeCleared.map((item) => localStorage.removeItem(item));
  });
}
