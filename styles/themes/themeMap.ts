"use client";
import { dark } from "@/styles/themes/dark";
import { light } from "@/styles/themes/light";
import { Theme } from "@mui/material";

export enum ThemeEnum {
	Dark = "dark",
	Light = "light",
}

export function themeCreator(theme: string): Theme {
	return themeMap[theme];
}

const themeMap: { [key: string]: Theme } = {
	dark,
	light,
};
