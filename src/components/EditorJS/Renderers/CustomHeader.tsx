import parse from "html-react-parser";
import type { CSSProperties } from "react";
import { EditorjsRendererProps } from "../../../types";
import { isMobile } from "react-device-detect";

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
  if (!data || !data.text || typeof data.text != "string") return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!config || typeof config !== "object")
    config = { disableDefaultStyle: false };
  if (!classNames || typeof classNames !== "object") classNames = {};

  const h1Style = config.disableDefaultStyle
    ? style.h1
    : { ...defaultStyle, ...style.h1 };
  const h2Style = config.disableDefaultStyle
    ? style.h2
    : { ...defaultStyle, ...style.h2 };
  const h3Style = config.disableDefaultStyle
    ? style.h3
    : { ...defaultStyle, ...style.h3 };
  const h4Style = config.disableDefaultStyle
    ? style.h4
    : { ...defaultStyle, ...style.h4 };
  const h5Style = config.disableDefaultStyle
    ? style.h5
    : { ...defaultStyle, ...style.h5 };
  const h6Style = config.disableDefaultStyle
    ? style.h6
    : { ...defaultStyle, ...style.h6 };

  switch (data.level) {
    case 1:
      return isMobile ? (
        <div style={{ position: "relative" }}>
          <a
            id={parse(data.text).toString().replaceAll(" ", "_")}
            style={{
              position: "absolute",
              zIndex: -1,
              top: -50,
              visibility: "hidden",
            }}
          ></a>
          <h1
            style={h1Style && {}}
            className={classNames.h1}
            id={parse(data.text).toString().replaceAll(" ", "_")}
          >
            {parse(data.text)}
          </h1>
        </div>
      ) : (
        <h1
          style={h1Style && {}}
          className={classNames.h1}
          id={parse(data.text).toString().replaceAll(" ", "_")}
        >
          {parse(data.text)}
        </h1>
      );
    case 2:
      return isMobile ? (
        <div style={{ position: "relative" }}>
          <a
            id={parse(data.text).toString().replaceAll(" ", "_")}
            style={{
              position: "absolute",
              zIndex: -1,
              top: -50,
              visibility: "hidden",
            }}
          ></a>
          <h2
            style={h2Style && {}}
            className={classNames.h2}
            id={parse(data.text).toString().replaceAll(" ", "_")}
          >
            {parse(data.text)}
          </h2>
        </div>
      ) : (
        <h2
          style={h2Style && {}}
          className={classNames.h2}
          id={parse(data.text).toString().replaceAll(" ", "_")}
        >
          {parse(data.text)}
        </h2>
      );
    case 3:
      return isMobile ? (
        <div style={{ position: "relative" }}>
          <a
            id={parse(data.text).toString().replaceAll(" ", "_")}
            style={{
              position: "absolute",
              zIndex: -1,
              top: -50,
              visibility: "hidden",
            }}
          ></a>
          <h3
            style={h3Style && {}}
            className={classNames.h3}
            id={parse(data.text).toString().replaceAll(" ", "_")}
          >
            {parse(data.text)}
          </h3>
        </div>
      ) : (
        <h3
          style={h3Style && {}}
          className={classNames.h3}
          id={parse(data.text).toString().replaceAll(" ", "_")}
        >
          {parse(data.text)}
        </h3>
      );
    case 4:
      return isMobile ? (
        <div style={{ position: "relative" }}>
          <a
            id={parse(data.text).toString().replaceAll(" ", "_")}
            style={{
              position: "absolute",
              zIndex: -1,
              top: -50,
              visibility: "hidden",
            }}
          ></a>
          <h4
            style={h4Style && {}}
            className={classNames.h4}
            id={parse(data.text).toString().replaceAll(" ", "_")}
          >
            {parse(data.text)}
          </h4>
        </div>
      ) : (
        <h4
          style={h4Style && {}}
          className={classNames.h4}
          id={parse(data.text).toString().replaceAll(" ", "_")}
        >
          {parse(data.text)}
        </h4>
      );
    case 5:
      return isMobile ? (
        <div style={{ position: "relative" }}>
          <a
            id={parse(data.text).toString().replaceAll(" ", "_")}
            style={{
              position: "absolute",
              zIndex: -1,
              top: -50,
              visibility: "hidden",
            }}
          ></a>
          <h5
            style={h5Style && {}}
            className={classNames.h5}
            id={parse(data.text).toString().replaceAll(" ", "_")}
          >
            {parse(data.text)}
          </h5>
        </div>
      ) : (
        <h5
          style={h5Style && {}}
          className={classNames.h5}
          id={parse(data.text).toString().replaceAll(" ", "_")}
        >
          {parse(data.text)}
        </h5>
      );
    case 6:
      return isMobile ? (
        <div style={{ position: "relative" }}>
          <a
            id={parse(data.text).toString().replaceAll(" ", "_")}
            style={{
              position: "absolute",
              zIndex: -1,
              top: -50,
              visibility: "hidden",
            }}
          ></a>
          <h6
            style={h6Style && {}}
            className={classNames.h6}
            id={parse(data.text).toString().replaceAll(" ", "_")}
          >
            {parse(data.text)}
          </h6>
        </div>
      ) : (
        <h6
          style={h6Style && {}}
          className={classNames.h6}
          id={parse(data.text).toString().replaceAll(" ", "_")}
        >
          {parse(data.text)}
        </h6>
      );
    default:
      return isMobile ? (
        <div style={{ position: "relative" }}>
          <a
            id={parse(data.text).toString().replaceAll(" ", "_")}
            style={{
              position: "absolute",
              zIndex: -1,
              top: -50,
              visibility: "hidden",
            }}
          ></a>
          <h4
            style={h4Style && {}}
            className={classNames.h4}
            id={parse(data.text).toString().replaceAll(" ", "_")}
          >
            {parse(data.text)}
          </h4>
        </div>
      ) : (
        <h4
          style={h4Style && {}}
          className={classNames.h4}
          id={parse(data.text).toString().replaceAll(" ", "_")}
        >
          {parse(data.text)}
        </h4>
      );
  }
};

export default HeaderOutput;
