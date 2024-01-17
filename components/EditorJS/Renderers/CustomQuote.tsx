import { IosShare } from "@mui/icons-material";
import { Box, Typography, useMediaQuery } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useState } from "react";
import { BiSolidQuoteRight } from "react-icons/bi";
import { handleSharing } from "../../../pages/posts/[postId]";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import { NavbarButton } from "../../Buttons/NavbarButton";

const CustomQuote = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const sm = useMediaQuery(theme.breakpoints.only("sm"));
	const newDesign = true;
	const [hover, setHover] = useState(false);

	return newDesign ? (
		<Box
			display="flex"
			flexDirection="column"
			my={1}
			onMouseEnter={() => {
				setHover(true);
			}}
			onMouseLeave={() => {
				setHover(false);
			}}
		>
			<Box display="flex">
				<Box ml={xs ? 2 : 4} mt={0.1}>
					<BiSolidQuoteRight style={{ color: theme.palette.text.primary, opacity: 0.3 }} />
				</Box>
				<Box textAlign="left" ml={1} mr={xs ? 1 : 2.5}>
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="body1"
						fontWeight="600"
						fontSize={17}
						color={theme.palette.text.primary}
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(props.data.text!),
						}}
					/>
				</Box>
			</Box>
			<Box display="flex" ml={xs ? 5 : 7} sx={{ position: "relative" }}>
				<Typography
					mt={0.8}
					fontFamily={theme.typography.fontFamily}
					fontWeight={600}
					variant="body2"
					color={theme.palette.text.primary}
					sx={{ opacity: 0.4 }}
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(props.data.caption!),
					}}
				/>
				<Box flexGrow={1} />
				{hover && (
					<NavbarButton
						variant="outline"
						onClick={() => {
							handleSharing({
								text:
									'"' +
									props.data.text +
									'"' +
									(props.data.caption && " ~ " + props.data.caption) +
									"\n\nA quote from the post available at " +
									window.location.href,
							});
						}}
						icon={IosShare}
						tooltip="Share quote"
						sxButton={{
							position: "absolute",
							right: xs ? 12 : 20,
							bottom: 5,
							minWidth: "30px",
							minHeight: "30px",
							height: "30px",
							width: "30px",
						}}
						sxIcon={{
							height: "16px",
							width: "18px",
							color: "inherit",
						}}
					/>
				)}
			</Box>
		</Box>
	) : (
		<Box display="flex" flexDirection="column" my={1}>
			<Box sx={{ borderLeft: "3px solid" + theme.palette.secondary.main }} textAlign="left" pl={1.5}>
				<Typography
					fontFamily={theme.typography.fontFamily}
					variant="body1"
					fontWeight="600"
					fontSize={17}
					color={theme.palette.text.primary}
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(props.data.text!),
					}}
				/>
			</Box>
			<Box display="flex" mt={0.5} sx={{ borderLeft: "5px solid transparent" }}>
				<Typography
					fontFamily={theme.typography.fontFamily}
					variant="body1"
					color={theme.palette.text.primary}
					sx={{ opacity: 0.8 }}
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(props.data.caption!),
					}}
				/>
			</Box>
		</Box>
	);
};
export default CustomQuote;
