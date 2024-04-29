"use client";
import { Box, Breakpoint, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "../styles/themes/ThemeProvider";

/**
 * taken from https://material-ui.com/components/use-media-query/#migrating-from-withwidth
 *
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
type BreakpointOrNull = Breakpoint | null;

export const useWidth = (): Breakpoint => {
	const { theme } = useTheme();
	const keys: readonly Breakpoint[] = [...theme.breakpoints.keys].reverse();
	return (
		keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const matches = useMediaQuery(theme.breakpoints.up(key));
			return output != null && matches ? key : output;
		}, null) ?? "xs"
	);
};

export const showMuiSize = () => {
	const breakpoint = useWidth();

	return (
		<Box>
			<Typography
				sx={{
					position: "fixed",
					zIndex: 100,
					bottom: 10,
					right: 0,
					margin: "-5px 5px",
					color: "red",
					fontSize: "2rem",
					fontWeight: 800,
				}}
			>
				{breakpoint}
			</Typography>
		</Box>
	);
};
export default showMuiSize;
