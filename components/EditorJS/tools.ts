// General
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { cloudStorage } from "../../lib/firebaseConfig";
import {
	CalloutIcon,
	CodeIcon,
	DividerIcon,
	ImageUploadIcon,
	ImageUrlIcon,
	MathIcon,
	QuoteIcon,
	TableIcon,
	ToggleIcon,
	VideoIcon,
} from "./Icons";

// Tools
import CheckList from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Underline from "@editorjs/underline";
import ToggleBlock from "editorjs-toggle-block";
import ChangeCase from "./BlockTools/ChangeCase/change-case";
// @ts-ignore
import Table from "@martinjohannesnilsen/editorjs-table";
const EJLaTeX = require("editorjs-latex"); // Math
const Iframe = require("@hammaadhrasheedh/editorjs-iframe");

// Custom tools
import InlineVideo from "./BlockTools/InlineVideo/tool";
import Divider from "./BlockTools/Divider/tool";
import CodeBlock from "./BlockTools/CodeBlock/tool";
import Callout from "./BlockTools/Callout/tool";

// Development
// Images
// import ImageOnPaste from "./BlockTools/ImageOnPaste/tool"; // TODO Trial at implementing SimpleImage, but focus on ImageBlock first
import Image from "./BlockTools/ImageBlock/tool";

export const EDITOR_JS_TOOLS = {
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
		class: List,
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
	quote: Quote,
	checklist: {
		class: CheckList,
		toolbox: {
			icon: QuoteIcon,
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
	math: {
		// @ts-ignore
		class: EJLaTeX,
		shortcut: "CMD+SHIFT+E",
		toolbox: {
			icon: MathIcon,
			title: "Math",
		},
	},
	toggle: {
		class: ToggleBlock,
		inlineToolbar: true,
		toolbox: {
			icon: ToggleIcon,
		},
	},
	image: {
		class: Image,
	},
};
export default EDITOR_JS_TOOLS;
