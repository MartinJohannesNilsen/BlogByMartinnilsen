import CustomCallout from "@/components/EditorJS/Renderers/CustomCallout";
import CustomChecklist from "@/components/EditorJS/Renderers/CustomChecklist";
import CustomCode from "@/components/EditorJS/Renderers/CustomCode";
import CustomDivider from "@/components/EditorJS/Renderers/CustomDivider";
import CustomFile from "@/components/EditorJS/Renderers/CustomFile";
import CustomHeader from "@/components/EditorJS/Renderers/CustomHeader";
import CustomIframe from "@/components/EditorJS/Renderers/CustomIframe";
import CustomImage from "@/components/EditorJS/Renderers/CustomImage";
import CustomImageCarousel from "@/components/EditorJS/Renderers/CustomImageCarousel";
import CustomLinkTool from "@/components/EditorJS/Renderers/CustomLinkTool";
import CustomList from "@/components/EditorJS/Renderers/CustomList";
import CustomMath from "@/components/EditorJS/Renderers/CustomMath";
import CustomParagraph from "@/components/EditorJS/Renderers/CustomParagraph";
import CustomTable from "@/components/EditorJS/Renderers/CustomTable";
import CustomToggle from "@/components/EditorJS/Renderers/CustomToggle";
import CustomVideo from "@/components/EditorJS/Renderers/CustomVideo";

// Pass your custom renderers to Output
export const renderers = {
	paragraph: CustomParagraph,
	header: CustomHeader,
	code: CustomCode,
	divider: CustomDivider,
	image: CustomImage,
	imagecarousel: CustomImageCarousel,
	linktool: CustomLinkTool,
	video: CustomVideo,
	checklist: CustomChecklist,
	table: CustomTable,
	// math: CustomMath,
	list: CustomList,
	iframe: CustomIframe,
	toggle: CustomToggle,
	callout: CustomCallout,
	file: CustomFile,
};
