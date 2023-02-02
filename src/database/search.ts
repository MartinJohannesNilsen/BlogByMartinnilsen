import { db } from "../firebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { SimplifiedPost } from "../types";

const getPostsOverview = async (): Promise<SimplifiedPost[]> => {
  const tagsSnapshot = await getDoc(doc(db, "administrative", "search"));
  if (tagsSnapshot.exists()) {
    return tagsSnapshot.data().values;
  } else {
    return [];
  }
};

const addPostsOverview = async (
  simplifiedPost: SimplifiedPost
): Promise<boolean> => {
  const docRef = doc(db, "administrative", "search");
  const tagsSnapshot = await getDoc(docRef);
  if (tagsSnapshot.exists()) {
    let values: SimplifiedPost[] = tagsSnapshot.data().values;
    values.map((post) => {
      if (post.id === simplifiedPost.id) {
        return false;
      }
    });
    values.push(simplifiedPost);
    await updateDoc(docRef, { values: values }).catch((error) => {
      console.log(error);
      return false;
    });
    return true;
  }
  return false;
};

const updatePostsOverview = async (
  simplifiedPost: SimplifiedPost
): Promise<boolean> => {
  const docRef = doc(db, "administrative", "search");
  await getPostsOverview()
    .then(async (data: SimplifiedPost[]) => {
      let values = [...data];
      values.map((post: SimplifiedPost) => {
        if (post.id === simplifiedPost.id) {
          post.img = simplifiedPost.img;
          post.title = simplifiedPost.title;
          post.summary = simplifiedPost.summary;
        }
      });
      await updateDoc(docRef, { values: values }).catch((error) => {
        console.log(error);
        return false;
      });
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return true;
};

const deletePostsOverview = async (id: string): Promise<boolean> => {
  const docRef = doc(db, "administrative", "search");
  await getPostsOverview()
    .then(async (data: SimplifiedPost[]) => {
      let values = [...data];
      values.map((post: SimplifiedPost, index: number) => {
        if (post.id === id) {
          values.splice(index, 1);
        }
      });
      await updateDoc(docRef, { values: values }).catch((error) => {
        console.log(error);
        return false;
      });
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return true;
};

export {
  getPostsOverview,
  addPostsOverview,
  updatePostsOverview,
  deletePostsOverview,
};
