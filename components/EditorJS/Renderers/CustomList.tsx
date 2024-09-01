"use client";
import CustomParagraph from "@/components/EditorJS/Renderers/CustomParagraph";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";

interface ListItem {
	content: string;
	items: ListItem[];
}

const renderList = (items: ListItem[], style: "ordered" | "unordered", theme: any): JSX.Element => {
	const ListTag = style === "ordered" ? "ol" : "ul";
	return (
		<ListTag style={{ color: theme.palette.text.primary }}>
			{items.map((item, index) => (
				<li key={index}>
					<CustomParagraph data={{ text: item.content }} style={{ box: { my: 0 } }} />
					{item.items.length > 0 && renderList(item.items, style, theme)}
				</li>
			))}
		</ListTag>
	);
};

const CustomList = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();

	if (props.data.items?.length! <= 0) return null;

	return renderList(props.data.items as ListItem[], props.data.style!, theme);
};

export default CustomList;
