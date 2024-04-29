"use client";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import CustomParagraph from "./CustomParagraph";

const CustomList = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();

	let items: JSX.Element[] = [];
	if (props.data.items!.length <= 0) return null;
	props.data.items!.map((item: string) => {
		items.push(<CustomParagraph data={{ text: item }} style={{ box: { my: 0 } }} />);
	});
	if (props.data.style === "ordered") {
		return (
			<ol style={{ color: theme.palette.text.primary }}>
				{items.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ol>
		);
	} else if (props.data.style === "unordered") {
		return (
			<ul style={{ color: theme.palette.text.primary }}>
				{items.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		);
	} else return null;
};
export default CustomList;
