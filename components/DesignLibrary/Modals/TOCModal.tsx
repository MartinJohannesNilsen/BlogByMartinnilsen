"use client";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { TOCModalProps } from "@/types";
import { Close } from "@mui/icons-material";
import { ButtonBase, IconButton, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useMemo } from "react";

export function extractHeaders(html: string) {
	const regex = /<div.*?>(<a.*?id="(.*?)".*?><\/a>.*?<h([1-6]).*?>(.*?)<\/h[1-6]>)<\/div>/g;
	const headings: { type: string; id: string; text: string }[] = [];
	let match;
	while ((match = regex.exec(html))) {
		headings.push({
			type: `h${match[3]}`,
			id: match[2],
			text: match[4],
		});
	}
	return headings;
}

export const TOCModal = (props: TOCModalProps) => {
	const { theme } = useTheme();
	const router = useRouter();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: xs ? 370 : 500,
		maxHeight: "70vh",
		bgcolor: "background.paper",
		borderRadius: 2,
		outline: 0,
		display: "flex",
		textAlign: "left",
		flexDirection: "column",
		rowGap: "10px",
		justifyContent: "flex-start",
		boxShadow: 24,
		p: xs ? 2 : 4,
	};

	const TableOfContents = useMemo(() => {
		function decodeHtml(html) {
			var txt = document.createElement("textarea");
			txt.innerHTML = html;
			return txt.value;
		}
		if (!props.headings) return null;
		const elements: JSX.Element[] = [
			<ButtonBase
				LinkComponent={NextLink}
				onClick={() => {
					props.handleModalClose();
					window.scrollTo(0, 0);
					// router.replace(window.location.pathname + window.location.search);
					router.replace(window.location.pathname);
				}}
				sx={{
					maxWidth: "100%",
					color: theme.palette.text.primary,
					"&:hover": {
						color: theme.palette.secondary.main,
					},
				}}
			>
				<Typography
					sx={{
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						overflow: "hidden",
						fontFamily: theme.typography.fontFamily,
						textDecoration: "none",
						paddingLeft: theme.spacing(1),
						fontWeight: 600,
						fontSize: 14,
						borderLeft:
							props.postTitle === props.currentSection
								? "2px solid " + theme.palette.secondary.main
								: "2px solid rgba(120, 120, 120, 0.2)",
					}}
				>
					{props.postTitle}
				</Typography>
			</ButtonBase>,
		];
		props.headings.map((heading) => {
			const id = decodeHtml(heading.id);
			elements.push(
				<ButtonBase
					LinkComponent={NextLink}
					key={id}
					onClick={() => {
						props.handleModalClose();
						router.replace("#" + id);
						// Instant scroll
						// var targetElement = document.getElementById(id);
						// if (targetElement) {
						// 	targetElement.scrollIntoView({ behavior: "instant" });
						// }
					}}
					sx={{
						maxWidth: "100%",
						color: theme.palette.text.primary,
						"&:hover": {
							color: theme.palette.secondary.main,
						},
					}}
				>
					<Typography
						sx={{
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							overflow: "hidden",
							fontFamily: theme.typography.fontFamily,
							textDecoration: "none",
							paddingLeft: theme.spacing(parseInt(heading.type.substring(1))),
							fontWeight: 600,
							fontSize: 14,
							borderLeft:
								id === props.currentSection
									? "2px solid " + theme.palette.secondary.main
									: "2px solid rgba(120, 120, 120, 0.2)",
						}}
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(heading.text),
						}}
					/>
				</ButtonBase>
			);
		});
		return (
			<Box
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				justifyContent="flex-start"
				sx={{
					overflowY: "scroll",
					"& p": {
						py: 0.3,
					},
					scrollbarWidth: "none",
				}}
			>
				{elements}
			</Box>
		);
	}, [props.headings, theme]);

	if (props.sidebarMode && props.sidebarMode === true) return <Box>{TableOfContents}</Box>;
	else
		return (
			<Box>
				<Modal open={props.open} onClose={props.handleModalClose}>
					<Box sx={style}>
						<IconButton
							style={{ position: "absolute", top: "5px", right: "5px" }}
							onClick={() => props.handleModalClose()}
						>
							<Close sx={{ color: theme.palette.text.primary }} />
						</IconButton>
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="h5"
							fontWeight="800"
							color={theme.palette.text.primary}
							mb={1}
						>
							Table of Contents
						</Typography>
						{TableOfContents}
					</Box>
				</Modal>
			</Box>
		);
};
export default TOCModal;
