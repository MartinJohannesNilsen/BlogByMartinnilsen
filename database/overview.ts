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
  const postOverviewSnapshot = await getDoc(
    doc(db, "administrative", db_document)
  );
  if (postOverviewSnapshot.exists()) {
    const data = postOverviewSnapshot.data().values;

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
  const postOverviewSnapshot = await getDoc(
    doc(db, "administrative", db_document)
  );
  if (postOverviewSnapshot.exists()) {
    let data = postOverviewSnapshot.data().values;
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
  const postOverviewSnapshot = await getDoc(docRef);
  if (postOverviewSnapshot.exists()) {
    let values: SimplifiedPost[] = postOverviewSnapshot.data().values;
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
          post.title = simplifiedPost.title;
          post.summary = simplifiedPost.summary;
          post.image = simplifiedPost.image;
          post.published = simplifiedPost.published;
          post.timestamp = simplifiedPost.timestamp;
          post.type = simplifiedPost.type;
          post.tags = simplifiedPost.tags;
          post.author = simplifiedPost.author;
          post.readTime = simplifiedPost.readTime;
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
