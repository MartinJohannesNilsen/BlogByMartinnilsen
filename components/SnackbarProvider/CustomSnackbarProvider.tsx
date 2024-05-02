"use client";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { closeSnackbar, SnackbarProvider } from "notistack";

export default function CustomSnackbarProvider({ children }: { children: React.ReactNode }) {
	return (
		<SnackbarProvider
			preventDuplicate
			maxSnack={Number(process.env.NEXT_PUBLIC_MAX_STACK_OF_SNACKBARS)}
			// anchorOrigin={{
			// 	vertical: "top",
			// 	horizontal: "center",
			// }}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
			action={(snackbarId) => (
				<IconButton size="small" disableRipple onClick={() => closeSnackbar(snackbarId)}>
					<Close fontSize="small" sx={{ color: "white" }} />
				</IconButton>
			)}
		>
			{children}
		</SnackbarProvider>
	);
}
