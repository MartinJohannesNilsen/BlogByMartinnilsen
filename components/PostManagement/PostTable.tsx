import { Check, Close, Edit, OpenInNewRounded } from "@mui/icons-material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getAllViewCounts } from "../../data/middleware/views/actions";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { StoredPost, TablePost } from "../../types";
import { NavbarButton } from "../DesignLibrary/Buttons/NavbarButton";

export const PostTable = ({ postsOverview }: { postsOverview: StoredPost[] }) => {
	const { theme } = useTheme();
	const [posts, setPosts] = useState<TablePost[]>([]);
	const [views, setViews] = useState<any>();

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
			type: "date",
			valueFormatter: (value) => dateFormatter.format(value),
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
				// <Link
				// 	component={NextLink}
				// 	sx={{ color: theme.palette.text.primary }}
				// 	href={process.env.NEXT_PUBLIC_WEBSITE_URL + "/posts/" + row.id}
				// >
				// 	<OpenInNewRounded />
				// </Link>
				<NavbarButton
					variant="base"
					icon={OpenInNewRounded}
					sxIcon={{ color: theme.palette.text.primary, width: 24, height: 24 }}
					// href={/posts/" + row.id}
					onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${row.id}`)}
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
				// <Link
				// 	component={NextLink}
				// 	sx={{ color: theme.palette.text.primary }}
				// href={`/create/${row.id}`}
				// 	// onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/create/${row.id}`)}
				// >
				// 	<Edit />
				// </Link>
				<NavbarButton
					variant="base"
					icon={Edit}
					sxIcon={{ color: theme.palette.text.primary, width: 24, height: 24 }}
					href={`/create/${row.id}`}
					// onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/create/${row.id}`)}
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
						updatedAt: false,
					},
				},
			}}
			pageSizeOptions={[5, 10, 15, 20, 25]}
			sx={{
				"& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
					display: "none",
				},
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
				// "& .MuiDataGrid-paper": { // Column background
				// 	backgroundColor: "black", // Your desired background color
				// },
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
