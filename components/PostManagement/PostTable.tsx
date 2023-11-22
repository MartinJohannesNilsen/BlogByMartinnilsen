import { Button, Link, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { FC, useEffect, useState } from "react";
import { useTheme } from "../../ThemeProvider";
import { getPostsOverview } from "../../database/overview";
import { StoredPost, TablePost } from "../../types";
import useSWR from "swr";
import {
  Check,
  Close,
  Edit,
  OpenInBrowser,
  OpenInNew,
  OpenInNewRounded,
  OpenInNewSharp,
} from "@mui/icons-material";

const fetchPosts = async () => {
  const db_posts = await getPostsOverview(
    "desc",
    false // Do not filter on published
  );
  return db_posts;
};

const fetcher = async (input: RequestInfo) => {
  const res: Response = await fetch(input);
  return await res.json();
};

export const PostTable = (props) => {
  const { theme } = useTheme();
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const [posts, setPosts] = useState<TablePost[]>([]);
  const { data } = useSWR(`/api/views`, fetcher);

  useEffect(() => {
    fetchPosts().then((db_posts) => {
      setPosts(
        db_posts.map((post) => ({
          ...post, // This spreads the existing fields of the post
          //   views: "—", // Adds the new field 'views' with a default value of "—"
          views: data ? data[post.id] : "-", // Adds the new field 'views' with a default value of "—"
        }))
      );
    });
  }, [data]);

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 470, align: "left" },
    { field: "views", headerName: "Views", width: 110, align: "center" },
    {
      field: "timestamp",
      headerName: "Date",
      width: 100,
      align: "center",
      type: "date",
      valueGetter: (params) => new Date(params.value), // Transforming string to Date object
    },
    {
      field: "readTime",
      headerName: "ReadTime",
      width: 110,
      align: "center",
      //   valueGetter: (params) => parseInt(params.value.split(" ")[0]), // Transforming string to number
      sortComparator: (v1, v2, cellParams1, cellParams2) => {
        const value1 = parseInt(v1.split(" ")[0], 10); // Extract integer from "10 min read"
        const value2 = parseInt(v2.split(" ")[0], 10); // Extract integer from "10 min read"
        return value1 - value2;
      },
    },
    {
      field: "published",
      headerName: "Published",
      width: 110,
      align: "center",
      renderCell: (params) => {
        return params.value ? (
          <Check
            style={{
              color: theme.palette.success.light,
            }}
          />
        ) : (
          <Close
            style={{
              color: theme.palette.grey[500],
            }}
          />
        );
      },
    },
    // { field: "tags", headerName: "Tags", width: 180, sortable: false },
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "action1",
      headerName: "Read",
      sortable: false,
      filterable: false,
      width: 50,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Link
          sx={{ color: theme.palette.text.primary }}
          href={process.env.NEXT_PUBLIC_WEBSITE_URL + "/posts/" + row.id}
        >
          <OpenInNewRounded />
        </Link>
      ),
    },
    {
      field: "action2",
      headerName: "Edit",
      sortable: false,
      filterable: false,
      width: 50,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Link
          sx={{ color: theme.palette.text.primary }}
          href={process.env.NEXT_PUBLIC_WEBSITE_URL + "/create/" + row.id}
        >
          <Edit />
        </Link>
      ),
    },
  ];

  return (
    <DataGrid
      rows={posts}
      columns={columns}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      pageSizeOptions={[5, 10, 15, 20, 25]}
      sx={{
        backgroundColor: theme.palette.primary.main,
        // "& .MuiDataGrid-cell--textLeft.Mui-selected": {
        //   backgroundColor: "lightblue",
        // },
        // "& .MuiDataGrid-row.Mui-selected": {
        //   backgroundColor: "lightgreen",
        // },
        "& .MuiButtonBase-root, .MuiButton-root": {
          color: "black", // Example style
        },
        "& .MuiDataGrid-panelFooter": {
          color: "black", // Example style
        },
        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
          outline: "none", // Removes the default focus outline/border
        },
        "& .MuiDataGrid-cell:focus .MuiDataGrid-cell:focus-within": {
          outline: "none", // Additional targeting for nested elements if needed
        },
        height: "630px",
      }}
      rowSelection={false}
    />
  );
};

export default PostTable;
