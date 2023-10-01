import { Box, Link, Typography, useMediaQuery } from "@mui/material";
import parse from "html-react-parser";
import { CSSProperties, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const defaultStyle: CSSProperties = {
  margin: "8px 0",
  marginTop: "15px",
};

const HeaderOutput = ({
  data,
  style,
  classNames,
  config,
}: EditorjsRendererProps): JSX.Element => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  if (!data || !data.text || typeof data.text != "string") return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!config || typeof config !== "object")
    config = { disableDefaultStyle: false };
  if (!classNames || typeof classNames !== "object") classNames = {};

  const element =
    data.level === 1 ? (
      <h1
        style={{
          ...defaultStyle,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        }}
        className={classNames.h1}
        // id={parse(data.text).toString().replaceAll(" ", "_")}
      >
        {parse(data.text)}
      </h1>
    ) : data.level === 2 ? (
      <h2
        style={{
          ...defaultStyle,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        }}
        className={classNames.h2}
        // id={parse(data.text).toString().replaceAll(" ", "_")}
      >
        {parse(data.text)}
      </h2>
    ) : data.level === 3 ? (
      <h3
        style={{
          ...defaultStyle,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        }}
        className={classNames.h3}
        // id={parse(data.text).toString().replaceAll(" ", "_")}
      >
        {parse(data.text)}
      </h3>
    ) : data.level === 4 ? (
      <h4
        style={{
          ...defaultStyle,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        }}
        className={classNames.h4}
        // id={parse(data.text).toString().replaceAll(" ", "_")}
      >
        {parse(data.text)}
      </h4>
    ) : data.level === 5 ? (
      <h5
        style={{
          ...defaultStyle,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        }}
        className={classNames.h5}
        // id={parse(data.text).toString().replaceAll(" ", "_")}
      >
        {parse(data.text)}
      </h5>
    ) : data.level === 6 ? (
      <h6
        style={{
          ...defaultStyle,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        }}
        className={classNames.h6}
        // id={parse(data.text).toString().replaceAll(" ", "_")}
      >
        {parse(data.text)}
      </h6>
    ) : (
      <h4
        style={{
          ...defaultStyle,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        }}
        className={classNames.h4}
        // id={parse(data.text).toString().replaceAll(" ", "_")}
      >
        {parse(data.text)}
      </h4>
    );

  const [showHash, setShowHash] = useState(false);
  const margin = xs
    ? data.level === 1
      ? 2.5
      : data.level === 2
      ? 2
      : 2
    : data.level === 1
    ? 4
    : data.level === 2
    ? 3.5
    : 3;
  const mobileScrollFix = (
    <Box
      position="relative"
      pl={margin}
      ml={-margin}
      onMouseEnter={() => {
        setShowHash(true);
      }}
      onMouseLeave={() => {
        setShowHash(false);
      }}
    >
      <a
        id={parse(data.text).toString().replaceAll(" ", "_")}
        className={"anchorHeading"}
        style={{
          position: "absolute",
          zIndex: -1,
          // top: isMobile ? -50 : -10,
          top: -50,
          visibility: "hidden",
          scrollBehavior: "smooth",
        }}
      ></a>
      <Box display="flex" alignItems="center">
        {showHash ? (
          <Link
            // disableRipple
            href={"#" + parse(data.text).toString().replaceAll(" ", "_")}
            sx={{
              mt: data.level === 1 ? 0.75 : data.level === 2 ? 0.9 : 0.95,
              position: "absolute",
              left: -1,
              opacity: 0.5,
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <Typography
              sx={{
                fontSize:
                  data.level === 1
                    ? theme.typography.h4
                    : data.level === 2
                    ? theme.typography.h5
                    : theme.typography.h6,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {/* {data.level === 1 ? "1" : data.level === 2 ? "2" : "3"} */}#
            </Typography>
          </Link>
        ) : (
          <Box />
        )}
        {element}
      </Box>
    </Box>
  );

  return mobileScrollFix;
};

export default HeaderOutput;
