import { db } from "../firebaseConfig";
import {
  doc,
  DocumentData,
  getDoc,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
  addDoc,
  getCountFromServer,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  endBefore,
  limitToLast,
  updateDoc,
  deleteDoc,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { FirestorePost, Post } from "../types";

const postConverter = {
  toFirestore: (post: WithFieldValue<FirestorePost>): DocumentData => {
    return { post };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): FirestorePost => {
    const snapshotData = snapshot.data(options)!;
    return {
      published: snapshotData.published,
      type: snapshotData.type,
      tags: snapshotData.tags,
      title: snapshotData.title,
      summary: snapshotData.summary,
      image: snapshotData.image,
      data: JSON.parse(snapshotData.data),
      author: snapshotData.author,
      timestamp: snapshotData.timestamp,
      views: snapshotData.views,
    };
  },
};

const getPost = async (id: string): Promise<FirestorePost | null> => {
  const postSnapshot = await getDoc(
    doc(db, "posts", id).withConverter(postConverter)
  );
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
      ? query(
          collection(db, "posts"),
          where(
            filterOnKeyValue.key,
            filterOnKeyValue.operator,
            filterOnKeyValue.value
          )
        )
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
          where(
            filterOnKeyValue.key,
            filterOnKeyValue.operator,
            filterOnKeyValue.value
          ),
          orderBy("timestamp", "desc"),
          limit(numberOfPosts)
        )
      : query(
          collection(db, "posts"),
          orderBy("timestamp", "desc"),
          limit(numberOfPosts)
        );
    const documentSnapshots = await getDocs(first);
    return documentSnapshots.docs;
  }
  if (direction === "prev") {
    // Fetch previous n posts
    const prev = filterOnKeyValue
      ? query(
          collection(db, "posts"),
          where(
            filterOnKeyValue.key,
            filterOnKeyValue.operator,
            filterOnKeyValue.value
          ),
          orderBy("timestamp", "desc"),
          endBefore(lastFetchedPosts[0]),
          limitToLast(numberOfPosts)
        )
      : query(
          collection(db, "posts"),
          orderBy("timestamp", "desc"),
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
          where(
            filterOnKeyValue.key,
            filterOnKeyValue.operator,
            filterOnKeyValue.value
          ),
          orderBy("timestamp", "desc"),
          startAfter(lastFetchedPosts[lastFetchedPosts.length - 1]),
          limit(numberOfPosts)
        )
      : query(
          collection(db, "posts"),
          orderBy("timestamp", "desc"),
          startAfter(lastFetchedPosts[lastFetchedPosts.length - 1]),
          limit(numberOfPosts)
        );

    const documentSnapshots = await getDocs(next);
    return documentSnapshots.docs;
  }
};

const addPost = async (newDocument: Post): Promise<string> => {
  const firestorePost: FirestorePost = {
    ...newDocument,
    data: JSON.stringify(newDocument.data),
  };
  const docRef = await addDoc(collection(db, "posts"), firestorePost);
  return docRef.id;
};

const updatePost = async (
  id: string,
  updateDocument: Post
): Promise<boolean> => {
  const firestorePost: FirestorePost = {
    ...updateDocument,
    data: JSON.stringify(updateDocument.data),
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

export {
  getPost,
  getPostCount,
  getPaginatedCollection,
  addPost,
  updatePost,
  deletePost,
};
