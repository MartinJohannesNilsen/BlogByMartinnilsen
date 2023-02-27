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
import { db } from "../firebaseConfig";
import { FirestorePost, Post } from "../types";

const postConverter = {
  toFirestore: (post: Post): FirestorePost => {
    return {
      ...post,
      data: JSON.stringify(post.data),
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Post => {
    const snapshotData = snapshot.data(options)! as FirestorePost;
    return {
      ...snapshotData,
      data: JSON.parse(snapshotData.data),
    };
  },
};

const getPost = async (id: string): Promise<Post | null> => {
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
  const docRef = await addDoc(
    collection(db, "posts").withConverter(postConverter),
    newDocument
  );
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
