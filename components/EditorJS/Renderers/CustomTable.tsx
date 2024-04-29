"use client";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
		fontWeight: 800,
		fontSize: 18,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		borderBottom: 0,
	},
}));

const CustomTable = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();
	const newDesign = true;
	const content: [[string]] = JSON.parse(props.data.content!);
	const heading = props.data.withHeadings ? content.shift() : [];

	return (
		<Box my={1}>
			{newDesign ? (
				<TableContainer
					component={Paper}
					elevation={0}
					sx={{
						backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
						border: "2px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200]),
					}}
				>
					<Table sx={{ minWidth: "100%" }} size="small" aria-label="a dense table">
						{props.data.withHeadings && (
							<TableHead>
								<TableRow
									sx={{
										"td, th": {
											borderBottom:
												"1px solid " +
												(theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200]),
										},
									}}
								>
									{heading &&
										heading.map((cell, j) => (
											<TableCell
												key={cell}
												sx={
													j !== heading.length - 1
														? {
																// Vertical line
																// borderRightWidth: 1,
																// borderRightColor: theme.palette.grey[700],
																// borderRightStyle: "solid",
																[`&.${tableCellClasses.head}`]: {},
														  }
														: {
																[`&.${tableCellClasses.head}`]: {},
														  }
												}
												align="center"
												dangerouslySetInnerHTML={{
													__html: DOMPurify.sanitize(cell.replace(" ", "&nbsp;")),
												}}
											/>
										))}
								</TableRow>
							</TableHead>
						)}
						<TableBody>
							{content.map((row, i) => (
								<TableRow
									key={i}
									sx={{
										"td, th": {
											borderBottom:
												"1px solid " +
												(theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200]),
										},
										"&:last-child td, &:last-child th": { border: 0 },
									}}
								>
									{row.map((cell, j) => (
										<TableCell
											key={cell}
											// sx={
											// 	j !== row.length - 1
											// 		? {
											// 				borderRightWidth: 1,
											// 				borderRightColor: theme.palette.grey[700],
											// 				borderRightStyle: "solid",
											// 		  }
											// 		: {}
											// }
											component="th"
											scope="row"
											align="center"
											dangerouslySetInnerHTML={{
												__html: DOMPurify.sanitize(cell.replace(" ", "&nbsp;")),
											}}
										/>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: "100%" }} aria-label="table">
						{props.data.withHeadings && (
							<TableHead>
								<TableRow>
									{heading &&
										heading.map((cell, j) => (
											<StyledTableCell
												key={cell}
												sx={
													j !== heading.length - 1
														? {
																borderRightWidth: 1,
																borderRightColor: theme.palette.grey[700],
																borderRightStyle: "solid",
														  }
														: {}
												}
												align="center"
												dangerouslySetInnerHTML={{
													__html: DOMPurify.sanitize(cell.replace(" ", "&nbsp;")),
												}}
											/>
										))}
								</TableRow>
							</TableHead>
						)}
						<TableBody>
							{content.map((row, i) => (
								<StyledTableRow key={i}>
									{row.map((cell, j) => (
										<StyledTableCell
											key={cell}
											sx={
												j !== row.length - 1
													? {
															borderRightWidth: 1,
															borderRightColor: theme.palette.grey[700],
															borderRightStyle: "solid",
													  }
													: {}
											}
											component="th"
											scope="row"
											align="center"
											dangerouslySetInnerHTML={{
												__html: DOMPurify.sanitize(cell.replace(" ", "&nbsp;")),
											}}
										/>
									))}
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	);
};
export default CustomTable;
