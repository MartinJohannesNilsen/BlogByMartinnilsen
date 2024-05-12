import { db } from "@/lib/firebaseConfig";
import { FirestoreFullPost, FullPost } from "@/types";
import {
	DocumentData,
	QueryDocumentSnapshot,
	SnapshotOptions,
	WhereFilterOp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	endBefore,
	getCountFromServer,
	getDoc,
	getDocs,
	limit,
	limitToLast,
	orderBy,
	query,
	startAfter,
	updateDoc,
	where,
} from "firebase/firestore";

const postConverterWithoutStringify = {
	toFirestore: (post: FullPost): FullPost => {
		return {
			...post,
		};
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FullPost => {
		const snapshotData = snapshot.data(options)! as FullPost;
		return {
			...snapshotData,
		};
	},
};

const postConverter = {
	toFirestore: (post: FullPost): FirestoreFullPost => {
		return {
			...post,
			data: JSON.stringify(post.data),
		};
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FullPost => {
		const snapshotData = snapshot.data(options)! as FirestoreFullPost;
		return {
			...snapshotData,
			data: JSON.parse(snapshotData.data),
		};
	},
};

const getPost = async (id: string): Promise<FullPost | null> => {
	const postSnapshot = await getDoc(doc(db, "posts", id).withConverter(postConverter));
	if (postSnapshot.exists()) {
		return postSnapshot.data();
	} else {
		return null;
	}
};

const getPostCount = async (filterOnKeyValue?: {
	key: string;
	operator: WhereFilterOp;
	value: boolean | string;
}): Promise<number> => {
	const countSnapshot = await getCountFromServer(
		filterOnKeyValue
			? query(collection(db, "posts"), where(filterOnKeyValue.key, filterOnKeyValue.operator, filterOnKeyValue.value))
			: collection(db, "posts")
	);
	return countSnapshot.data().count;
};

const getPaginatedCollection = async (
	numberOfPosts: number = 10,
	direction: "prev" | "next" = "next",
	lastFetchedPosts?: QueryDocumentSnapshot[],
	filterOnKeyValue?: {
		key: string;
		operator: WhereFilterOp;
		value: boolean | string;
	}
): Promise<QueryDocumentSnapshot<DocumentData>[]> => {
	// Fetch first n posts if no lastFetchedPost is provided
	if (!lastFetchedPosts || lastFetchedPosts.length === 0) {
		const first = filterOnKeyValue
			? query(
					collection(db, "posts"),
					where(filterOnKeyValue.key, filterOnKeyValue.operator, filterOnKeyValue.value),
					orderBy("createdAt", "desc"),
					limit(numberOfPosts)
			  )
			: query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(numberOfPosts));
		const documentSnapshots = await getDocs(first);
		return documentSnapshots.docs;
	}
	if (direction === "prev") {
		// Fetch previous n posts
		const prev = filterOnKeyValue
			? query(
					collection(db, "posts"),
					where(filterOnKeyValue.key, filterOnKeyValue.operator, filterOnKeyValue.value),
					orderBy("createdAt", "desc"),
					endBefore(lastFetchedPosts[0]),
					limitToLast(numberOfPosts)
			  )
			: query(
					collection(db, "posts"),
					orderBy("createdAt", "desc"),
					endBefore(lastFetchedPosts[0]),
					limitToLast(numberOfPosts)
			  );
		const documentSnapshots = await getDocs(prev);
		return documentSnapshots.docs;
	} else {
		// Fetch next n posts
		const next = filterOnKeyValue
			? query(
					collection(db, "posts"),
					where(filterOnKeyValue.key, filterOnKeyValue.operator, filterOnKeyValue.value),
					orderBy("createdAt", "desc"),
					startAfter(lastFetchedPosts[lastFetchedPosts.length - 1]),
					limit(numberOfPosts)
			  )
			: query(
					collection(db, "posts"),
					orderBy("createdAt", "desc"),
					startAfter(lastFetchedPosts[lastFetchedPosts.length - 1]),
					limit(numberOfPosts)
			  );

		const documentSnapshots = await getDocs(next);
		return documentSnapshots.docs;
	}
};

const addPost = async (newDocument: FullPost): Promise<string> => {
	const docRef = await addDoc(collection(db, "posts").withConverter(postConverter), newDocument);
	return docRef.id;
};

const updatePost = async (id: string, updateDocument: FullPost, stringify: boolean = true): Promise<boolean> => {
	const firestorePost: FirestoreFullPost = {
		...updateDocument,
		data: stringify ? JSON.stringify(updateDocument.data) : updateDocument.data,
	};
	const docRef = doc(db, "posts", id);
	await updateDoc(docRef, firestorePost).catch((error) => {
		console.log(error);
		return false;
	});
	return true;
};

const deletePost = async (id: string): Promise<boolean> => {
	const docRef = doc(db, "posts", id);
	await deleteDoc(docRef).catch((error) => {
		console.log(error);
		return false;
	});
	return true;
};

export { addPost, deletePost, getPaginatedCollection, getPost, getPostCount, updatePost };
