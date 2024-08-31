"use client";
import { processJsonToggleBlocks, renderers } from "@/app/posts/[postId]/clientPage";
import Toggle from "@/components/DesignLibrary/Toggles/Toggle";
import { style } from "@/components/EditorJS/style";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import { Box } from "@mui/material";
import Output from "editorjs-react-renderer";
import { useMemo, useState } from "react";

const CustomToggle = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();
	const [open, setOpen] = useState(props.data.status === "open");

	const handleChange = () => {
		setOpen(!open);
	};

	const OutputElement = useMemo(() => {
		if (props && props.data) {
			const processedData = processJsonToggleBlocks(props.data);
			return <Output renderers={renderers} data={processedData} style={style(theme)} />;
		}
		return null;
	}, [props]);

	return (
		<Box my={1} display="flex" flexDirection="column" textAlign="center">
			<Toggle
				title={props.data.text!}
				open={open}
				handleClick={handleChange}
				boxSx={{ my: 0 }}
				accordionSx={{
					backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
					border: theme.palette.mode === "dark" ? "none" : "1px solid" + theme.palette.grey[200],
				}}
			>
				{OutputElement!}
			</Toggle>
		</Box>
	);
};
export default CustomToggle;
