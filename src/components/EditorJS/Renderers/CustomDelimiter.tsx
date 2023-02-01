import { Box } from "@mui/material";
import { useTheme } from "../../../ThemeProvider";

const CustomDelimiter = () => {
  const { theme } = useTheme();

  return (
    <Box
      sx={{
        width: "80%",
        marginLeft: "10%",
        marginY: "60px",
        borderBottom: "3px solid " + theme.palette.secondary.main,
        borderRadius: 5,
      }}
    />
  );
};
export default CustomDelimiter;
