import { Box, Checkbox, Typography, useMediaQuery } from "@mui/material";
import { EditorjsRendererProps } from "../../../types";
import { useTheme } from "../../../ThemeProvider";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DOMPurify from "dompurify";

const CustomChecklist = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));

  return (
    <Box my={1} display="flex" flexDirection="column">
      {props.data.items?.map((item) => (
        <Box display="flex" alignItems={"center"}>
          <Checkbox
            disabled
            checked={item.checked}
            icon={
              <RadioButtonUncheckedIcon
                sx={{
                  color: item.checked
                    ? theme.palette.secondary.main
                    : theme.palette.text.primary,
                }}
              />
            }
            checkedIcon={
              <CheckCircleIcon
                sx={{
                  color: item.checked
                    ? theme.palette.secondary.main
                    : theme.palette.text.primary,
                }}
              />
            }
            onClick={() => {}}
          />
          <Typography
            variant="body1"
            color="textPrimary"
            fontFamily={theme.typography.fontFamily}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(item.text!),
            }}
          />
        </Box>
      ))}
    </Box>
  );
};
export default CustomChecklist;
