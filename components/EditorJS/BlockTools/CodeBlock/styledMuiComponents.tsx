import { styled } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

export const TextareaAutosizeElement = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.body1.fontSize};
    font-weight: ${theme.typography.body1.fontWeight};
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 0px 0px 10px 10px;
    color: "white";
    background: ${theme.palette.mode === "dark" ? "white" : "white"};
    border: none;
    box-shadow: none;
  
    &:hover {
      border: none;
      border-color: transparent;
    }
  
    &:focus {
      border: none;
      border-color: transparent;
      box-shadow: none;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export const InputElement = styled("input")(
  ({ theme }) => `
    width: 100%;
    resize: vertical;
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.body1.fontSize};
    font-weight: ${theme.typography.body1.fontWeight};
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 0px 0px 10px 10px;
    color: "white";
    background: ${theme.palette.mode === "dark" ? "white" : "white"};
    border: none;
    box-shadow: none;
  
    &:hover {
      border: none;
      border-color: transparent;
    }
  
    &:focus {
      border: none;
      border-color: transparent;
      box-shadow: none;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);
