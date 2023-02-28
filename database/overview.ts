import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { SimplifiedPost } from "../types";
const db_document = "overview";

const _sortListOfSimplifiedPostsOnTimestamp = (
  data: SimplifiedPost[],
  asc?: boolean
) => {
  if (asc) {
    return data.sort((prev, next) => prev.timestamp - next.timestamp); //Ascending, oldest (smallest timestamp) first
  }
  return data.sort((prev, next) => next.timestamp - prev.timestamp); //Descending, latest (largest timestamp) first
};
export const _filterListOfSimplifiedPostsOnPublished = (
  data: SimplifiedPost[],
  filter: "published" | "unpublished" | "all"
) => {
  if (filter === "published") {
    return data.filter((post) => post.published);
  } else if (filter === "unpublished") {
    return data.filter((post) => !post.published);
  }
  return data;
};

const getAllPostIds = async (
  filterOnVisibility: boolean
): Promise<string[]> => {
  const tagsSnapshot = await getDoc(doc(db, "administrative", db_document));
  if (tagsSnapshot.exists()) {
    const data = tagsSnapshot.data().values;

    const list: { id: string }[] = Object.values(
      filterOnVisibility
        ? data.filter((post: SimplifiedPost) => post.published)
        : data
    );
    const res = list.map((val) => val.id);
    return res;
  } else {
    return [];
  }
};

const getPostsOverview = async (
  sorted?: "asc" | "desc",
  filterOnPublished?: boolean
): Promise<SimplifiedPost[]> => {
  const tagsSnapshot = await getDoc(doc(db, "administrative", db_document));
  if (tagsSnapshot.exists()) {
    let data = tagsSnapshot.data().values;
    if (sorted) {
      data = _sortListOfSimplifiedPostsOnTimestamp(data, sorted === "asc");
    }
    if (filterOnPublished) {
      data = _filterListOfSimplifiedPostsOnPublished(data, "published");
    }
    return data;
  } else {
    return [];
  }
};

const addPostsOverview = async (
  simplifiedPost: SimplifiedPost
): Promise<boolean> => {
  const docRef = doc(db, "administrative", db_document);
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
  const docRef = doc(db, "administrative", db_document);
  await getPostsOverview()
    .then(async (data: SimplifiedPost[]) => {
      let values = [...data];
      values.map((post: SimplifiedPost) => {
        if (post.id === simplifiedPost.id) {
          post.image = simplifiedPost.image;
          post.title = simplifiedPost.title;
          post.summary = simplifiedPost.summary;
          post.published = simplifiedPost.published;
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
  const docRef = doc(db, "administrative", db_document);
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
  getAllPostIds,
  getPostsOverview,
  addPostsOverview,
  updatePostsOverview,
  deletePostsOverview,
};
