import { Box } from "@mui/material";
import parse from "html-react-parser";
import { CSSProperties } from "react";
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

  const mobileScrollFix = (
    <Box position="relative">
      <a
        id={parse(data.text).toString().replaceAll(" ", "_")}
        style={{
          position: "absolute",
          zIndex: -1,
          top: isMobile ? -50 : -10,
          visibility: "hidden",
          scrollBehavior: "smooth",
        }}
      ></a>
      {element}
    </Box>
  );

  return mobileScrollFix;
};

export default HeaderOutput;
