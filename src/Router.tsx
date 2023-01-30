import { QueryClient, useQuery } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import LandingView from "./views/LandingView";
import { ReadArticleView, loader as postLoader } from "./views/ReadArticleView";
import ManageArticleView from "./views/ManageArticleView";

const Layout = () => (
  <>
    <Outlet />
  </>
);

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    element: <Layout />,
    // errorElement: <ErrorView />,
    children: [
      {
        path: "/",
        element: <LandingView />,
      },
      {
        path: "/posts/:postId",
        element: <ReadArticleView />,
        loader: postLoader(queryClient),
      },
      {
        path: "/create",
        element:
          process.env.REACT_APP_MANAGE_POSTS_AVAILABLE === "true" ? (
            <ManageArticleView />
          ) : (
            <Navigate to="/" />
          ),
      },
      {
        path: "/create/:postId",
        element:
          process.env.REACT_APP_MANAGE_POSTS_AVAILABLE === "true" ? (
            <ManageArticleView fetch={true} />
          ) : (
            <Navigate to="/" />
          ),
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
export default AppRouter;
