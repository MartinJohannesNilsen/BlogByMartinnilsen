import { useTheme } from "@/styles/themes/ThemeProvider";
import { CSSProperties } from "react";
import { useEffect } from "react";

export const EditorjsTextBlock = ({
	value,
	setValue,
	reference,
	style,
	dataPlaceholder,
}: {
	value: string;
	setValue: (html: any) => void;
	reference: any;
	style?: CSSProperties;
	dataPlaceholder?: string;
}) => {
	const { theme } = useTheme();

	useEffect(() => {
		const currentMessage: any = reference.current;
		currentMessage.innerHTML = value;
	}, [reference]);

	return (
		<div
			contentEditable="true"
			data-placeholder={dataPlaceholder}
			className="contentEditablePlaceholder" // Adds placeholder styling
			//className="cdx-input" // Adds editorjs border styling
			onKeyDown={(event) => {
				if (event.key === "Enter") {
					event.preventDefault();
					event.stopPropagation();
				}
			}}
			ref={reference}
			style={{
				...theme.typography.subtitle2,
				fontFamily: theme.typography.fontFamily,
				outline: "none",
				...style,
			}}
			onInputCapture={(e) => {
				const currentDiv: any = reference.current;
				if (currentDiv) {
					currentDiv.style.height = "auto";
					currentDiv.style.height = `${currentDiv.scrollHeight}px`;
				}
				setValue(e.currentTarget.innerHTML);
			}}
		/>
	);
};
