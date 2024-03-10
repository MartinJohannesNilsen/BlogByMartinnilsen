import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, Checkbox, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const CustomChecklist = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();

	return (
		<Box my={1} display="flex" flexDirection="column">
			{props.data.items?.map((item: { text?: string; checked?: boolean }) => (
				<Box display="flex" alignItems={"center"} key={item.text}>
					<Checkbox
						disabled
						checked={item.checked}
						icon={
							<RadioButtonUnchecked
								sx={{
									color: item.checked ? theme.palette.secondary.main : theme.palette.text.primary,
								}}
							/>
						}
						checkedIcon={
							<CheckCircle
								sx={{
									color: item.checked ? theme.palette.secondary.main : theme.palette.text.primary,
								}}
							/>
						}
						onClick={() => {}}
					/>
					<Typography
						variant="body1"
						color="textPrimary"
						fontFamily={theme.typography.fontFamily}
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(item.text!),
						}}
					/>
				</Box>
			))}
		</Box>
	);
};
export default CustomChecklist;
