import { OutputData } from "@editorjs/editorjs";
import { SvgIconTypeMap, SxProps } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { CSSProperties, ReactNode } from "react";
import { IconType } from "react-icons/lib";

// Object types

export type EditorjsRendererProps = {
	data: {
		text?: string;
		// header
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		// Video
		file?: {
			url?: string;
		};
		// Image
		url?: string;
		caption?: string;
		withBorder?: boolean;
		stretched?: boolean;
		withBackground?: boolean;
		unsplash?: {
			author?: string;
			profileLink?: string;
		};
		// LinkTool
		link?: string;
		meta?: {
			title?: string;
			description?: string;
			image?: string;
		};
		// Quote
		alignment?: string;
		// Table
		withHeadings?: boolean;
		content?: string;
		// content?: [[string]];
		// Personality
		name?: string;
		description?: string;
		photo?: string;
		// Checklist
		items?: [
			| string
			| {
					text?: string;
					checked?: boolean;
			  }
		];
		// Video
		autoplay?: boolean;
		controls?: boolean;
		muted?: boolean;
		// Math
		math?: string;
		// Lists
		style?: "ordered" | "unordered";
		// Iframe
		frame?: string;
		// Toggle
		status?: string;
		blocks?: any;
		// Code
		code?: string;
		language?: string;
		multiline?: boolean;
		linenumbers?: boolean;
		textwrap?: boolean;
		filename?: string;
		render?: boolean;
		// Callout
		icon?: string;
		type?: string;
		title?: string;
		message?: string;
		// Image
		height?: number;
		width?: number;
		blurhash?: string;
		fileref?: string;
		fileSize?: number;
	};
	style: {
		typography?: SxProps;
		box?: SxProps;
		h1?: CSSProperties;
		h2?: CSSProperties;
		h3?: CSSProperties;
		h4?: CSSProperties;
		h5?: CSSProperties;
		h6?: CSSProperties;
	};
	classNames: {
		h1?: string;
		h2?: string;
		h3?: string;
		h4?: string;
		h5?: string;
		h6?: string;
	};
	config: { disableDefaultStyle?: any };
};

export type SharePreviewCardProps = {
	title: string;
	description: string;
	ogImage: ImageProps;
	url: string;
	width: number;
	height: number;
};

export type PostCardProps = PostProps & {
	id: string;
};

export type ImageProps = {
	src: string;
	blurhash?: string;
	height?: number;
	width?: number;
	fileRef?: string;
	fileSize?: number;
};

type PostProps = {
	author: string;
	createdAt: number;
	description: string;
	ogImage: ImageProps;
	updatedAt: number;
	published: boolean;
	readTime: string;
	tags: string[];
	keywords: string[];
	title: string;
	type: string;
};

export type FullPost = PostProps & {
	data: OutputData;
};

export type FirestoreFullPost = PostProps & {
	// data: string;
	data: any;
};

export type StoredPost = PostProps & {
	id: string;
};

export type TablePost = StoredPost & {
	views: number | string;
};

export type NavbarSection = {
	name: string;
	path: string;
};

export type NavbarProps = {
	posts?: StoredPost[];
	textColor?: string;
	backgroundColor: string;
	accountPage?: boolean;
	setCardLayout?: (layout: "carousel" | "swipe" | "grid" | "list") => void;
};

// Component types

export type RevealProps = {
	markers?: boolean;
	repeat?: boolean;
	start?: string;
	x?: string;
	y?: string;
	children?: ReactNode;
	from_opacity?: number;
	to_opacity?: number;
	duration?: number;
	delay?: number;
};

// Menus

export type MenuProps = {
	open: boolean;
	handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
	handleMenuClose: () => void;
	anchorEl?: null | HTMLElement;
	setAnchorEl?: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
};

export type ProfileMenuProps = MenuProps & {
	accountButtonSx?: SxProps;
	showNotificationsBadge?: boolean;
	notifications?: ModalProps;
	settings?: ModalProps;
};

// Modals

export type ModalProps = {
	open: boolean;
	handleModalOpen: () => void;
	handleModalClose: () => void;
};

export type SettingsModalProps = ModalProps & {
	handleThemeChange: (event: any) => void;
};

export type ShareModalProps = ModalProps & {
	data: SharePreviewCardProps;
};

export type SearchModalProps = ModalProps & {
	postsOverview?: StoredPost[];
	handleSettingsModalOpen?: () => void;
	handleNotificationsModalOpen?: () => void;
	notificationsBadgeVisible?: boolean;
	setCardLayout?: (layout: string) => void;
	onOpen?: () => void;
};

export type Headings = {
	type: string;
	id: string | null;
	text: string;
};

export type TOCModalProps = ModalProps & {
	headings: Headings[];
	currentSection: string;
	postTitle: string;
	sidebarMode?: boolean;
};

export type NotificationProps = {
	id: number;
	createdAt: string;
	title: string;
	content: string;
	action: {
		href: string;
		caption: string;
	};
	important: boolean;
};

export type NotificationsModalProps = ModalProps & {
	lastRead: number;
	setLastRead: (date: number) => void;
	notificationsRead: number[];
	setNotificationsRead: (ids: number[]) => void;
	allNotificationsFilteredOnDate: NotificationProps[];
	unreadNotificationsIds: number[];
	setVisibleBadgeNotifications: (value: boolean) => void;
	notificationsFilterDays: number;
	setNotificationsFilterDays: (value: number) => void;
};

// Buttons
export type ButtonProps = {
	variant: "outline" | "base";
	icon?:
		| (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
				muiName: string;
		  })
		| IconType;
	onClick?: (() => void) | ((event: React.MouseEvent<HTMLElement>) => void);
	href?: string;
	disabled?: boolean;
	sxButton?: SxProps & {
		// backgroundColor?: string;
		// backgroundColorHover?: string;
		// height?: string;
		// width?: string;
	};
	sxIcon?: SxProps & {
		// color?: string;
		// colorHover?: string;
		// height?: string;
		// width?: string;
	};
	styleIcon?: CSSProperties;
	tooltip?: string;
	ariaControls?: string;
	ariaHasPopup?: any;
	ariaExpanded?: any;
	type?: "button" | "submit" | "reset";
	LinkComponent?: any;
	replace?: any;
};

// export type SearchButtonProps = ButtonProps;

// View props types
export type ManageArticleViewProps = {
	post?: FullPost;
};
export type ReadArticleViewProps = { post: FullPost; postId: string };
export type LandingPageProps = { posts: StoredPost[] };
export type TagsPageProps = { posts: StoredPost[]; tags: string[] };
export type ListViewProps = {};
export type FooterProps = {};
