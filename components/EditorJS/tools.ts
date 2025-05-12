// General
import {
	CalloutIcon,
	ChecklistIcon,
	CodeIcon,
	DividerIcon,
	ImageIcon,
	MathIcon,
	TableIcon,
	ToggleIcon,
	VideoIcon,
} from "@/components/EditorJS/Icons";

// Tools
import CheckList from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/nested-list";
import Paragraph from "@editorjs/paragraph";
import Underline from "@editorjs/underline";
import ToggleBlock from "editorjs-toggle-block";
// @ts-ignore
import Table from "@martinjohannesnilsen/editorjs-table";
const EJLaTeX = require("editorjs-latex"); // Math
const Iframe = require("@hammaadhrasheedh/editorjs-iframe");

// Custom tools
import Callout from "@/components/EditorJS/BlockTools/Callout/tool";
import ChangeCase from "@/components/EditorJS/BlockTools/ChangeCase/change-case";
import CodeBlock from "@/components/EditorJS/BlockTools/CodeBlock/tool";
import Divider from "@/components/EditorJS/BlockTools/Divider/tool";
import File from "@/components/EditorJS/BlockTools/FileBlock/tool";
import Image from "@/components/EditorJS/BlockTools/ImageBlock/tool";
import ImageCarousel from "@/components/EditorJS/BlockTools/ImageCarouselBlock/tool";
import InlineVideo from "@/components/EditorJS/BlockTools/InlineVideo/tool";

export const EDITOR_JS_TOOLS: any = {
	underline: { class: Underline, shortcut: "CMD+U" },
	paragraph: {
		class: Paragraph,
		linkTool: true,
		config: {
			// placeholder: "What do you want to share with the world?",
			preserveBlank: true,
		},
	},
	marker: { class: Marker, shortcut: "CMD+F" },
	inlineCode: { class: InlineCode, shortcut: "CMD+E" },
	changeCase: {
		class: ChangeCase,
		config: {},
	},
	header: {
		class: Header,
		config: {
			placeholder: "Enter a header",
			levels: [1, 2, 3],
			defaultLevel: 1,
		},
	},
	list: {
		class: NestedList,
		inlineToolbar: true,
		config: {
			defaultStyle: "unordered",
		},
	},
	callout: {
		class: Callout,
		inlineToolbar: true,
		toolbox: {
			icon: CalloutIcon,
			title: "Callout",
		},
	},
	checklist: {
		class: CheckList,
		toolbox: {
			icon: ChecklistIcon,
		},
	},
	code: {
		class: CodeBlock,
		config: {
			// Set field to initially render with value each time it is loaded
			data: {},
			// Set field to initially render with value only on creation
			dataDefaults: {},
		},
		toolbox: {
			icon: CodeIcon,
			title: "Code",
		},
	},
	divider: {
		class: Divider,
		toolbox: {
			icon: DividerIcon,
		},
	},
	video: InlineVideo,
	embed: Embed,
	iframe: Iframe,
	linkTool: {
		class: LinkTool,
		config: {
			endpoint: process.env.NEXT_PUBLIC_SERVER_URL + "/editorjs/linkpreview", // Your backend endpoint for url data fetching,
		},
		toolbox: {
			icon: VideoIcon,
		},
	},
	table: {
		class: Table,
		inlineToolbar: true,
		config: {
			withHeadings: true,
			rows: 2,
			cols: 2,
		},
		toolbox: {
			icon: TableIcon,
		},
	},
	// math: {
	// 	// @ts-ignore
	// 	class: EJLaTeX,
	// 	shortcut: "CMD+SHIFT+E",
	// 	toolbox: {
	// 		icon: MathIcon,
	// 		title: "Math",
	// 	},
	// },
	toggle: {
		class: ToggleBlock,
		inlineToolbar: true,
		toolbox: {
			icon: ToggleIcon,
		},
	},
	image: {
		class: Image,
		toolbox: {
			title: "Image (single)",
			icon: ImageIcon,
		},
	},
	imageCarousel: {
		class: ImageCarousel,
		toolbox: {
			title: "Image (carousel)",
			icon: ImageIcon,
		},
	},
	file: {
		class: File,
	},
};
export default EDITOR_JS_TOOLS;
