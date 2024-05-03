"use client";
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { createContext, useContext, useMemo, useState } from "react";
import { CustomThemeProviderProps, ThemeContextType } from "../../types";
import useDidUpdate from "../../utils/useDidUpdate";
import { defaultAccentColor, defaultFontFamily } from "./themeDefaults";
import { ThemeEnum, themeCreator } from "./themeMap";

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
		typeof window !== "undefined" ? localStorage.getItem("accent") || defaultAccentColor.hex : defaultAccentColor.hex,
	setAccentColor: (accent) => {},
	fontFamily: typeof window !== "undefined" ? localStorage.getItem("font") || defaultFontFamily : defaultFontFamily,
	setFontFamily: (fontFamily) => {},
});
export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {
	const OS_STANDARD = useMediaQuery(COLOR_SCHEME_QUERY) ? "dark" : "light";
	const [fontFamily, _setFontFamily] = useState(
		typeof window !== "undefined"
			? JSON.parse(String(localStorage.getItem("font"))) || defaultFontFamily
			: defaultFontFamily
	);
	const [accentColor, _setAccentColor] = useState(
		typeof window !== "undefined"
			? JSON.parse(String(localStorage.getItem("accent"))) || defaultAccentColor.hex
			: defaultAccentColor.hex
	);
	const [theme, _setTheme] = useState(
		getSelectedTheme() === "dark" ? themeCreator(ThemeEnum.Dark) : themeCreator(ThemeEnum.Light)
	);

	useDidUpdate(() => {
		_setTheme(themeCreator(typeof window !== "undefined" ? localStorage.getItem("theme") || OS_STANDARD : OS_STANDARD));
	}, [OS_STANDARD]);

	const setDefaultTheme = (): void => {
		localStorage.removeItem("theme");
		const underlayingTheme = themeCreator(getSelectedTheme());
		_setTheme(
			createTheme({
				...underlayingTheme,
				palette: {
					...underlayingTheme.palette,
					secondary: { main: accentColor },
				},
				typography: {
					...underlayingTheme.typography,
					fontFamily: fontFamily,
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
				palette: {
					...underlayingTheme.palette,
					secondary: { main: accentColor },
				},
				typography: {
					...underlayingTheme.typography,
					fontFamily: fontFamily,
				},
			})
		);
	};

	const setFontFamily = (font: string): void => {
		localStorage.setItem("font", String(JSON.stringify(font)));
		_setFontFamily(font);
	};

	const setAccentColor = (accent: string): void => {
		localStorage.setItem("accent", String(JSON.stringify(accent)));
		_setAccentColor(accent);
	};

	useMemo(() => {
		_setTheme(
			createTheme({
				...theme,
				palette: {
					...theme.palette,
					secondary: { main: accentColor },
				},
				typography: {
					...theme.typography,
					fontFamily: fontFamily,
				},
			})
		);
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
