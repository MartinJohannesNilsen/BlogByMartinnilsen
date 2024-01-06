import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
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

	const useStyles = makeStyles(() => ({
		verticalLine: {
			// borderWidth: 0,
			borderRightWidth: 1,
			borderRightColor: theme.palette.grey[700],
			borderRightStyle: "solid",
		},
	}));
	const style = useStyles();
	const content: [[string]] = JSON.parse(props.data.content!);
	const heading = props.data.withHeadings ? content.shift() : [];

	return (
		<Box my={1}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: "100%" }} aria-label="table">
					{props.data.withHeadings ? (
						<TableHead>
							<TableRow>
								{heading.map((cell, j) => (
									<StyledTableCell
										key={cell}
										className={j !== heading.length - 1 ? style.verticalLine : ""}
										align="center"
										dangerouslySetInnerHTML={{
											__html: DOMPurify.sanitize(cell.replace(" ", "&nbsp;")),
										}}
									/>
								))}
							</TableRow>
						</TableHead>
					) : null}
					<TableBody>
						{content.map((row, i) => (
							<StyledTableRow key={i}>
								{row.map((cell, j) => (
									<StyledTableCell
										key={cell}
										className={j !== row.length - 1 ? style.verticalLine : ""}
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
		</Box>
	);
};
export default CustomTable;
