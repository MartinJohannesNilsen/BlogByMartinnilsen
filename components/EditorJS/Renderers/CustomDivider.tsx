import { Box } from "@mui/material";
import { useTheme } from "../../../ThemeProvider";

const CustomDivider = () => {
  const { theme } = useTheme();

  return (
    <Box
      sx={{
        width: "80%",
        marginLeft: "10%",
        marginY: "60px",
        // borderBottom: "3px solid " + theme.palette.secondary.main,
        borderBottom: "2px solid " + theme.palette.text.primary,
        opacity: 0.6,
        borderRadius: 5,
      }}
    />
  );
};
export default CustomDivider;
