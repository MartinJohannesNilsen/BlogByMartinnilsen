"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import { NorthEast } from "@mui/icons-material";
import { Box, Card, CardActionArea, IconButton, Typography } from "@mui/material";

const CustomFile = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();

	return props.data.url ? (
		<Box my={2} display="flex" width="100%" flexDirection="column" textAlign="center" alignItems="center">
			<Card
				elevation={0}
				sx={{
					width: "100%",
					backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
					border: "2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
				}}
			>
				<CardActionArea
					href={props.data.url}
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						gap: 1.5,
						p: 1,
						textAlign: "left",
					}}
				>
					{/* Icon */}
					<IconButton
						disabled
						sx={{
							width: "50px",
							height: "50px",
							p: 1.5,
						}}
					>
						<Typography fontSize={20} aria-hidden="true">
							{props.data.icon}
						</Typography>
					</IconButton>

					{/* Description */}
					<Typography
						variant="subtitle1"
						sx={{
							width: "100%",
							fontFamily: theme.typography.fontFamily,
							fontWeight: 600,
						}}
						aria-hidden="true"
					>
						{props.data.description}
					</Typography>

					{/* File size */}
					{props.data.fileSize && (
						<Typography
							variant="body2"
							sx={{
								color: theme.palette.text.primary,
								opacity: 0.2,
								right: 15,
								fontWeight: 600,
							}}
							aria-hidden="true"
						>
							{props.data.fileSize > 1073741824
								? `${(props.data.fileSize / 1073741824).toFixed(2)}gb`
								: props.data.fileSize > 1048576
								? `${(props.data.fileSize / 1048576).toFixed(2)}mb`
								: `${(props.data.fileSize / 1024).toFixed(2)}kb`}
						</Typography>
					)}

					{/* Northeast arrow */}
					<NorthEast
						sx={{
							mx: 0.5,
							strokeWidth: 0.2,
							opacity: 0.5,
							height: "22px",
							width: "22px",
							color: "inherit",
							"&:hover": { color: "inherit" },
						}}
					/>
				</CardActionArea>
			</Card>
		</Box>
	) : null;
};

export default CustomFile;
