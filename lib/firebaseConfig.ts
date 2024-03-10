import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_messagingSenderId,
	appId: process.env.NEXT_PUBLIC_FIREBASE_appId,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_measurementId,
};
const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);
let analytics;
if (firebaseApp.name && typeof window !== "undefined" && process.env.NODE_ENV === "production") {
	analytics = getAnalytics(firebaseApp);
}
const cloudStorage = getStorage();
export { analytics, cloudStorage, db, firebaseApp };
