"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { getAllViewCounts } from "@/data/middleware/views/actions";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { StoredPost, TablePost } from "@/types";
import { Check, Close, Edit, OpenInNewRounded } from "@mui/icons-material";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export const PostTable = ({
  postsOverview,
}: {
  postsOverview: StoredPost[];
}) => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<TablePost[]>([]);
  const [views, setViews] = useState<any>();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    getAllViewCounts().then((data) => {
      setViews(data);
    });
    return () => {};
  }, []);

  useEffect(() => {
    setPosts(
      postsOverview.map((post) => ({
        ...post, // This spreads the existing fields of the post
        //   views: "—", // Adds the new field 'views' with a default value of "—"
        views: views ? views[post.id] : "-", // Adds the new field 'views' with a default value of "—"
      }))
    );
    return () => {};
  }, [views]);

  // Defining columns
  const dateFormatter = new Intl.DateTimeFormat("no-NB");
  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 470, align: "left" },
    { field: "views", headerName: "Views", width: 110, align: "center" },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      width: 100,
      align: "center",
      type: "date",
      valueFormatter: (value) => dateFormatter.format(value),
    },
    {
      field: "updatedAt",
      headerName: "UpdatedAt",
      width: 100,
      align: "center",
      renderCell: (params) =>
        params.value ? dateFormatter.format(params.value) : "",
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
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
          >
            {params.value ? (
              <Check
                style={{
                  color: theme.palette.success.light,
                  fontSize: "1.5rem",
                }}
              />
            ) : (
              <Close
                style={{
                  color: theme.palette.grey[500],
                  fontSize: "1.5rem",
                }}
              />
            )}
          </Box>
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
        <NavbarButton
          variant="base"
          icon={OpenInNewRounded}
          sxIcon={{ color: theme.palette.text.primary, width: 24, height: 24 }}
          onClick={() =>
            (window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${row.id}`)
          }
        />
      ),
    },
    {
      field: "action2",
      headerName: "Edit",
      sortable: false,
      filterable: false,
      width: 50,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <NavbarButton
          variant="base"
          icon={Edit}
          sxIcon={{ color: theme.palette.text.primary, width: 24, height: 24 }}
          href={`/cms/edit/${row.id}`}
        />
      ),
    },
  ];

  return (
    <DataGrid
      rows={posts}
      columns={columns}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
        columns: {
          columnVisibilityModel: {
            updatedAt: !mdDown,
          },
        },
      }}
      pageSizeOptions={[5, 10, 15, 20, 25]}
      sx={{
        backgroundColor: theme.palette.primary.main,
        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
          display: "none",
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
