"use client";
import {
	defaultAccentColorDark,
	defaultAccentColorLight,
	defaultFontFamily,
	defaultFontFamilyVariable,
	defaultFontScale,
	getFontFamilyFromVariable,
} from "@/styles/themes/themeDefaults";
import { ThemeEnum, themeCreator } from "@/styles/themes/themeMap";
import { CustomThemeProviderProps, ThemeContextType } from "@/types";
import useDidUpdate from "@/utils/useDidUpdate";
import useStickyState from "@/utils/useStickyState";
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import * as components from "@/styles/fonts";

// Find the correct scheme based on user preferences.
// If changed on site before, persist based on localStorage, else default OS setting
const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
export function getSelectedTheme() {
	if (typeof window !== "undefined") {
		const localStorageTheme = localStorage.getItem("theme");
		const OS_STANDARD = window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light";
		return localStorageTheme || OS_STANDARD;
	} else {
		return "light";
	}
}

export const ThemeContext = createContext<ThemeContextType>({
	theme: getSelectedTheme() === "dark" ? themeCreator(ThemeEnum.Dark) : themeCreator(ThemeEnum.Light),
	setTheme: (theme, persist) => {},
	setDefaultTheme: () => {},
	accentColor:
		(typeof window !== "undefined" && localStorage.getItem("accent")) || getSelectedTheme() === "dark"
			? defaultAccentColorDark.hex
			: defaultAccentColorLight.hex,
	setAccentColor: (accent) => {},
	fontFamily:
		typeof window !== "undefined"
			? getFontFamilyFromVariable(localStorage.getItem("fontFamily") || defaultFontFamilyVariable)
			: defaultFontFamily,
	setFontFamily: (fontFamily) => {},
	fontScale: (typeof window !== "undefined" && localStorage.getItem("fontScale")) || defaultFontScale,
	setFontScale: (fontScale) => {},
});
export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {
	const OS_STANDARD = useMediaQuery(COLOR_SCHEME_QUERY) ? "dark" : "light";
	const [fontFamily, setFontFamily] = useStickyState("fontFamily", defaultFontFamilyVariable);
	const [theme, _setTheme] = useState(
		getSelectedTheme() === "dark" ? themeCreator(ThemeEnum.Dark) : themeCreator(ThemeEnum.Light)
	);
	const [accentColor, setAccentColor] = useStickyState(
		"accent",
		theme.palette.mode == "dark" ? defaultAccentColorDark.hex : defaultAccentColorLight.hex,
		false,
		/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/
	);
	const [fontScale, setFontScale] = useStickyState("fontScale", defaultFontScale);

	useDidUpdate(() => {
		_setTheme(themeCreator(typeof window !== "undefined" ? localStorage.getItem("theme") || OS_STANDARD : OS_STANDARD));
	}, [OS_STANDARD]);

	const setDefaultTheme = (): void => {
		localStorage.removeItem("theme");
		const underlayingTheme = themeCreator(getSelectedTheme());
		_setTheme(
			createTheme({
				...underlayingTheme,
				cssVariables: true,
				palette: {
					...underlayingTheme.palette,
					secondary: { main: accentColor },
				},
				typography: {
					...underlayingTheme.typography,
					fontFamily: getFontFamilyFromVariable(fontFamily),
				},
			})
		);
	};

	const setTheme = (themeName: ThemeEnum, persist?: boolean): void => {
		if (persist) localStorage.setItem("theme", themeName);
		const underlayingTheme = themeCreator(themeName);
		_setTheme(
			createTheme({
				...underlayingTheme,
				cssVariables: true,
				palette: {
					...underlayingTheme.palette,
					secondary: { main: accentColor },
				},
				typography: {
					...underlayingTheme.typography,
					fontFamily: getFontFamilyFromVariable(fontFamily),
				},
			})
		);
	};

	useEffect(() => {
		if (theme.palette.mode === "dark" && accentColor == defaultAccentColorLight.hex) {
			setAccentColor(defaultAccentColorDark.hex);
		} else if (theme.palette.mode == "light" && accentColor == defaultAccentColorDark.hex) {
			setAccentColor(defaultAccentColorLight.hex);
		}
		return () => {};
	}, [theme]);

	useEffect(() => {
		document.documentElement.style.setProperty("--font-scale", fontScale);
		return () => {};
	}, [, fontScale]);

	useMemo(() => {
		setTheme(theme.palette.mode === "dark" ? ThemeEnum.Dark : ThemeEnum.Light, false);
		return () => {};
	}, [accentColor, fontFamily]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme,
				setDefaultTheme,
				accentColor,
				setAccentColor,
				fontFamily,
				setFontFamily,
				fontScale,
				setFontScale,
			}}
		>
			<AppRouterCacheProvider options={{ key: "mui" }}>
				<ThemeProvider theme={theme}>
					<CssBaseline /> {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					{children}
				</ThemeProvider>
			</AppRouterCacheProvider>
		</ThemeContext.Provider>
	);
};

export default CustomThemeProvider;
