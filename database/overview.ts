import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { StoredPost } from "../types";
const db_document = "overview";

const _sortListOfStoredPostsOnTimestamp = (
  data: StoredPost[],
  asc?: boolean
) => {
  if (asc) {
    return data.sort((prev, next) => prev.timestamp - next.timestamp); //Ascending, oldest (smallest timestamp) first
  }
  return data.sort((prev, next) => next.timestamp - prev.timestamp); //Descending, latest (largest timestamp) first
};
export const _filterListOfStoredPostsOnPublished = (
  data: StoredPost[],
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
        ? data.filter((post: StoredPost) => post.published)
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
): Promise<StoredPost[]> => {
  const postOverviewSnapshot = await getDoc(
    doc(db, "administrative", db_document)
  );
  if (postOverviewSnapshot.exists()) {
    let data = postOverviewSnapshot.data().values;
    if (sorted) {
      data = _sortListOfStoredPostsOnTimestamp(data, sorted === "asc");
    }
    if (filterOnPublished) {
      data = _filterListOfStoredPostsOnPublished(data, "published");
    }
    return data;
  } else {
    return [];
  }
};

const addPostsOverview = async (StoredPost: StoredPost): Promise<boolean> => {
  const docRef = doc(db, "administrative", db_document);
  const postOverviewSnapshot = await getDoc(docRef);
  if (postOverviewSnapshot.exists()) {
    let values: StoredPost[] = postOverviewSnapshot.data().values;
    values.map((post) => {
      if (post.id === StoredPost.id) {
        return false;
      }
    });
    values.push(StoredPost);
    await updateDoc(docRef, { values: values }).catch((error) => {
      console.log(error);
      return false;
    });
    return true;
  }
  return false;
};

const updatePostsOverview = async (
  StoredPost: StoredPost
): Promise<boolean> => {
  const docRef = doc(db, "administrative", db_document);
  await getPostsOverview()
    .then(async (data: StoredPost[]) => {
      let values = [...data];
      values.map((post: StoredPost) => {
        if (post.id === StoredPost.id) {
          post.title = StoredPost.title;
          post.description = StoredPost.description;
          post.icon = StoredPost.icon;
          post.image = StoredPost.image;
          post.published = StoredPost.published;
          post.timestamp = StoredPost.timestamp;
          post.type = StoredPost.type;
          post.tags = StoredPost.tags;
          post.author = StoredPost.author;
          post.readTime = StoredPost.readTime;
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
    .then(async (data: StoredPost[]) => {
      let values = [...data];
      values.map((post: StoredPost, index: number) => {
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
