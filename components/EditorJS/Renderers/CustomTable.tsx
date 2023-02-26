import { Box, useMediaQuery } from "@mui/material";
import { EditorjsRendererProps } from "../../../types";
import { useTheme } from "../../../ThemeProvider";
import DOMPurify from "isomorphic-dompurify";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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
    border: 0,
  },
}));

const CustomTable = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  // const xs = useMediaQuery(theme.breakpoints.only("xs"));
  // const sm = useMediaQuery(theme.breakpoints.only("sm"));

  return (
    <Box my={1}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }} aria-label="table">
          <TableHead>
            <TableRow>
              {props.data.content!.shift()?.map((cell) => (
                <StyledTableCell
                  key={cell}
                  align="center"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(cell.replace(" ", "&nbsp;")),
                  }}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.content!.map((row) => (
              <StyledTableRow key={row[0]}>
                {row.map((cell) => {
                  <StyledTableCell
                    key={cell}
                    component="th"
                    scope="row"
                    align="center"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(cell.replace(" ", "&nbsp;")),
                    }}
                  />;
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default CustomTable;
