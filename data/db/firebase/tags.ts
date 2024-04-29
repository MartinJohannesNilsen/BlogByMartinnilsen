import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";

const getTags = async (): Promise<string[]> => {
	const tagsSnapshot = await getDoc(doc(db, "administrative", "tags"));
	if (tagsSnapshot.exists()) {
		return tagsSnapshot.data().values;
	} else {
		return [];
	}
};

const addTag = async (tag: string): Promise<boolean> => {
	const docRef = doc(db, "administrative", "tags");
	const tagsSnapshot = await getDoc(docRef);
	if (tagsSnapshot.exists()) {
		let values: string[] = tagsSnapshot.data().values;
		if (values.includes(tag)) {
			return false;
		}
		values.push(tag);
		await updateDoc(docRef, { values: values }).catch((error) => {
			console.log(error);
			return false;
		});
		return true;
	}
	return false;
};

export { addTag, getTags };
