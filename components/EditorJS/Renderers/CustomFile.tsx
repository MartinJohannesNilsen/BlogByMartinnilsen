"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import { NorthEast } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

const CustomFile = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();

	return props.data.url ? (
		<Box my={2} display="flex" width="100%" flexDirection="column" textAlign="center" alignItems="center">
			<Box
				justifyContent="space-between"
				alignItems="center"
				gap={1.5}
				sx={{
					position: "relative",
					userSelect: "none",
					backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
					p: 1,
					borderRadius: "5px",
					border: "2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
					display: "flex",
					flexDirection: "row",
					width: "100%",
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
					<Typography fontSize={20}>{props.data.icon}</Typography>
				</IconButton>

				{/* Description */}
				<Typography
					variant="subtitle1"
					sx={{ width: "100%", fontFamily: theme.typography.fontFamily, fontWeight: 600 }}
				>
					{props.data.description}
				</Typography>

				{/* File size if set */}
				{props.data.fileSize && (
					<Typography
						variant="body2"
						sx={{ color: theme.palette.text.primary, opacity: 0.2, right: 15, fontWeight: 600 }}
					>
						{props.data.fileSize > 1073741824
							? `${(props.data.fileSize / 1073741824).toFixed(2)}gb`
							: props.data.fileSize > 1048576
							? `${(props.data.fileSize / 1048576).toFixed(2)}mb`
							: `${(props.data.fileSize / 1024).toFixed(2)}kb`}
					</Typography>
				)}

				{/* Northeast arrow */}
				<NavbarButton
					variant="base"
					icon={NorthEast}
					sxButton={{ p: 0.5, "&:focus": { borderRadius: 50 } }}
					sxIcon={{ strokeWidth: 0.5, fontSize: "0.5rem" }}
					onClick={() => {
						open(props.data.url);
					}}
				/>
			</Box>
		</Box>
	) : null;
};
export default CustomFile;
