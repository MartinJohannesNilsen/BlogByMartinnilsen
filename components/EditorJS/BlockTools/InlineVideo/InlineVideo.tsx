import { Box, Button, TextField, Typography } from "@mui/material";
import { Fragment, useRef, useState } from "react";
import { useTheme } from "../../../../ThemeProvider";
import CustomVideo from "../../Renderers/CustomVideo";
import { isvalidHTTPUrl } from "../../../PostManagement/CreatePost";

export const InlineVideo = (props: {
  data: { url: "" };
  onDataChange: (arg0: any) => void;
  readOnly: boolean;
}) => {
  const { theme } = useTheme();
  const textFieldRef = useRef<any>();
  const [textfieldData, setTextfieldData] = useState(props.data || { url: "" });

  return (
    <Fragment>
      <Box my={1}>
        {textfieldData.url === "" ? (
          <TextField
            disabled={props.readOnly}
            autoFocus
            fullWidth
            id="video-textfield"
            // label="Video url"
            placeholder="Insert video url here ..."
            inputRef={textFieldRef}
            InputProps={{
              endAdornment: (
                <Button
                  disabled={props.readOnly}
                  onClick={() => {
                    if (isvalidHTTPUrl(textFieldRef.current.value)) {
                      props.onDataChange({ url: textFieldRef.current.value });
                      setTextfieldData({ url: textFieldRef.current.value });
                    }
                  }}
                  // endIcon={
                  //   <FileUpload
                  //     sx={{
                  //       marginLeft: -0.5,
                  //       marginRight: 1,
                  //       color: theme.palette.text.primary,
                  //     }}
                  //   />
                  // }
                >
                  <Typography
                    fontFamily={theme.typography.fontFamily}
                    variant="body2"
                    fontWeight={600}
                    color={theme.palette.text.primary}
                    sx={{ opacity: 1 }}
                  >
                    Insert
                  </Typography>{" "}
                </Button>
              ),
            }}
          />
        ) : (
          <CustomVideo
            data={textfieldData}
            style={{}}
            config={{}}
            classNames={{}}
          />
        )}
      </Box>
    </Fragment>
  );
};
export default InlineVideo;
